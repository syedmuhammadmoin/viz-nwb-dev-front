import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { BankReconciliationService } from '../service/bank-reconciliation.service';
import { AppComponentBase} from '../../../../shared/app-component-base';
import { IBankStatement } from '../../bank-statement/model/IBankStatement';
import { BehaviorSubject } from 'rxjs';
import { IPayment } from '../../payment/model/IPayment';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BankAccountService } from '../../bank-account/service/bankAccount.service';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { FirstDataRenderedEvent, GridApi, ICellRenderer, ICellRendererParams, RowDoubleClickedEvent } from 'ag-grid-community';
import { IApiResponse } from 'src/app/views/shared/IApiResponse';
import { IBankAccount } from '../../bank-account/model/IBankAccount';

@Component({
  selector: 'kt-list-bank-reconciliation',
  templateUrl: './list-bank-reconciliation.component.html',
  styleUrls: ['./list-bank-reconciliation.component.scss'],
  providers:[NgxsCustomService]
})

export class ListBankReconciliationComponent extends AppComponentBase implements OnInit {

  // Declaring FormGroup
  reconForm: FormGroup;

  public permissions = Permissions;
  paymentGridApi;
  statementGridApi;

  bankAccountId: number;
  clearingAccountId: number;
  isRowSelectable: boolean;
  paymentsToReconcile = [];

  isloading: boolean;

  bankStatementList = new BehaviorSubject<IBankStatement[]>([]);
  paymentList = new BehaviorSubject<IPayment[]>([]);

  overlayLoadingTemplate;
  rowSelectionPayment = 'multiple';
  rowSelectionBankStatement = 'multiple';

  columnBankStatement = [
    { headerName: 'Ref#', field: 'docNo', checkboxSelection: true },
    {
      headerName: 'Date', field: 'docDate',
      cellRenderer: (params: ICellRendererParams) => {
        const date = params.data.docDate != null ? params.data.docDate : null;
        return date == null || this.transformDate(date, 'MMM d, y');
      }
    },
    {
      headerName: 'Amount',
      field: 'unreconciledAmount',
      valueFormatter: (params: ICellRendererParams) => { return this.valueFormatter(params.value) }
    }
  ];

  columnPayment = [
    { headerName: 'Doc#', field: 'docNo', checkboxSelection: true },
    {
      headerName: 'Date', field: 'docDate',
      cellRenderer: (params: ICellRendererParams) => {
        const date = params.data.docDate != null ? params.data.docDate : null;
        return date == null || this.transformDate(date, 'MMM d, y');
      }
    },
    {
      headerName: 'Amount',
      field: 'unreconciledAmount',
      valueFormatter: (params: ICellRendererParams) => { return this.valueFormatter(params.value) }
    },
  ];


  constructor(
    private fb: FormBuilder,
    injector: Injector,
    public bankReconService: BankReconciliationService,
    private cdRef: ChangeDetectorRef,
    public ngxsService:NgxsCustomService,   
    public accountService: BankAccountService,
  ) {
    super(injector);
    this.overlayLoadingTemplate =
      '<span class="ag-overlay-loading-center">Please wait while your data is loading</span>';
  }

  // Validation Messages
  validationMessages = {
    bankName: {
      required: 'Bank Account is Required'
    }
  }

  // Error keys for validation messages
  formErrors = {
    bankName: '',
  }

  ngOnInit() {
    this.isRowSelectable = false;
    // initializing formGroup
    this.reconForm = this.fb.group({
      bankName: ['', [Validators.required]],
    });

    this.ngxsService.getBankAccountFromState();
  }


  onSubmitBankAccount() {
    if (this.reconForm.invalid) {
      this.logValidationErrors(this.reconForm, this.formErrors, this.validationMessages);
      return;
    }
    this.statementGridApi.showLoadingOverlay();
    this.paymentGridApi.showLoadingOverlay();
    this.bankAccountId = this.reconForm.value.bankName;
    this.accountService.getBankAccount(this.bankAccountId)
      .subscribe(
        (bankAccount: any) => {
          console.log(bankAccount.result)
          this.clearingAccountId = bankAccount.result.clearingAccountId;
          this.loadReconciliationGridData();
          this.cdRef.detectChanges();
        },
        (err) => console.log(err)
      );
  }

  onFirstDataRendered(params: FirstDataRenderedEvent) {
    params.api.sizeColumnsToFit();
  }

  onBankStatementRowClicked($event) {
    this.rowSelectionPayment = this.statementGridApi.getSelectedRows().length > 1 ? 'single' : 'multiple'
  }

  onPaymentRowClicked($event) {
    this.rowSelectionBankStatement = this.paymentGridApi.getSelectedRows().length > 1 ? 'single' : 'multiple'
  }

  calculateReconTotal(array, fieldName) {
    return array.reduce((a, b) => {
      return a + this.prepareAmountToReconcile(b[fieldName]);
    }, 0);
  }

  onPaymentGridReady(params) {
    console.log(params)
    this.paymentGridApi = params.api;
  }

  onStatementGridReady(params) {
    console.log(params)
    this.statementGridApi = params.api;
  }

