import { Component, Injector, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { ColDef, FirstDataRenderedEvent, GridOptions } from 'ag-grid-community';
import { ActionButton, DocumentStatus, DocType, Permissions } from 'src/app/views/shared/AppEnum';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { finalize, take } from 'rxjs/operators';
import { AssetService } from '../service/asset.service';
import { CreateAssetComponent } from '../create-asset/create-asset.component';

@Component({
  selector: 'kt-asset-detail',
  templateUrl: './asset-detail.component.html',
  styleUrls: ['./asset-detail.component.scss']
})
export class AssetDetailComponent extends AppComponentBase implements OnInit {

  docType = DocType
  public permissions = Permissions;
  action = ActionButton
  docStatus = DocumentStatus

  //For ag grid
  gridOptions: GridOptions;
  defaultColDef: ColDef;

  //kt busy loading
  isLoading: boolean;

  //need for routing
  assetId: number;

  //Variables for asset data
  assets: any
  assetMaster:  any;
  status: string;

  constructor(
    private assetService: AssetService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector)
    this.gridOptions = ({} as GridOptions);
    this.defaultColDef = { resizable: true };
  }

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

    this.calculateDepreciation();
  }

  // First time rendered ag grid
  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  //Getting Asset Master Data
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
      this.assets = res.result;
      this.cdRef.detectChanges();
    })
  }

  editAsset(id?: number): void {
    this.dialog.open(CreateAssetComponent, {
      width: '800px',
      data: {
        assetData: this.assetMaster
      }
    });
    // //Recalling getAsset function on dialog close
    // dialogRef.afterClosed().subscribe(() => {
    //   this.cdRef.detectChanges();
    // });
  }




  //************DEFFERENT */

  purchasePrice: number = 250000;
  salvageValue: number = 25000
  depreciableValue = this.purchasePrice - this.salvageValue;
  usefulLife = 5;
  activeDate : Date = new Date('1/1/2019');
  day = this.activeDate.getDate() ;
  month = this.activeDate.getMonth() + 1; 
  isActive : boolean = true;
  method: string = 'straightLine'
  endingBookValue = 0;
  accumulatedDepreciation = 0;
  beginingBookValue = 0;
  totalDaysInYear: number = 0;


                                            

//get Fisacal Year from organization
// organization end date


  calculateDepreciation() {
    if(this.isActive) {
      //entries
      //representing i as entries here
      // if(this.method === 'straightLine') { 
      //    var chargeForTheYear = 0;
      //    var numOfDays = 0;
      //    for(var i = 1 ; i <= 6 ; i++) {
      //     if(i === 1) {
      //       if(this.day <= 30) {
      //           numOfDays = (((12 - this.month) * 30) + (30 - this.day));
      //       }
    
      //       if(this.day > 30) {
      //           numOfDays = (((12 - this.month) * 30) + ((30 - this.day) + 2));
      //       }
    
      //        chargeForTheYear = (this.depreciableValue / this.usefulLife) * (numOfDays/360);
      //     } 
    
      //     else if(i > 1 && i < 6) {
      //         chargeForTheYear = (this.depreciableValue / this.usefulLife);
      //     }
    
      //     else if(i === 6) {
      //       if(this.day <= 30) {
      //           numOfDays = (((this.month - 1) * 30) + (this.day));
      //       }
    
      //       if(this.day > 30) {
      //           numOfDays = (((this.month - 1) * 30) + ((this.day) - 2));
      //       }
      //          chargeForTheYear = (this.depreciableValue / this.usefulLife) * (numOfDays / 360)
      //     }
    
      //      if(i === 1) {
      //         this.beginingBookValue = this.purchasePrice;
      //         this.endingBookValue = this.purchasePrice - chargeForTheYear;
      //         this.accumulatedDepreciation = chargeForTheYear;
      //       }
    
      //      else {
      //         //get AccumulatedDepreciation and endingBookValue from Database;
      //         //accumulatedDepreciation = ....;
      //         //endingBookValue = ....;
    
      //         this.beginingBookValue = this.endingBookValue;
      //         this.endingBookValue = this.endingBookValue - chargeForTheYear;
      //         this.accumulatedDepreciation = this.accumulatedDepreciation + chargeForTheYear;
      //      }

      //      //consoling
      //      console.log('beginingBookValue  chargeForTheYear     AccumulatedDepreciation     endingBookValue')
        
      //      console.log([
      //                    this.beginingBookValue,
      //                    Number(chargeForTheYear),
      //                    Number(this.accumulatedDepreciation),
      //                    this.endingBookValue,
      //                    ])                         
      //    }

      //                    var date1 = new Date("12/31/2025");
      //                    var date2 = new Date("3/25/2026");


                           
      //                    // To calculate the time difference of two dates
      //                    var Difference_In_Time = date2.getTime() - date1.getTime();
                           
      //                    // To calculate the no. of days between two dates
      //                    var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);

      //                    console.log("DATE : ")
      //                    console.log(Difference_In_Days)  
      // }

      this.totalDaysInYear = this.daysInYear(this.activeDate.getFullYear());

      if(this.method === 'straightLine') { 
        var chargeForTheYear = 0;
        var numOfDays = 0;
        for(var i = 1 ; i <= 6 ; i++) {
         if(i === 1) {
           if(this.day <= 30) {
               numOfDays = (((12 - this.month) * 30) + (30 - this.day));
           }
   
           if(this.day > 30) {
               numOfDays = (((12 - this.month) * 30) + ((30 - this.day) + 2));
           }
   
            chargeForTheYear = (this.depreciableValue / this.usefulLife) * (numOfDays/this.totalDaysInYear);
         } 
   
         else if(i > 1 && i < 6) {
             chargeForTheYear = (this.depreciableValue / this.usefulLife);
         }
   
         else if(i === 6) {
           if(this.day <= 30) {
               numOfDays = (((this.month - 1) * 30) + (this.day));
           }
   
           if(this.day > 30) {
               numOfDays = (((this.month - 1) * 30) + ((this.day) - 2));
           }
              chargeForTheYear = (this.depreciableValue / this.usefulLife) * (numOfDays / this.totalDaysInYear)
         }
   
          if(i === 1) {
             this.beginingBookValue = this.purchasePrice;
             this.endingBookValue = this.purchasePrice - chargeForTheYear;
             this.accumulatedDepreciation = chargeForTheYear;
           }
   
          else {
             //get AccumulatedDepreciation and endingBookValue from Database;
             //accumulatedDepreciation = ....;
             //endingBookValue = ....;
   
             this.beginingBookValue = this.endingBookValue;
             this.endingBookValue = this.endingBookValue - chargeForTheYear;
             this.accumulatedDepreciation = this.accumulatedDepreciation + chargeForTheYear;
          }

          //consoling
          console.log('beginingBookValue  chargeForTheYear     AccumulatedDepreciation     endingBookValue')
       
          console.log([
                        this.beginingBookValue,
                        Number(chargeForTheYear),
                        Number(this.accumulatedDepreciation),
                        this.endingBookValue,
                        ])                         
        }

                         
     }
    }
  }

  daysInYear(year: number) {
    return ((year % 4 === 0 && year % 100 > 0) || year %400 == 0) ? 366 : 365;
  }

  getTotalDays(activeDate , organizationEndDate) {
    activeDate = new Date("12/31/2025");
    organizationEndDate = new Date("3/25/2026");
      
    // To calculate the no. of days between two dates
    var Difference_In_Days = (activeDate.getTime() - organizationEndDate.getTime()) / (1000 * 3600 * 24);

    console.log("DAYS IN Year : ")
    console.log(Difference_In_Days)
  }

}



