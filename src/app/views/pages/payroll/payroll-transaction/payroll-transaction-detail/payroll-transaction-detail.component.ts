import { Component, Injector, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params } from '@angular/router';
import { ColDef, FirstDataRenderedEvent, GridOptions } from 'ag-grid-community';
import { ActionButton, DocumentStatus, DocType, Permissions } from 'src/app/views/shared/AppEnum';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { CREDIT_NOTE, INVOICE, PAYMENT, PAYROLL_TRANSACTION } from 'src/app/views/shared/AppRoutes';
import { PayrollTransactionService } from '../service/payroll-transaction.service';
import { RegisterPaymentComponent } from '../../../sales/invoice/register-payment/register-payment.component';
import { AppConst } from 'src/app/views/shared/AppConst';
import { IPayrollTransaction } from '../model/IPayrollTransaction';

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
  gridOptions: GridOptions;
  defaultColDef: ColDef;

  public PAYROLL_TRANSACTION = PAYROLL_TRANSACTION;
  public CREDIT_NOTE = CREDIT_NOTE;
  public PAYMENT = PAYMENT;

  //handling register payment button
  isDisabled: boolean;

  //kt busy loading
  isLoading: boolean;

  //Variables for Payroll Transaction data
  // bpUnReconPaymentList: any = [];
  // pendingAmount: any;
  // status: string;
  // paidAmount: number;
  paidAmountList: any = [];

  months = AppConst.Months
 
  employeeType;
  remarksList: any = [];
  totalPaidAmount: number;
  payrollId: number;

  payrollMaster: IPayrollTransaction | any;
  employeeItems: any;

  constructor(
    private payrollTransactionService: PayrollTransactionService,
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    injector: Injector
  ) {
    super(injector)
    this.gridOptions = ({} as GridOptions);
    this.defaultColDef = { resizable: true };
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
        this.payrollId = id;
        this.getPayroll(this.payrollId)
        this.cdRef.markForCheck();
      }
    });

    this.gridOptions.rowHeight = 40;
    this.gridOptions.headerHeight = 35;
  }

  // First time rendered ag grid
  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  getPayroll(id: number) {
    // this.payrollTransactionService.getPayrollTransactionById(id)
    //   .subscribe((res: IPayrollTransaction | any) => {
    //     this.payrollMaster = res.result;
    //     console.log('master data payroll', this.payrollMaster)
    //     //this.employeeType = AppConst.EmployeeType[this.payrollMaster.employeeType];
    //     this.paidAmountList = this.payrollMaster.paidAmountList == null ? [] : this.payrollMaster.paidAmountList;
    //     this.remarksList = this.payrollMaster.remarksList == null ? [] : this.payrollMaster.remarksList;
    //     this.totalPaidAmount = this.payrollMaster?.totalPaid;
    //     this.employeeItems = res.result.payrollTransactionLines
    //     this.isLoading = false;
    //     this.cdRef.detectChanges();
    //   })
  }

  getSalaryMonth() {
    return `${this.months.find(x => x.value === this.payrollMaster?.month)?.name}, ${this.payrollMaster?.year}`
  }

  registerPayrollPayment() {
    const dialogRef = this.dialog.open(RegisterPaymentComponent, {
      width: '900px',
      data: {
        isPayroll: true,
        accountId: this.payrollMaster.accountPayableId,
        paymentType: 2,
        transactionId: this.payrollMaster.transactionId,
        businessPartnerId: this.payrollMaster.businessPartnerId,
        pendingAmount: this.payrollMaster.netSalary,
        docType: DocType.PayrollPayment
      },
    });
    dialogRef.afterClosed().subscribe(() => {
      this.getPayroll(this.payrollId);
      this.cdRef.detectChanges();
    });
  }

  workflow(action: number) {
    this.isLoading = true;
    this.payrollTransactionService.workflow({action , docId: this.payrollMaster.id}).subscribe((res) => {
      this.toastService.success('' + res.message, 'Payroll');
      this.getPayroll(this.payrollMaster.id);
      this.cdRef.detectChanges();
      this.isLoading = false;
    }, (err) => {
      this.toastService.error('' + err.error.message, 'Payroll');
      this.isLoading = false
      this.cdRef.detectChanges();
    })
  }
}



