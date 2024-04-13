import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { BankReconciliationService } from '../service/bank-reconciliation.service';
import { AppComponentBase} from '../../../../shared/app-component-base';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { NgxsCustomService } from 'src/app/views/shared/services/ngxs-service/ngxs-custom.service';
import { AgGridFooterHelperService } from 'src/app/views/shared/helpers/ag-grid-footer-helper';
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';

@Component({
  selector: 'kt-list-bank-reconciliation',
  templateUrl: './list-bank-reconciliation.component.html',
  styleUrls: ['./list-bank-reconciliation.component.scss']
})

export class ListBankReconciliationComponent extends AppComponentBase implements OnInit {

  // Declaring FormGroup
  reconForm: FormGroup;

  public permissions = Permissions;
  paymentGridApi: any;
  statementGridApi: any;
  bankAccountId: number;
  clearingAccountId: number;
  isRowSelectable: any;
  paymentsToReconcile = [];
  defaultColDef: any
  bankStatementList = [];
  paymentList = [];
  gridOptions: any;
  overlayLoadingTemplate: any;
  rowSelectionPayment: string | any = 'multiple';
  rowSelectionBankStatement: string | any = 'multiple';
  private paymentColumnApi: any;
  private statementColumnApi: any;
  statementPinnedBottomRowData: any = [];
  paymentPinnedBottomRowData: any = [];

  //Loader
  isloading: boolean;

  //Validation Messages
  validationMessages = {
    bankName: {
      required: 'Bank Account is required.'
    }
  }

  //Keys for validations messages
  formErrors: any = {
    bankName: '',
  }

  //Defining Bank Statement AG Grid Columns
  columnBankStatement = [
    { headerName: 'Ref#', field: 'docNo', menuTabs: ["filterMenuTab"], filter: true, checkboxSelection: true },
    {
      headerName: 'Label', 
      field: 'label', 
      menuTabs: ["filterMenuTab"], 
      filter: true,
      cellRenderer: (params: any) => {
        return (params.data.label||'N/A' );
      }},
    {
      headerName: 'Date', 
      field: 'docDate', 
      menuTabs: ["filterMenuTab"], 
      filter: true,
      cellRenderer: (params: any) => {
        const date = params.data.docDate != null ? params.data.docDate : null;
        return date == null || this.dateHelperService.transformDate(date, 'MMM d, y');
      }
    },
    {
      headerName: 'Amount',
      menuTabs: ["filterMenuTab"],
      field: 'unreconciledAmount',
      filter: true,
      aggFunc: 'sum',
      valueFormatter: (params) => {
        return this.valueFormatter(params.value)
      }
    }
  ];

  //Defining Payment AG Grid Columns
  columnPayment = [
    { headerName: 'Doc#', field: 'docNo', menuTabs: ["filterMenuTab"], filter: true, checkboxSelection: true },
    {
      headerName: 'Date', field: 'docDate', menuTabs: ["filterMenuTab"], filter: true,
      cellRenderer: (params: any) => {
        const date = params.data.docDate != null ? params.data.docDate : null;
        return date == null || this.dateHelperService.transformDate(date, 'MMM d, y');
      }
    },
    {
      headerName: 'Amount',
      field: 'unreconciledAmount',
      filter: true,
      headerClass: 'custom_left',
      cellStyle: { 'text-align': "right" },
      menuTabs: ["filterMenuTab"],
      aggFunc: 'sum',
      valueFormatter: (params) => {
        return this.valueFormatter(params.value)
      }
    },
  ];

  //Injecting Dependencies
  constructor(
    private fb: FormBuilder,
    injector: Injector,
    public bankReconService: BankReconciliationService,
    private cdRef: ChangeDetectorRef,
    public ngxsService: NgxsCustomService,
    public addButtonService: AddModalButtonService,
    private footerHelper: AgGridFooterHelperService
  ) {
    super(injector);
    this.overlayLoadingTemplate =
      '<span class="ag-overlay-loading-center">Please wait while your data is loading</span>';
  }

  ngOnInit() {
    this.isRowSelectable = false;
    // initializing formGroup
    this.reconForm = this.fb.group({
      bankName: ['', [Validators.required]],
    });

    this.gridOptions = {
      paginationPageSizeSelector: false,
    }

    this.defaultColDef = {
      filter: true,
      sortable: false,
      resizable: true
    };

    //Get Data from Store
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
    this.ngxsService.bankAccountService.getBankAccount(this.bankAccountId)
      .subscribe({
        next: (bankAccount: any) => {
          this.clearingAccountId = bankAccount.result.clearingAccountId;
          this.loadReconciliationGridData();
          this.cdRef.detectChanges();
        },
        error: () => {
          this.paymentGridApi.hideOverlay();
          this.statementGridApi.hideOverlay();
        }
      });
  }

