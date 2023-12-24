import {ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {ActivatedRoute, Params} from '@angular/router';
import {ColDef, FirstDataRenderedEvent, GridOptions} from 'ag-grid-community';
import {ActionButton, DepreciationMethod, DocType, DocumentStatus, Permissions} from 'src/app/views/shared/AppEnum';
import {AppComponentBase} from 'src/app/views/shared/app-component-base';
import {IApiResponse} from 'src/app/views/shared/IApiResponse';
import {finalize, take} from 'rxjs/operators';
import {AssetService} from '../service/asset.service';
import {CreateAssetComponent} from '../create-asset/create-asset.component';
import {CustomRemarksComponent} from 'src/app/views/shared/components/custom-remarks/custom-remarks.component';
import {ASSET} from 'src/app/views/shared/AppRoutes';
import {ConfirmationDialogComponent} from 'src/app/views/shared/components/confirmation-dialog/confirmation-dialog.component';
import {NgxsCustomService} from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import {IsReloadRequired} from '../../../profiling/store/profiling.action';
import {DisposalDropdownState} from '../store/disposal-dropdown.state';
import { ScheduleDepreciationComponent } from '../schedule-depreciation/schedule-depreciation.component';


// fixed asset table interface
interface IFixedAssetTable {
  year: number;
  beginingBookValue: number;
  chargeForTheYear: number;
  accumulatedDepreciation: number;
  endingBookValue: number;
}

@Component({
  selector: 'kt-asset-detail',
  templateUrl: './asset-detail.component.html',
  styleUrls: ['./asset-detail.component.scss']
})
export class AssetDetailComponent extends AppComponentBase implements OnInit {

  constructor(
    private assetService: AssetService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    public ngxsService: NgxsCustomService,
    injector: Injector,
  ) {
    super(injector)
    this.gridOptions = ({} as GridOptions);
    this.defaultColDef = {resizable: true};
  }

  docType = DocType
  public permissions = Permissions;
  public ASSET = ASSET;
  action = ActionButton
  docStatus = DocumentStatus

  modelType: any = DepreciationMethod

  // For ag grid
  gridOptions: GridOptions;
  defaultColDef: ColDef;

  // kt busy loading
  isLoading: boolean;

  // need for routing
  assetId: number;

  // Variables for asset data
  assets: any
  assetMaster: any;
  status: string;

  // Showing Remarks
  remarksList: string[] = [];


  // ************DEFFERENT */

  purchasePrice = 250000;
  salvageValue = 15000
  depreciableValue = this.purchasePrice - this.salvageValue;
  usefulLife = 5;
  activeDate: Date = new Date('3/25/2021');
  organizationStartDate: Date = new Date('1/1/2016');
  organiationEndDate: Date = new Date('12/31/2017');
  year = 2021;
  day = this.activeDate.getDate();
  month = this.activeDate.getMonth() + 1;
  isActive = true;
  // method: string = 'decliningBalance'
  method = 'straightLine'
  endingBookValue = 0;
  accumulatedDepreciation = 0;
  isProrataBasis = true;
  decliningFactor = 0.1
  decliningPercentage: number = this.decliningFactor
  sameYear = false;
  beginingBookValue = 0;
  totalDaysInYear: number = this.daysInYear(this.activeDate.getFullYear());
  chargeForTheYear = 0;
  numOfDays = 0;

  // fixed asset table store
  fixedAssetList: IFixedAssetTable[] = []

  ngOnInit() {
    this.route.paramMap.subscribe((params: Params) => {
      const id = +params.get('id');
      if (id) {
        this.isLoading = true;
        this.assetId = id;
        this.getAssetData(id);
        this.cdRef.markForCheck();
      }
    });

    this.gridOptions.rowHeight = 40;
    this.gridOptions.headerHeight = 35;

    // this.straightLineProrataBasis();
    // this.decliningBalanceProrataBasis()
    // this.decliningBalance()
    // this.calculateDepreciationForStraightLineWithoutProrataBasis();

    // this.straightLineProrataBasisForDatabase()

  }

  // First time rendered ag grid
  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  // Getting Asset Master Data
  getAssetData(id: number) {
    this.assetService.getAssetById(id)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe((res: IApiResponse<any>) => {
        this.assetMaster = res.result;
        this.remarksList = this.assetMaster.remarksList ?? []
        // this.assets = res.result;
        this.cdRef.detectChanges();
      })
  }
  shouldShowDepreciationButton(): boolean {
    return this.assetMaster?.depreciationApplicability === true;
  }
  editAsset(id?: number): void {
    this.dialog.open(CreateAssetComponent, {
      width: '800px',
      data: {
        id,
        status: this.assetMaster?.state
      }
    });
    // //Recalling getAsset function on dialog close
    // dialogRef.afterClosed().subscribe(() => {
    //   this.cdRef.detectChanges();
    // });
  }

  
  // open modal funtion
  depreciationSchedule(): void {
    this.dialog.open(ScheduleDepreciationComponent, {
      width: '1000px',
      data: this.assetMaster?.id
    });
  }


// get Fisacal Year from organization
// organization end date


// STRAIGH LINE METHOD WITH PRORATA
  straightLineProrataBasis() {

    this.organizationStartDate.setFullYear(this.activeDate.getFullYear())

    // if( this.organizationStartDate.getMonth() < this.activeDate.getMonth()) {
    //   this.organizationStartDate.setFullYear(this.activeDate.getFullYear())
    // }
    if (this.organizationStartDate.getMonth() > this.activeDate.getMonth()) {
      this.organizationStartDate.setFullYear(this.activeDate.getFullYear() - 1)
    } else if (this.organizationStartDate.getMonth() === this.activeDate.getMonth()) {
      if (this.organizationStartDate.getDate() === this.activeDate.getDate()) {
        // this.organizationStartDate.setFullYear(this.activeDate.getFullYear())
        this.sameYear = true;
        this.straightLine()
      }
        // else if( this.organizationStartDate.getDate() < this.activeDate.getDate()) {
        //   this.organizationStartDate.setFullYear(this.activeDate.getFullYear())
      // }
      else if (this.organizationStartDate.getDate() > this.activeDate.getDate()) {
        this.organizationStartDate.setFullYear(this.activeDate.getFullYear() - 1)
      }
    }

    this.organiationEndDate.setFullYear(this.organizationStartDate.getFullYear())
    this.organiationEndDate.setMonth(this.organizationStartDate.getMonth() + 12)
    this.organiationEndDate.setDate(this.organizationStartDate.getDate() - 1)

    console.log('dates')
    console.log(this.organizationStartDate)
    console.log(this.organiationEndDate)
    // console.log(this.getTotalDays(this.organizationStartDate , this.organiationEndDate , true))

    let firstYearCharge = 0;


    if (this.isActive) {
      if (this.method === 'straightLine' && (this.sameYear === false)) {
        console.log('entered in prorata')
        for (let i = 0; i <= this.usefulLife; i++) {

          if (i === 0) {
            this.numOfDays = this.getTotalDays(this.activeDate, this.organiationEndDate, true)
            this.chargeForTheYear = (this.depreciableValue / this.usefulLife) * (this.numOfDays / this.totalDaysInYear);
            firstYearCharge = this.chargeForTheYear
          } else if (i > 0 && i < this.usefulLife) {
            this.chargeForTheYear = (this.depreciableValue / this.usefulLife);
          } else if (i === this.usefulLife) {

            // this.numOfDays = this.getTotalDays(this.activeDate , this.organizationStartDate, false)
            // this.chargeForTheYear = (this.depreciableValue / this.usefulLife) * (this.numOfDays / this.totalDaysInYear)
            this.chargeForTheYear = ((this.depreciableValue) - this.accumulatedDepreciation)
          }

          if (i === 0) {
            this.beginingBookValue = this.purchasePrice;
            this.endingBookValue = this.purchasePrice - this.chargeForTheYear;
            this.accumulatedDepreciation = this.chargeForTheYear;
          } else {
            this.beginingBookValue = this.endingBookValue;
            this.endingBookValue = this.endingBookValue - this.chargeForTheYear;
            this.accumulatedDepreciation = this.accumulatedDepreciation + this.chargeForTheYear;
          }

          // storing values in fixed asset table
          this.valuesInFixedAssetTable()
          this.year++
        }
      }
    }
  }


  // STRAIGHT LINE METHOD WITHOUT PRORATA
  straightLine() {
    if (this.isActive) {
      if (this.method === 'straightLine') {
        for (let i = 0; i < this.usefulLife; i++) {

          if (i < this.usefulLife) {
            this.chargeForTheYear = (this.depreciableValue / this.usefulLife);
          }

          if (i === 0) {
            this.beginingBookValue = this.purchasePrice;
            this.endingBookValue = this.purchasePrice - this.chargeForTheYear;
            this.accumulatedDepreciation = this.chargeForTheYear;
          } else {
            this.beginingBookValue = this.endingBookValue;
            this.endingBookValue = this.endingBookValue - this.chargeForTheYear;
            this.accumulatedDepreciation = this.accumulatedDepreciation + this.chargeForTheYear;
          }

          // storing values in fixed asset table
          this.valuesInFixedAssetTable()
          this.year++
        }
      }
    }
  }


  // DECLINING BALANCE METHOD WITH PRORATA
  decliningBalanceProrataBasis() {

    if (this.organizationStartDate.getMonth() < this.activeDate.getMonth()) {
      this.organizationStartDate.setFullYear(this.activeDate.getFullYear())
    } else if (this.organizationStartDate.getMonth() > this.activeDate.getMonth()) {
      this.organizationStartDate.setFullYear(this.activeDate.getFullYear() - 1)
    } else if (this.organizationStartDate.getMonth() === this.activeDate.getMonth()) {
      if (this.organizationStartDate.getDate() === this.activeDate.getDate()) {
        this.organizationStartDate.setFullYear(this.activeDate.getFullYear())
        this.sameYear = true;
        this.decliningBalance()
      } else if (this.organizationStartDate.getDate() < this.activeDate.getDate()) {
        this.organizationStartDate.setFullYear(this.activeDate.getFullYear())
      } else if (this.organizationStartDate.getDate() > this.activeDate.getDate()) {
        this.organizationStartDate.setFullYear(this.activeDate.getFullYear() - 1)
      }
    }

    this.organiationEndDate.setFullYear(this.organizationStartDate.getFullYear())
    this.organiationEndDate.setMonth(this.organizationStartDate.getMonth() + 12)
    this.organiationEndDate.setDate(this.organizationStartDate.getDate() - 1)

    // if Asset is Active
    if (this.isActive) {
      // if Prorata Basis ON
      if (this.isProrataBasis) {
        if (this.method === 'decliningBalance' && (this.sameYear === false)) {
          console.log('entered in prorata')
          // consoling
          console.log('Year', 'beginingBookValue  this.chargeForTheYear     AccumulatedDepreciation     endingBookValue')
          // looping according to functionality
          for (let i = 0; i <= this.usefulLife; i++) {

            // depreciate all remaning bookvalue after useful life ends
            if (i === this.usefulLife) {
              this.chargeForTheYear = (this.depreciableValue - this.accumulatedDepreciation);
            } else if (i === 0) {
              this.numOfDays = this.getTotalDays(this.activeDate, this.organiationEndDate, true)
              console.log('number of days in firs year')
              console.log(this.numOfDays)
              console.log(this.totalDaysInYear)
              this.chargeForTheYear = (this.depreciableValue) * this.decliningFactor * (this.numOfDays / this.totalDaysInYear);
            }
            // depreciate values according to declining percentage
            else if (this.decliningPercentage <= 1.0) {
              this.chargeForTheYear = (this.depreciableValue - this.accumulatedDepreciation) * this.decliningFactor;
            }


            //  else if(i < this.usefulLife) {
            //      this.chargeForTheYear = (this.depreciableValue - this.accumulatedDepreciation) * this.decliningFactor;
            //  }


            // table values for the first year
            if (i === 0) {
              this.beginingBookValue = this.purchasePrice;
              this.endingBookValue = this.purchasePrice - this.chargeForTheYear;
              this.accumulatedDepreciation = this.chargeForTheYear;
              // storing values in fixed asset table
              this.valuesInFixedAssetTable()
            }

            // table values below 100%
            else if (this.decliningPercentage <= 1.0) {
              this.beginingBookValue = this.endingBookValue;
              this.endingBookValue = this.endingBookValue - this.chargeForTheYear;
              this.accumulatedDepreciation = this.accumulatedDepreciation + this.chargeForTheYear;
              // storing values in fixed asset table
              this.valuesInFixedAssetTable()
            }

            // checking if declinig Percentage exceeding 100%
            if (this.decliningPercentage > 1.0) {
              // charge for the year
              this.chargeForTheYear = (this.depreciableValue - this.accumulatedDepreciation);

              this.beginingBookValue = this.endingBookValue;
              this.endingBookValue = this.endingBookValue - this.chargeForTheYear;
              this.accumulatedDepreciation = this.accumulatedDepreciation + this.chargeForTheYear;

              // checking if charge for the year in not zero
              if (this.chargeForTheYear != 0) {
                // storing values in fixed asset table
                this.valuesInFixedAssetTable()
              }

              // consoling fixed asset table
              console.log(this.fixedAssetList)
              return // end operation after 100% charge
            }

            // increment given declining percentage
            this.decliningPercentage += this.decliningFactor;
            // increment year
            this.year++;
          }

          // consoling fixed asset table
          console.log('list')
          console.log(this.fixedAssetList)
        }
      }
    }
  }


  // DELINING BALANCE METHOD WITHOUT PRORATA
  decliningBalance() {
    // if Asset is Active
    if (this.isActive) {
      if (this.method === 'decliningBalance') {
        // looping according to functionality
        for (let i = 0; i < this.usefulLife; i++) {

          // depreciate all remaning bookvalue after useful life ends
          if (i === this.usefulLife - 1) {
            this.chargeForTheYear = (this.depreciableValue - this.accumulatedDepreciation);
          }
          // depreciate values according to declining percentage
          else if (this.decliningPercentage <= 1.0) {
            this.chargeForTheYear = (this.depreciableValue - this.accumulatedDepreciation) * this.decliningFactor;
          }

          // table values for the first year
          if (i === 0) {
            this.beginingBookValue = this.purchasePrice;
            this.endingBookValue = this.purchasePrice - this.chargeForTheYear;
            this.accumulatedDepreciation = this.chargeForTheYear;
            // storing values in fixed asset table
            this.valuesInFixedAssetTable()
          }

          // table values below 100%
          else if (this.decliningPercentage <= 1.0) {
            this.beginingBookValue = this.endingBookValue;
            this.endingBookValue = this.endingBookValue - this.chargeForTheYear;
            this.accumulatedDepreciation = this.accumulatedDepreciation + this.chargeForTheYear;
            // storing values in fixed asset table
            this.valuesInFixedAssetTable()
          }

          // checking if declinig Percentage exceeding 100%
          if (this.decliningPercentage > 1.0) {
            // charge for the year
            this.chargeForTheYear = (this.depreciableValue - this.accumulatedDepreciation);

            this.beginingBookValue = this.endingBookValue;
            this.endingBookValue = this.endingBookValue - this.chargeForTheYear;
            this.accumulatedDepreciation = this.accumulatedDepreciation + this.chargeForTheYear;

            // checking if charge for the year in not zero
            if (this.chargeForTheYear != 0) {
              // storing values in fixed asset table
              this.valuesInFixedAssetTable()
            }

            // consoling fixed asset table
            console.log(this.fixedAssetList)
            return // end operation after 100% charge
          }

          // increment given declining percentage
          this.decliningPercentage += this.decliningFactor;
          // increment year
          this.year++;
        }

        // consoling fixed asset table
        console.log('list')
        console.log(this.fixedAssetList)
      }
    }
  }


  // straightLineProrataBasisForDatabase() {

  //   let entries = 2;

  //   this.organizationStartDate.setFullYear(this.activeDate.getFullYear())

  //   // if( this.organizationStartDate.getMonth() < this.activeDate.getMonth()) {
  //   //   this.organizationStartDate.setFullYear(this.activeDate.getFullYear())
  //   // }
  //   if( this.organizationStartDate.getMonth() > this.activeDate.getMonth()) {
  //     this.organizationStartDate.setFullYear(this.activeDate.getFullYear() - 1)
  //   }
  //   else if(this.organizationStartDate.getMonth() === this.activeDate.getMonth()) {
  //     if(this.organizationStartDate.getDate() === this.activeDate.getDate()) {
  //       // this.organizationStartDate.setFullYear(this.activeDate.getFullYear())
  //       this.sameYear = true;
  //       this.straightLine()
  //     }
  //     // else if( this.organizationStartDate.getDate() < this.activeDate.getDate()) {
  //     //   this.organizationStartDate.setFullYear(this.activeDate.getFullYear())
  //     // }
  //     else if( this.organizationStartDate.getDate() > this.activeDate.getDate()) {
  //       this.organizationStartDate.setFullYear(this.activeDate.getFullYear() - 1)
  //     }
  //   }

  //   this.organiationEndDate.setFullYear(this.organizationStartDate.getFullYear())
  //   this.organiationEndDate.setMonth(this.organizationStartDate.getMonth() + 12)
  //   this.organiationEndDate.setDate(this.organizationStartDate.getDate() - 1)

  //   console.log("dates")
  //   console.log(this.organizationStartDate)
  //   console.log(this.organiationEndDate)
  //   // console.log(this.getTotalDays(this.organizationStartDate , this.organiationEndDate , true))

  //   let firstYearCharge = 0;

  //   if(this.isActive) {
  //     if(this.method === 'straightLine' && (this.sameYear === false)) {
  //       console.log("entered in prorata")
  //       for(var i = 0 ; i <= this.usefulLife ; i++) {
  //         if(i === 0) {
  //           if(entries != 0) {
  //             i = entries;
  //             this.fixedAssetList.push({
  //               year : 2021,
  //               beginingBookValue: 250000,
  //               chargeForTheYear:  34643.83561643835,
  //               accumulatedDepreciation:  34643.83561643835,
  //               endingBookValue: 215356.16438356164
  //             })

  //             this.beginingBookValue = 250000;
  //            this.endingBookValue = 250000 - 34643.83561643835;
  //            this.accumulatedDepreciation = 0 + 34643.83561643835;
  //            firstYearCharge = 34643.83561643835
  //            this.year++


  //            this.fixedAssetList.push({
  //             year : 2022,
  //             beginingBookValue: 215356.16438356164,
  //             chargeForTheYear:  46000,
  //             accumulatedDepreciation:  80643.83561643836,
  //             endingBookValue: 169356.16438356164
  //           })

  //           this.beginingBookValue = 169356.16438356164;
  //           this.endingBookValue = 169356.16438356164;
  //           this.accumulatedDepreciation = 80643.83561643836;
  //           this.year++
  //           }
  //         }

  //        if(i === 0) {
  //          this.numOfDays = this.getTotalDays(this.activeDate , this.organiationEndDate , true)
  //          this.chargeForTheYear = (this.depreciableValue / this.usefulLife) * (this.numOfDays/this.totalDaysInYear);
  //          firstYearCharge = this.chargeForTheYear
  //        }

  //        else if(i > 0 && i < this.usefulLife) {
  //         console.log(i)
  //            this.chargeForTheYear = (this.depreciableValue / this.usefulLife);
  //        }

  //        else if(i === this.usefulLife) {

  //           // this.numOfDays = this.getTotalDays(this.activeDate , this.organizationStartDate, false)
  //           // this.chargeForTheYear = (this.depreciableValue / this.usefulLife) * (this.numOfDays / this.totalDaysInYear)
  //           this.chargeForTheYear = ((this.depreciableValue) - this.accumulatedDepreciation) //((this.depreciableValue / this.usefulLife) - firstYearCharge)
  //        }

  //         if(i === 0) {
  //            this.beginingBookValue = this.purchasePrice;
  //            this.endingBookValue = this.purchasePrice - this.chargeForTheYear;
  //            this.accumulatedDepreciation = this.chargeForTheYear;
  //          }

  //         else {
  //            this.beginingBookValue = this.endingBookValue;
  //            this.endingBookValue = this.endingBookValue - this.chargeForTheYear;
  //            this.accumulatedDepreciation = this.accumulatedDepreciation + this.chargeForTheYear;
  //         }

  //         //storing values in fixed asset table
  //         this.valuesInFixedAssetTable()
  //         this.year++
  //       }

  //       console.log(this.fixedAssetList)
  //    }
  //   }
  // }


  // set organization dates according to active date

  // storing values in fixed asset table
  valuesInFixedAssetTable() {
    this.fixedAssetList.push({
      year: this.year,
      beginingBookValue: this.beginingBookValue,
      chargeForTheYear: Number(this.chargeForTheYear),
      accumulatedDepreciation: Number(this.accumulatedDepreciation),
      endingBookValue: this.endingBookValue
    })
  }


  // check leap year
  daysInYear(year: number) {
    return ((year % 4 === 0 && year % 100 > 0) || year % 400 == 0) ? 366 : 365;
  }


  // calculate days between two dates
  getTotalDays(activeDate: Date, organizationDate: Date, isfirstYear: boolean): number {
    let Difference_In_Days = 0;
    if (isfirstYear) {
      // calculate days for first year
      Difference_In_Days = (organizationDate.getTime() - activeDate.getTime()) / (1000 * 3600 * 24);
      if (Difference_In_Days === 0) {
        Difference_In_Days = 1
      }
      console.log(organizationDate)
      console.log(activeDate)
      console.log(Difference_In_Days)
    } else {
      // calculate days for last year
      Difference_In_Days = ((activeDate.getTime() - organizationDate.getTime()) / (1000 * 3600 * 24)) + 1;
    }

    return Difference_In_Days
  }

  // Get Remarks From User
  conformationDailog(action?: any): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '740px'
    });

    // sending remarks data after dialog closed
    dialogRef.afterClosed().subscribe((res) => {
      console.log(res);
      if (res) {
        this.heldForDisposal()
      }
    })
  }

  // Get Remarks From User
  remarksDialog(action: any): void {
    const dialogRef = this.dialog.open(CustomRemarksComponent, {
      width: '740px'
    });
    // sending remarks data after dialog closed
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.workflow(action, res.data)
      }
    })
  }

  heldForDisposal() {
    this.isLoading = true;
    this.assetService.heldForDisposal(this.assetMaster.id)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe((res) => {
        this.ngxsService.store.dispatch(new IsReloadRequired(DisposalDropdownState, true))
        this.cdRef.detectChanges();
        this.router.navigate(['/' + ASSET.LIST])
      })
    console.log(this.assetMaster.id)
  }

  workflow(action: number, remarks: string) {
    this.isLoading = true
    this.assetService.workflow({action, docId: this.assetMaster.id, remarks})
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe((res) => {
        this.getAssetData(this.assetId);
        this.cdRef.detectChanges();
        this.toastService.success('' + res.message, 'Asset');
      })
  }

}
