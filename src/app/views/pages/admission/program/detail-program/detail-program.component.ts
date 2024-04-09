import {ChangeDetectorRef, Component, Injector, OnInit} from '@angular/core';
import {AppComponentBase} from '../../../../shared/app-component-base';
import {ActionButton, DocType, DocumentStatus, Permissions} from '../../../../shared/AppEnum';
import {ColDef, FirstDataRenderedEvent, GridOptions, ICellRendererParams, ValueFormatterParams} from 'ag-grid-community';
import {ITransactionRecon} from '../../../purchase/vendorBill/model/ITransactionRecon';
import {ActivatedRoute, Params} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {finalize, take} from 'rxjs/operators';
import {IApiResponse} from '../../../../shared/IApiResponse';
import {CustomRemarksComponent} from '../../../../shared/components/custom-remarks/custom-remarks.component';
import {CustomUploadFileComponent} from '../../../../shared/components/custom-upload-file/custom-upload-file.component';
import {IProgram, ISemesterCoursesList} from '../models/IProgram';
import {ProgramService} from '../service/program.service';
import {PROGRAM} from '../../../../shared/AppRoutes';

@Component({
  selector: 'kt-detail-program',
  templateUrl: './detail-program.component.html',
  styleUrls: ['./detail-program.component.scss']
})
export class DetailProgramComponent extends AppComponentBase implements OnInit {

  PROGRAM = PROGRAM

  docType = DocType
  public permissions = Permissions;
  action = ActionButton
  docStatus = DocumentStatus

  // For ag grid
  gridOptions: any;;
  defaultColDef: ColDef;

  transactionReconModel: ITransactionRecon = {} as ITransactionRecon;

  // Loader
  isLoading: boolean;

  // need for routing
  programId: number;

  loader = true;

  // Variables for Invoice data
  semesterCoursesList: ISemesterCoursesList | any
  programMaster: IProgram = {} as IProgram;
  status: string;

  // Showing Remarks
  remarksList: string[] = [];

  constructor(
    private programService: ProgramService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector)
    this.gridOptions = ({} as GridOptions);
    this.defaultColDef = { resizable: true, sortable: false };
  }

  // Defining Invoice Columns
  columnDefs = [
    {
      headerName: 'Semester',
      field: 'semesterNumber',
      sortable: false,
      filter: true,
      cellStyle: { 'font-size': '12px' },
      valueFormatter: (params: ValueFormatterParams) => {
        return params.value || 'N/A'
      }
    },
    { headerName: 'Course', field: 'course', sortable: false, filter: true, cellStyle: { 'font-size': '12px' } },
  ];

  ngOnInit() {

    this.route.paramMap.subscribe((params: Params) => {
      const id = +params.get('id');
      if (id) {
        this.programId = id;
        this.isLoading = true;
        this.getProgramData(id);
        this.cdRef.markForCheck();
      }
    });

    this.gridOptions.rowHeight = 30;
    this.gridOptions.headerHeight = 35;
  }

  // First time rendered ag grid
  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  // Getting invoice master data
  getProgramData(id: number) {
    this.programService.getById(id)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe((res: IApiResponse<IProgram>) => {
        this.programMaster = res.result;
        this.semesterCoursesList = res.result.semesterCourseList;
        // this.status = this.programMaster.status;
        // this.remarksList = this.programMaster.remarksList ?? []

        this.cdRef.markForCheck();
        this.cdRef.detectChanges();
      });
  }

  // on dialogue open funtions
  /*openDialog(): void {
    const dialogRef = this.dialog.open(RegisterPaymentComponent, {
      width: '900px',
      data: {
        accountId: this.programMaster.receivableAccountId,
        paymentType: 1,
        documentLedgerId: this.ledgerId,
        campusId: this.programMaster.campusId,
        businessPartnerId: this.businessPartnerId,
        pendingAmount: this.pendingAmount,
        formName: 'Invoice',
        docType: DocType.Receipt
      }
    });
    // Getting Updated Invoice Data
    dialogRef.afterClosed().subscribe(() => {
      this.getProgramData(this.programId);
      this.cdRef.markForCheck();
      this.cdRef.detectChanges();
    });
  }*/

  /*reconcile(index: number) {
    this.mapTransactionReconModel(index);
    this.programService.reconcilePayment(this.transactionReconModel)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe(() => {
        this.toastService.success('Reconciled Successfully', 'Invoice')
        this.getProgramData(this.programId);
        this.cdRef.detectChanges();
        this.cdRef.markForCheck();
      });
  }*/

  /*mapTransactionReconModel(index: number) {
    console.log('this.bpUnReconPaymentList[index].paymentledgerId', this.bpUnReconPaymentList[index].paymentledgerId)
    this.transactionReconModel.paymentLedgerId = this.bpUnReconPaymentList[index].paymentLedgerId;
    this.transactionReconModel.documentLedgerId = this.ledgerId;
    this.transactionReconModel.amount = this.bpUnReconPaymentList[index].amount > this.pendingAmount
      ? this.pendingAmount
      : this.bpUnReconPaymentList[index].amount;
  };*/

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

  workflow(action: number , remarks: string) {
    /*this.isLoading = true
    this.programService.workflow({ action, docId: this.programMaster.id , remarks })
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe((res) => {
        this.getProgramData(this.programId);
        this.cdRef.detectChanges();
        this.toastService.success('' + res.message, 'Invoice');
      })*/
  }

  // upload File
  openFileUploadDialog() {
    this.dialog.open(CustomUploadFileComponent, {
      width: '740px',
      data: {
        response: this.programMaster,
        serviceClass: this.programService,
        functionName: 'uploadFile',
        name: 'Invoice'
      },
    }).afterClosed().subscribe(() => {
      this.getProgramData(this.programId)
      this.cdRef.detectChanges()
    })
  }
}