  onBankStatementRowClicked() {
    this.rowSelectionPayment = this.statementGridApi.getSelectedRows().length > 1 ? 'single' : 'multiple'
  }

  onPaymentRowClicked() {
    this.rowSelectionBankStatement = this.paymentGridApi.getSelectedRows().length > 1 ? 'single' : 'multiple'
  }


  calculateReconTotal(array, fieldName) {
    return array.reduce((a, b) => {
      return a + this.prepareAmountToReconcile(b[fieldName]);
    }, 0);
  }

  onPaymentGridReady(params) {
    this.paymentGridApi = params.api;
    this.paymentColumnApi = params.columnApi;
  }

  onStatementGridReady(params) {
    this.statementGridApi = params.api;
    this.statementColumnApi = params.columnApi;
  }

  onSubmit() {
    // TODO: Optimize the below code (By Humza)
    const isStatementNegative = this.statementGridApi.getSelectedRows().every((x) => Math.sign(x.unreconciledAmount) === -1)
    const isStatementPositive = this.statementGridApi.getSelectedRows().every((x) => Math.sign(x.unreconciledAmount) !== -1)
    const isPaymentNegative = this.paymentGridApi.getSelectedRows().every((x) => Math.sign(x.unreconciledAmount) === -1)
    const isPaymentPositive = this.paymentGridApi.getSelectedRows().every((x) => Math.sign(x.unreconciledAmount) !== -1)

    if ((isStatementNegative && isPaymentNegative) || (isPaymentPositive && isStatementPositive)) {
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
      this.statementGridApi.hideLoading
      this.bankReconService.reconcileStatement(arrayOfReconData).subscribe({
        next: () => {
          this.isloading = true;
          this.loadReconciliationGridData();
          this.cdRef.detectChanges();
          this.toastService.success('Reconciliation Successful', 'Reconciled Successfully')
        }, 
        error: () => {
          this.paymentGridApi.hideOverlay();
          this.statementGridApi.hideOverlay();
        }
      })
    }
  }

  loadReconciliationGridData() {
    this.bankReconService.getPaymentStatement(this.clearingAccountId);
    this.bankReconService.getBankStatement(this.bankAccountId);
    this.bankReconService.bankStatementList.subscribe((res) => {
      this.bankStatementList = res;

      this.cdRef.detectChanges();
      setTimeout(() => {
        const pinnedBottomData = this.footerHelper.generatePinnedBottomData(this.statementColumnApi, this.statementGridApi, 'docNo', ['unreconciledAmount']);
        this.statementPinnedBottomRowData = [pinnedBottomData];
        this.cdRef.detectChanges();
      }, 500)
    });
    this.bankReconService.paymentList.subscribe((res) => {
      this.paymentList = res;
      this.cdRef.detectChanges();
      setTimeout(() => {
        const pinnedBottomData = this.footerHelper.generatePinnedBottomData(this.paymentColumnApi, this.paymentGridApi, 'docNo', ['unreconciledAmount']);
        this.paymentPinnedBottomRowData = [pinnedBottomData];
        this.cdRef.detectChanges();
      }, 500)
    })
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
        BankStmtId: this.statementGridApi.getSelectedRows()[0]?.id,
        PaymentId: this.paymentGridApi.getSelectedRows()[0]?.id,
        Amount: (statementAmount !== paymentAmount) ? (statementAmount > paymentAmount ? paymentAmount : statementAmount) : statementAmount

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
          BankStmtId: row.id,
          PaymentId: this.paymentGridApi.getSelectedRows()[0]?.id,
          Amount: this.prepareAmountToReconcile(row.unreconciledAmount)
        })
      })
    } else if (this.paymentGridApi.getSelectedRows().length > this.statementGridApi.getSelectedRows().length) {
      const statementAmount = this.prepareAmountToReconcile(this.statementGridApi.getSelectedRows()[0].unreconciledAmount)
      statementAmount
      < this.calculateReconTotal(this.paymentGridApi.getSelectedRows(), 'unreconciledAmount')
        ? this.toastService.error('Payments amount total cannot exceed Statement amount', 'Amount Exceeded')
        : isExceeded = false;
      this.paymentGridApi.getSelectedRows().forEach((row) => {
        this.paymentsToReconcile.push({
          BankStmtId: this.statementGridApi.getSelectedRows()[0].id,
          PaymentId: row.id,
          Amount: this.prepareAmountToReconcile(row.unreconciledAmount)
        })
      })
    }
    this.reconcile(this.paymentsToReconcile, isExceeded);
  }
}