  onSubmit() {
    // TODO: Optimize the below code
    const isStatementNegative = this.statementGridApi.getSelectedRows().every((x) => Math.sign(x.unreconciledAmount) === -1)
    const isStatementPositive = this.statementGridApi.getSelectedRows().every((x) => Math.sign(x.unreconciledAmount) !== -1)
    const isPaymentNegative = this.paymentGridApi.getSelectedRows().every((x) => Math.sign(x.unreconciledAmount) === -1)
    const isPaymentPositive = this.paymentGridApi.getSelectedRows().every((x) => Math.sign(x.unreconciledAmount) !== -1)

    if ((isStatementNegative && isPaymentNegative) || (isPaymentPositive && isStatementPositive)) {
      console.log(`payment: ${isPaymentNegative}, statement: ${isStatementNegative}`)
      // this.toastService.success('Success!')
      this.prepareToReconcile();
    } else {
      this.toastService.error('Both Sides Should either be positive or negative only!')
      return;
    }
  }

  reconcile(arrayOfReconData: any[], isExceeded: boolean) {
    if (!isExceeded && arrayOfReconData) {
      this.paymentGridApi.showLoadingOverlay();
      this.statementGridApi.showLoadingOverlay();
     
      this.bankReconService.reconcileStatement(arrayOfReconData).subscribe((res) => {
        this.isloading = true;
        this.loadReconciliationGridData();
        this.cdRef.detectChanges();
       
        this.toastService.success('Reconciliation Successful', 'Reconciled Successfully')
      }, (err) => this.toastService.error('Something went wrong! Please try again later')
      )
    }
  }

  loadReconciliationGridData() {
    this.bankStatementList.next([]);
    this.paymentList.next([]);
    this.bankReconService.getPaymentStatement(this.clearingAccountId);
    this.bankReconService.getBankStatement(this.bankAccountId);
    this.bankStatementList = this.bankReconService.bankStatementList;
    this.paymentList = this.bankReconService.paymentList
  }

  prepareAmountToReconcile(amount): number {
    let preparedAmount = 0;
    if (amount) {
      preparedAmount = Math.sign(amount) === -1 ? Math.abs(amount) : amount;
    }
    return preparedAmount;
  }

  prepareToReconcile() {
    // TODO: Optimize the below conditions or segregate the below conditions
    let isExceeded = true;
    this.paymentsToReconcile = [];
    if (this.statementGridApi.getSelectedRows().length === 0 || this.paymentGridApi.getSelectedRows().length === 0) {
      this.toastService.error('Select row to reconcile', 'Invalid Values');
      return;
    }
    if (this.statementGridApi.getSelectedRows().length === 1 && this.paymentGridApi.getSelectedRows().length === 1) {
      const statementAmount = this.prepareAmountToReconcile(this.statementGridApi.getSelectedRows()[0].unreconciledAmount)
      const paymentAmount = this.prepareAmountToReconcile(this.paymentGridApi.getSelectedRows()[0].unreconciledAmount)
      isExceeded = false;
      this.paymentsToReconcile.push({
        bankStmtId: this.statementGridApi.getSelectedRows()[0]?.id,
        paymentId: this.paymentGridApi.getSelectedRows()[0]?.id,
        amount: (statementAmount !== paymentAmount) ? (statementAmount > paymentAmount ? paymentAmount : statementAmount) : statementAmount

      })
    } else if (this.statementGridApi.getSelectedRows().length > this.paymentGridApi.getSelectedRows().length) {
      const paymentAmount = this.prepareAmountToReconcile(this.paymentGridApi.getSelectedRows()[0].unreconciledAmount)

      paymentAmount
        < this.calculateReconTotal(this.statementGridApi.getSelectedRows(), 'unreconciledAmount')
        ? this.toastService
          .error('Statements amount total cannot exceed Payment amount', 'Amount Exceeded')
        : isExceeded = false;
      this.statementGridApi.getSelectedRows().forEach((row) => {
        this.paymentsToReconcile.push({
          bankStmtId: row.id,
          paymentId: this.paymentGridApi.getSelectedRows()[0]?.id,
          amount: this.prepareAmountToReconcile(row.unreconciledAmount)
        })
      })
    } else if (this.paymentGridApi.getSelectedRows().length > this.statementGridApi.getSelectedRows().length) {
      const statementAmount = this.prepareAmountToReconcile(this.statementGridApi.getSelectedRows()[0].unreconciledAmount)
      statementAmount
        < this.calculateReconTotal(this.paymentGridApi.getSelectedRows(), 'unreconciledAmount')
        ? this.toastService
          .error('Payments amount total cannot exceed Statement amount', 'Amount Exceeded')
        : isExceeded = false;
      this.paymentGridApi.getSelectedRows().forEach((row) => {
        this.paymentsToReconcile.push({
          bankStmtId: this.statementGridApi.getSelectedRows()[0].id,
          paymentId: row.id,
          amount: this.prepareAmountToReconcile(row.unreconciledAmount)
        })
      })
    }
    this.reconcile(this.paymentsToReconcile, isExceeded);
  }
}
