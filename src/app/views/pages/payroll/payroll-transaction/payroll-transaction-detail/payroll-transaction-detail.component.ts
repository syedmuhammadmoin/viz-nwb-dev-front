import { Component, Injector, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { ColDef, FirstDataRenderedEvent, GridOptions } from 'ag-grid-community';
import { ActionButton, DocumentStatus, DocType, Permissions } from 'src/app/views/shared/AppEnum';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { PAYROLL_PAYMENT, PAYROLL_TRANSACTION } from 'src/app/views/shared/AppRoutes';
import { PayrollTransactionService } from '../service/payroll-transaction.service';
import { RegisterPaymentComponent } from '../../../sales/invoice/register-payment/register-payment.component';
import { AppConst } from 'src/app/views/shared/AppConst';
import { IPayrollTransaction } from '../model/IPayrollTransaction';
import { finalize, take } from 'rxjs/operators';
import { CustomRemarksComponent } from 'src/app/views/shared/components/custom-remarks/custom-remarks.component';
import { CustomUploadFileComponent } from 'src/app/views/shared/components/custom-upload-file/custom-upload-file.component';

@Component({
  selector: 'kt-payroll-transaction-detail',
  templateUrl: './payroll-transaction-detail.component.html',
  styleUrls: ['./payroll-transaction-detail.component.scss']
})

export class PayrollTransactionDetailComponent extends AppComponentBase implements OnInit {

  docType = DocType
  public permissions = Permissions;
  action = ActionButton
  docStatus = DocumentStatus

  //For ag grid
  gridOptions: any;;
  defaultColDef: ColDef;

  public PAYROLL_TRANSACTION = PAYROLL_TRANSACTION;
  public PAYROLL_PAYMENT = PAYROLL_PAYMENT;

  //Loader
  isLoading: boolean;

  //Variables for Payroll Transaction data
  paidAmountList: any = [];
  paidAmount: number;
  months = AppConst.Months
  pendingAmount: number;
  remarksList: any = [];
  payrollId: number;

  payrollMaster: IPayrollTransaction | any;
  employeeItems: any;

  //need for Register Payment
  businessPartnerId: number;
  ledgerId: number

  constructor(
    private payrollTransactionService: PayrollTransactionService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector)
    this.gridOptions = ({} as GridOptions);
    this.defaultColDef = { resizable: true, sortable: false };
  }

  //Defining columns for ag grid
  columnDefs = [
    {headerName: 'Payroll Item', field: 'payrollItem'},
    {headerName: 'Account', field: 'account'},
    {
      headerName: 'Amount', field: 'amount', valueFormatter: (params) => {
        return this.valueFormatter(params.value)
      }
    }
  ]

  ngOnInit() {

    this.route.paramMap.subscribe((params: Params) => {
      const id = +params.get('id');
      if (id) {
        this.isLoading = true;
        this.payrollId = id;
        this.getPayroll(this.payrollId)
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

  getPayroll(id: number) {
    this.payrollTransactionService.getPayrollTransactionById(id)
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
      .subscribe((res: IPayrollTransaction | any) => {
        this.payrollMaster = res.result;
        this.pendingAmount = this.payrollMaster.pendingAmount;
        this.businessPartnerId = this.payrollMaster.businessPartnerId;
        this.ledgerId = this.payrollMaster.ledgerId;
        this.paidAmount = this.payrollMaster.totalPaid;
        this.pendingAmount = this.payrollMaster.pendingAmount;
        this.paidAmountList = this.payrollMaster.paidAmountList == null ? [] : this.payrollMaster.paidAmountList;
        this.remarksList = this.payrollMaster.remarksList ?? [] 

        this.employeeItems = res.result.payrollTransactionLines
        this.cdRef.detectChanges();
      })
  }

  getSalaryMonth() {
    return `${this.months.find(x => x.value === this.payrollMaster?.month)?.name}, ${this.payrollMaster?.year}`
  }

  //on dialogue open funtions
  openDialog(): void {
    const dialogRef = this.dialog.open(RegisterPaymentComponent, {
      width: '900px',
      data: {
        accountId: this.payrollMaster.accountPayableId,
        paymentType: 2,
        documentLedgerId: this.payrollMaster.ledgerId,
        campusId: this.payrollMaster?.campusId || null,
        businessPartnerId: this.payrollMaster.businessPartnerId,
        pendingAmount: this.payrollMaster.pendingAmount,
        formName: 'Payroll Transaction',
        docType: DocType.PayrollPayment
      }
    });
    //Recalling getInvoiceData function on dialog close
    dialogRef.afterClosed().subscribe(() => {
      this.getPayroll(this.payrollId);
      this.cdRef.detectChanges();
    });
  }

  //Get Remarks From User
  remarksDialog(action: any): void {
    const dialogRef = this.dialog.open(CustomRemarksComponent, {
      width: '740px'
    });
    //sending remarks data after dialog closed
    dialogRef.afterClosed().subscribe((res) => {
      if (res) {
        this.workflow(action, res.data)
      }
    })
  }

  workflow(action: number, remarks: string) {
    this.isLoading = true;
    this.payrollTransactionService.workflow({action , docId: this.payrollMaster.id, remarks})
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((res) => {
      this.toastService.success('' + res.message, 'Payroll');
      this.getPayroll(this.payrollMaster.id);
      this.cdRef.detectChanges();
    })
  }

  //upload File
  openFileUploadDialog() {
    this.dialog.open(CustomUploadFileComponent, {
      width: '740px',
      data: {
        response: this.payrollMaster,
        serviceClass: this.payrollTransactionService,
        functionName: 'uploadFile',
        name: 'Payroll'
      },
    }).afterClosed().subscribe(() => {
      this.getPayroll(this.payrollId)
      this.cdRef.detectChanges()
    })
  }
}



