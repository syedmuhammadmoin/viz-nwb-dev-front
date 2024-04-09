import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild} from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import { GridOptions} from 'ag-grid-community';
import { IReport } from '../model/IReport';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { FixedAssetReportService } from '../services/fixed-asset-report.service';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { ASSET_REPORT } from 'src/app/views/shared/AppRoutes';
import { AssetService } from '../../asset/service/asset.service';
import { IAsset } from '../../asset/model/IAsset';
import { isEmpty } from 'lodash';


@Component({
  selector: 'kt-register-asset',
  templateUrl: './register-asset.component.html',
  styleUrls: ['./register-asset.component.scss']
})
export class RegisterAssetComponent extends AppComponentBase implements OnInit {

  // for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;

  // gridOptions: any;;

  autoGroupColumnDef;
  openingBalance = 0;
  balance = 0;
  columnDefs;
  defaultColDef: any

  // Busy Loading
  isLoading: boolean;

  disability = false;

  // Declaring FormGroup
  registerAssetForm: FormGroup;

  // For AG Grid..
  gridOptions: any;;
  rowData: IAsset[] | any = [];
  reportModel: IReport = {} as IReport;

  // Validation Messages
  validationMessages = {
    fixedAssetId: {
      required: 'Fixed Asset is required.'
    }
  }

  // Error keys for validation messages
  formErrors: any = {
    fixedAssetId: ''
  }

  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    injector: Injector,
    public ngxService: NgxsCustomService,
    private assetService: AssetService
  ) {
    super(injector);
    //Defining Employee Columns
  this.columnDefs = [
    {
      headerName: 'Transaction Date',
      field: 'transectionDate',
      cellStyle: { textAlign: 'left' },
      suppressHeaderMenuButton: true,
      cellRenderer: (params: any) => {
        const date = params?.data?.transectionDate != null ? params?.data?.transectionDate : null;
        return date == null ? null : this.transformDate(date, 'MMM d, y');
      }
    },

    {
      headerName: 'Begining Book Value',
      field: 'beginingBookValue',
      valueFormatter: (params) => this.valueFormatter(params.value),
      cellStyle: { textAlign: 'left' },
      suppressHeaderMenuButton: true,
    },
    {
      headerName: 'Depreciation Amount',
      field: 'depreciationAmount',
      suppressHeaderMenuButton: true,
      valueFormatter: (params) => this.valueFormatter(params.value),
      cellStyle: { textAlign: 'left' }
    },
    {
      headerName: 'Ending Book Value',
      field: 'endingBookValue',
      suppressHeaderMenuButton: true,
      valueFormatter: (params) => this.valueFormatter(params.value),
      cellStyle: { textAlign: 'left' }
    },
    {
      headerName: 'Description',
      field: 'description',
      suppressHeaderMenuButton: true,
      width: 300,
      cellStyle: { textAlign: 'left' }
    }
  ];
  }

  ngOnInit(): void {

    // AG Grid Options
    this.gridOptions = ({} as GridOptions);
    this.gridOptions.rowHeight = 30;
    this.gridOptions.headerHeight = 35;
    this.gridOptions.suppressAggFuncInHeader = true;

    this.defaultColDef = {
      filter: true,
      sortable: false,
      resizable: true,
      menuTabs: ['filterMenuTab'],
    };

    // initializing formGroup
    this.registerAssetForm = this.fb.group({
      fixedAssetId: ['', [Validators.required]]
    });

    // Get Data From Store
    this.ngxService.getAssetsFromState();
  }

  onSubmit() {
    if (this.registerAssetForm.invalid) {
      this.logValidationErrors(this.registerAssetForm, this.formErrors, this.validationMessages);
      return;
    }

    this.isLoading = true;
    this.assetService.getAssetById(this.registerAssetForm.value.fixedAssetId.id)
      .subscribe((res: any) => {
        const depRegisterList = res.result?.depreciationRegisterList;

        if (!isEmpty(depRegisterList)) {
          this.rowData = depRegisterList;
          this.disability = true;
        }
        else {
          this.disability = false;
        }
        this.isLoading = false;
        this.cdRef.detectChanges();
      })
  }

  reset() {
    this.formDirective.resetForm();
    this.rowData = [];
    this.isLoading = false;
    // for PDF
    //this.disability = true;
  }

  onFirstDataRendered(params: any) {
    params.api.sizeColumnsToFit();
  }

  printRegisterAssetReport() {
    this.router.navigate(['/' + ASSET_REPORT.REGISTER_ASSET_PRINT], {
      queryParams: {
        fixedAssetId: (this.registerAssetForm.value.fixedAssetId.id),
      }
    })
  }
}


















