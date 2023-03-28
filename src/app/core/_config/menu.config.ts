import {
  ACADEMIC_DEPARTMENT,
  ACCESS_MANAGEMENT,
  APP_ROUTES,
  APPLICANT_ASSESSMENT_CRITERIA,
  ASSET,
  ASSET_REPORT,
  BANK_ACCOUNT,
  BANK_RECONCILIATION,
  BANK_STATEMENT,
  BATCH,
  BATCH_TYPE,
  BID_EVALUATION,
  BILL,
  BUDGET,
  BUDGET_REAPPROPIATION,
  BUSINESS_PARTNER,
  CALL_QUOTATION,
  CAMPUS,
  CATEGORY,
  CHART_OF_ACCOUNT,
  COURSE,
  CREDIT_NOTE,
  CWIP,
  DEBIT_NOTE,
  DEPARTMENT,
  DEPRECIATION_ADJUSTMENT,
  DEPRECIATION_MODEL,
  DESIGNATION,
  DISPOSAL,
  EMPLOYEE,
  ESTIMATED_BUDGET,
  FACULTY,
  FEE_TYPE,
  GOODS_RECEIVED_NOTE,
  GOODS_RETURN_NOTE,
  INVOICE,
  ISSUANCE,
  ISSUANCE_RETURN,
  JOURNAL_ENTRY,
  PAYMENT,
  PAYROLL_ITEM,
  PAYROLL_PAYMENT,
  PAYROLL_PROCESS,
  PAYROLL_REPORTS,
  PAYROLL_TRANSACTION,
  PRODUCT, PROGRAM,
  PURCHASE_ORDER,
  QUOTATION,
  QUOTATION_COMPARATIVE,
  RECEIPT,
  REPORT,
  REQUEST_REQUISITION,
  REQUISITION, SEMESTER,
  SHIFT,
  STATUS,
  STOCK,
  TAX,
  UNIT_OF_MEASUREMENT,
  WAREHOUSE,
  WORKFLOW
} from 'src/app/views/shared/AppRoutes';


import {Permissions} from '../../views/shared/AppEnum'

export class MenuConfig {
  public defaults: any = {
    header: {
      self: {},
      items: [
        {
          title: 'Dashboards',
          root: true,
          alignment: 'left',
          page: '/' + APP_ROUTES.DASHBOARD,
          translate: 'MENU.DASHBOARD',
        },
      ]
    },
    aside: {
      self: {},
      items: [
        //region General
        {
          title: 'Dashboard',
          root: true,
          icon: 'flaticon2-architecture-and-city',
          page: '/' + APP_ROUTES.DASHBOARD,
          translate: 'MENU.DASHBOARD',
          bullet: 'dot',
        },

        // {
        //   title: 'Layout Builder',
        //   root: true,
        //   icon: 'flaticon2-expand',
        //   page: '/builder'
        // },
        // {
        {
          title: 'Access Management',
          bullet: 'dot',
          icon: 'flaticon2-avatar',
          permission: [
            Permissions.AUTH_CREATE,
            Permissions.AUTH_VIEW,
            Permissions.AUTH_EDIT,
            Permissions.AUTH_DELETE,
          ],
          submenu: [
            {
              title: 'Roles', // <= Title of the page
              page: '/' + APP_ROUTES.ACCESS_MANAGEMENT + '/' + ACCESS_MANAGEMENT.ROLE_LIST, // <= URL
              permission: [
                Permissions.AUTH_CREATE,
                Permissions.AUTH_VIEW,
                Permissions.AUTH_EDIT,
                Permissions.AUTH_DELETE,
              ],
            },
            {
              title: 'Users', // <= Title of the page
              page: '/' + APP_ROUTES.ACCESS_MANAGEMENT + '/' + ACCESS_MANAGEMENT.USER_LIST, // <= URL
              permission: [
                Permissions.AUTH_CREATE,
                Permissions.AUTH_VIEW,
                Permissions.AUTH_EDIT,
                Permissions.AUTH_DELETE,
              ],
            },
          ]
        },

        // { section: 'profiling' },
        {
          title: 'Profiling',
          bullet: 'dot',
          icon: 'flaticon2-grids',
          permission: [
            Permissions.BUSINESSPARTNER_VIEW,
            Permissions.BUSINESSPARTNER_CREATE,
            Permissions.BUSINESSPARTNER_EDIT,
            Permissions.BUSINESSPARTNER_DELETE,
            Permissions.CATEGORIES_VIEW,
            Permissions.CATEGORIES_CREATE,
            Permissions.CATEGORIES_EDIT,
            Permissions.CATEGORIES_DELETE,
            Permissions.PRODUCT_VIEW,
            Permissions.PRODUCT_CREATE,
            Permissions.PRODUCT_EDIT,
            Permissions.PRODUCT_DELETE,
            Permissions.WAREHOUSE_VIEW,
            Permissions.WAREHOUSE_CREATE,
            Permissions.WAREHOUSE_EDIT,
            Permissions.WAREHOUSE_DELETE,
            Permissions.TAXES_VIEW,
            Permissions.TAXES_CREATE,
            Permissions.TAXES_EDIT,
            Permissions.TAXES_DELETE,
            Permissions.UNIT_OF_MEASUREMENT_VIEW,
            Permissions.UNIT_OF_MEASUREMENT_CREATE,
            Permissions.UNIT_OF_MEASUREMENT_EDIT,
            Permissions.UNIT_OF_MEASUREMENT_DELETE,
            Permissions.CAMPUS_VIEW,
            Permissions.CAMPUS_CREATE,
            Permissions.CAMPUS_EDIT,
            Permissions.CAMPUS_DELETE
          ],
          submenu: [
            {
              title: 'Campus', // <= Title of the page
              page: '/' + CAMPUS.LIST, // <= URL
              permission: [
                Permissions.CAMPUS_VIEW,
                Permissions.CAMPUS_CREATE,
                Permissions.CAMPUS_EDIT,
                Permissions.CAMPUS_DELETE
              ]
            },
            {
              title: 'Store',
              page: '/' + WAREHOUSE.LIST,
              permission: [
                Permissions.WAREHOUSE_VIEW,
                Permissions.WAREHOUSE_CREATE,
                Permissions.WAREHOUSE_EDIT,
                Permissions.WAREHOUSE_DELETE
              ]
            },
            {
              title: 'Business Partner', // <= Title of the page
              page: '/' + BUSINESS_PARTNER.LIST, // <= URL
              permission: [
                Permissions.BUSINESSPARTNER_VIEW,
                Permissions.BUSINESSPARTNER_CREATE,
                Permissions.BUSINESSPARTNER_EDIT,
                Permissions.BUSINESSPARTNER_DELETE
              ]
            },
            {
              title: 'Category',
              page: '/' + CATEGORY.LIST,
              permission: [
                Permissions.CATEGORIES_VIEW,
                Permissions.CATEGORIES_CREATE,
                Permissions.CATEGORIES_EDIT,
                Permissions.CATEGORIES_DELETE
              ]
            },
            {
              title: 'Tax',
              page: '/' + TAX.LIST,
              permission: [
                Permissions.TAXES_VIEW,
                Permissions.TAXES_CREATE,
                Permissions.TAXES_EDIT,
                Permissions.TAXES_DELETE,
              ]
            },
            {
              title: 'Unit Of Measurement',
              page: '/' + UNIT_OF_MEASUREMENT.LIST,
              permission: [
                Permissions.UNIT_OF_MEASUREMENT_VIEW,
                Permissions.UNIT_OF_MEASUREMENT_CREATE,
                Permissions.UNIT_OF_MEASUREMENT_EDIT,
                Permissions.UNIT_OF_MEASUREMENT_DELETE,
              ]
            },
            {
              title: 'Product',
              page: '/' + PRODUCT.LIST,
              permission: [
                Permissions.PRODUCT_VIEW,
                Permissions.PRODUCT_CREATE,
                Permissions.PRODUCT_EDIT,
                Permissions.PRODUCT_DELETE
              ]
            }
          ]
        },
        //finance Portion
        {
          title: 'Finance',
          bullet: 'dot',
          icon: 'flaticon-notepad',
          permission: [
            Permissions.JOURNALENTRY_VIEW,
            Permissions.JOURNALENTRY_CREATE,
            Permissions.JOURNALENTRY_EDIT,
            Permissions.JOURNALENTRY_DELETE,
            Permissions.JOURNALENTRY_REVIEW,
            Permissions.JOURNALENTRY_APPROVE,
            Permissions.PAYMENT_VIEW,
            Permissions.PAYMENT_CREATE,
            Permissions.PAYMENT_EDIT,
            Permissions.PAYMENT_DELETE,
            Permissions.PAYMENT_REVIEW,
            Permissions.PAYMENT_APPROVE,
            Permissions.RECEIPT_CREATE,
            Permissions.RECEIPT_EDIT,
            Permissions.RECEIPT_DELETE,
            Permissions.RECEIPT_REVIEW,
            Permissions.RECEIPT_APPROVE,
            Permissions.BANKSTATEMENT_VIEW,
            Permissions.BANKSTATEMENT_CREATE,
            Permissions.BANKSTATEMENT_EDIT,
            Permissions.BANKSTATEMENT_DELETE,
            Permissions.BANKACCOUNT_VIEW,
            Permissions.BANKACCOUNT_CREATE,
            Permissions.BANKACCOUNT_EDIT,
            Permissions.BANKACCOUNT_DELETE,
            Permissions.CASHACCOUNT_VIEW,
            Permissions.CASHACCOUNT_CREATE,
            Permissions.CASHACCOUNT_EDIT,
            Permissions.CASHACCOUNT_DELETE,
            Permissions.LEVEL3_VIEW,
            Permissions.LEVEL3_CREATE,
            Permissions.LEVEL3_EDIT,
            Permissions.LEVEL3_DELETE,
            Permissions.LEVEL4_VIEW,
            Permissions.LEVEL4_CREATE,
            Permissions.LEVEL4_EDIT,
            Permissions.LEVEL4_DELETE,
            Permissions.INVOICE_VIEW,
            Permissions.INVOICE_CREATE,
            Permissions.INVOICE_EDIT,
            Permissions.INVOICE_DELETE,
            Permissions.INVOICE_REVIEW,
            Permissions.INVOICE_APPROVE,
            Permissions.CREDITNOTE_VIEW,
            Permissions.CREDITNOTE_CREATE,
            Permissions.CREDITNOTE_EDIT,
            Permissions.CREDITNOTE_DELETE,
            Permissions.CREDITNOTE_REVIEW,
            Permissions.CREDITNOTE_APPROVE,
            Permissions.BILL_VIEW,
            Permissions.BILL_CREATE,
            Permissions.BILL_EDIT,
            Permissions.BILL_DELETE,
            Permissions.BILL_REVIEW,
            Permissions.BILL_APPROVE,
            Permissions.DEBITNOTE_VIEW,
            Permissions.DEBITNOTE_CREATE,
            Permissions.DEBITNOTE_EDIT,
            Permissions.DEBITNOTE_DELETE,
            Permissions.DEBITNOTE_REVIEW,
            Permissions.DEBITNOTE_APPROVE,
            Permissions.CHARTOFACCOUNT_VIEW,
            Permissions.BANK_RECON_VIEW,
            Permissions.BANK_RECON_CREATE,
            Permissions.BANK_RECON_EDIT,
            Permissions.BANK_RECON_DELETE,
          ],
          submenu: [
            {
              title: 'Bank Account',
              page: '/' + BANK_ACCOUNT.LIST,
              permission: [
                Permissions.BANKACCOUNT_VIEW,
                Permissions.BANKACCOUNT_CREATE,
                Permissions.BANKACCOUNT_EDIT,
                Permissions.BANKACCOUNT_DELETE
              ]
            },
            {
              title: 'Payment',
              page: '/' + PAYMENT.LIST,
              permission: [
                Permissions.PAYMENT_VIEW,
                Permissions.PAYMENT_CREATE,
                Permissions.PAYMENT_EDIT,
                Permissions.PAYMENT_DELETE,
                Permissions.PAYMENT_REVIEW,
                Permissions.PAYMENT_APPROVE,
              ]
            },
            {
              title: 'Receipt',
              page: '/' + RECEIPT.LIST,
              permission: [
                Permissions.RECEIPT_VIEW,
                Permissions.RECEIPT_CREATE,
                Permissions.RECEIPT_EDIT,
                Permissions.RECEIPT_DELETE,
                Permissions.RECEIPT_REVIEW,
                Permissions.RECEIPT_APPROVE,
              ]
            },
            {
              title: 'Journal Entry',
              page: '/' + JOURNAL_ENTRY.LIST,
              permission: [
                Permissions.JOURNALENTRY_VIEW,
                Permissions.JOURNALENTRY_CREATE,
                Permissions.JOURNALENTRY_EDIT,
                Permissions.JOURNALENTRY_DELETE,
                Permissions.JOURNALENTRY_REVIEW,
                Permissions.JOURNALENTRY_APPROVE,
              ]
            },
            {
              title: 'Invoice',
              page: '/' + INVOICE.LIST,
              permission: [
                Permissions.INVOICE_VIEW,
                Permissions.INVOICE_CREATE,
                Permissions.INVOICE_EDIT,
                Permissions.INVOICE_DELETE,
                Permissions.INVOICE_REVIEW,
                Permissions.INVOICE_APPROVE,
              ]
            },
            {
              title: 'Credit Note',
              page: '/' + CREDIT_NOTE.LIST,
              permission: [
                Permissions.CREDITNOTE_VIEW,
                Permissions.CREDITNOTE_CREATE,
                Permissions.CREDITNOTE_EDIT,
                Permissions.CREDITNOTE_DELETE,
                Permissions.CREDITNOTE_REVIEW,
                Permissions.CREDITNOTE_APPROVE,
              ]
            },
            {
              title: 'Vendor Bill',
              page: '/' + BILL.LIST,
              permission: [
                Permissions.BILL_VIEW,
                Permissions.BILL_CREATE,
                Permissions.BILL_EDIT,
                Permissions.BILL_DELETE,
                Permissions.BILL_REVIEW,
                Permissions.BILL_APPROVE,
              ]
            },
            {
              title: 'Debit Note',
              page: '/' + DEBIT_NOTE.LIST,
              permission: [
                Permissions.DEBITNOTE_VIEW,
                Permissions.DEBITNOTE_CREATE,
                Permissions.DEBITNOTE_EDIT,
                Permissions.DEBITNOTE_DELETE,
                Permissions.DEBITNOTE_REVIEW,
                Permissions.DEBITNOTE_APPROVE,
              ]
            },
            {
              title: 'Bank Statement',
              page: '/' + BANK_STATEMENT.LIST,
              permission: [
                Permissions.BANKSTATEMENT_VIEW,
                Permissions.BANKSTATEMENT_CREATE,
                Permissions.BANKSTATEMENT_EDIT,
                Permissions.BANKSTATEMENT_DELETE,
              ]
            },
            {
              title: 'Bank Reconciliation',
              page: '/' + BANK_RECONCILIATION.LIST,
              permission: [
                Permissions.BANK_RECON_VIEW,
                Permissions.BANK_RECON_CREATE,
                Permissions.BANK_RECON_EDIT,
                Permissions.BANK_RECON_DELETE
              ]
            },
            {
              title: 'Chart Of Account',
              page: '/' + CHART_OF_ACCOUNT.LIST,
              permission: [
                Permissions.LEVEL3_VIEW,
                Permissions.LEVEL3_CREATE,
                Permissions.LEVEL3_EDIT,
                Permissions.LEVEL3_DELETE,
                Permissions.LEVEL4_VIEW,
                Permissions.LEVEL4_CREATE,
                Permissions.LEVEL4_EDIT,
                Permissions.LEVEL4_DELETE,
                Permissions.CHARTOFACCOUNT_VIEW
              ]
            },
          ]
        },
        //Budget Portion
        {
          title: 'Admission',
          bullet: 'dot',
          icon: 'flaticon2-analytics',
          permission: [
            // Permissions.FACULTY_VIEW,
            // Permissions.FACULTY_CREATE,
            // Permissions.FACULTY_EDIT,
            // Permissions.FACULTY_DELETE,
            // Permissions.ADMISSION_DEPARTMENT_VIEW,
            // Permissions.ADMISSION_DEPARTMENT_CREATE,
            // Permissions.ADMISSION_DEPARTMENT_EDIT,
            // Permissions.ADMISSION_DEPARTMENT_DELETE,
            // Permissions.SHIFT_VIEW,
            // Permissions.SHIFT_CREATE,
            // Permissions.SHIFT_EDIT,
            // Permissions.SHIFT_DELETE,
            // Permissions.FEE_TYPE_VIEW,
            // Permissions.FEE_TYPE_CREATE,
            // Permissions.FEE_TYPE_EDIT,
            // Permissions.FEE_TYPE_DELETE,
            // Permissions.BATCH_VIEW,
            // Permissions.BATCH_CREATE,
            // Permissions.BATCH_EDIT,
            // Permissions.BATCH_DELETE,
            // Permissions.BATCH_TYPE_VIEW,
            // Permissions.BATCH_TYPE_CREATE,
            // Permissions.BATCH_TYPE_EDIT,
            // Permissions.BATCH_TYPE_DELETE,
            // Permissions.COURSE_VIEW,
            // Permissions.COURSE_CREATE,
            // Permissions.COURSE_EDIT,
            // Permissions.COURSE_DELETE
            // Permissions.PROGRAM_VIEW,
            // Permissions.PROGRAM_CREATE,
            // Permissions.PROGRAM_EDIT,
            // Permissions.PROGRAM_DELETE

          ],
          submenu: [
            {
              title: 'Faculty',
              page: '/' + FACULTY.LIST,
              // permission: [
              //   Permissions.FACULTY_VIEW,
              //   Permissions.FACULTY_CREATE,
              //   Permissions.FACULTY_EDIT,
              //   Permissions.FACULTY_DELETE
              // ]
            },
            {
              title: 'Applicant Assessment Criteria',
              page: '/' + APPLICANT_ASSESSMENT_CRITERIA.CREATE,
              // permission: [
              //   Permissions.FACULTY_VIEW,
              //   Permissions.FACULTY_CREATE,
              //   Permissions.FACULTY_EDIT,
              //   Permissions.FACULTY_DELETE
              // ]
            },
            {
              title: 'Academic Department',
              page: '/' + ACADEMIC_DEPARTMENT.LIST,
              // permission: [
              //   Permissions.ADMISSION_DEPARTMENT_VIEW,
              //   Permissions.ADMISSION_DEPARTMENT_CREATE,
              //   Permissions.ADMISSION_DEPARTMENT_EDIT,
              //   Permissions.ADMISSION_DEPARTMENT_DELETE
              // ]
            },
            {
              title: 'Shift',
              page: '/' + SHIFT.LIST,
              // permission: [
              //   Permissions.SHIFT_VIEW,
              //   Permissions.SHIFT_CREATE,
              //   Permissions.SHIFT_EDIT,
              //   Permissions.SHIFT_DELETE
              // ]
            },
            {
              title: 'Fee Type',
              page: '/' + FEE_TYPE.LIST,
              // permission: [
              //   Permissions.FEE_TYPE_VIEW,
              //   Permissions.FEE_TYPE_CREATE,
              //   Permissions.FEE_TYPE_EDIT,
              //   Permissions.FEE_TYPE_DELETE
              // ]
            },
            {
              title: 'Batch',
              page: '/' + BATCH.LIST,
              // permission: [
              //   Permissions.BATCH_VIEW,
              //   Permissions.BATCH_CREATE,
              //   Permissions.BATCH_EDIT,
              //   Permissions.BATCH_DELETE
              // ]
            },
            {
              title: 'Batch Type',
              page: '/' + BATCH_TYPE.LIST,
              // permission: [
              //   Permissions.BATCH_TYPE_VIEW,
              //   Permissions.BATCH_TYPE_CREATE,
              //   Permissions.BATCH_TYPE_EDIT,
              //   Permissions.BATCH_TYPE_DELETE
              // ]
            },
            {
              title: 'Course',
              page: '/' + COURSE.LIST,
              // permission: [
              //   Permissions.COURSE_VIEW,
              //   Permissions.COURSE_CREATE,
              //   Permissions.COURSE_EDIT,
              //   Permissions.COURSE_DELETE
              // ]
            },
            {
              title: 'Semester',
              page: '/' + SEMESTER.LIST,
              // permission: [
              //   Permissions.COURSE_VIEW,
              //   Permissions.COURSE_CREATE,
              //   Permissions.COURSE_EDIT,
              //   Permissions.COURSE_DELETE
              // ]
            },
            {
              title: 'Program',
              page: '/' + PROGRAM.LIST,
              // permission: [
              //   Permissions.COURSE_VIEW,
              //   Permissions.COURSE_CREATE,
              //   Permissions.COURSE_EDIT,
              //   Permissions.COURSE_DELETE
              // ]
            },
          ]
        },
        //Fixed Asset Section
        {
          title: 'Fixed Asset',
          bullet: 'dot',
          icon: 'flaticon2-box-1',
          permission: [
            Permissions.DEPRECIATION_MODEL_VIEW,
            Permissions.DEPRECIATION_MODEL_CREATE,
            Permissions.DEPRECIATION_MODEL_EDIT,
            Permissions.DEPRECIATION_MODEL_DELETE,
            Permissions.ASSET_VIEW,
            Permissions.ASSET_CREATE,
            Permissions.ASSET_EDIT,
            Permissions.ASSET_DELETE,
            Permissions.CWIP_VIEW,
            Permissions.CWIP_CREATE,
            Permissions.CWIP_EDIT,
            Permissions.CWIP_DELETE,
            Permissions.DISPOSAL_VIEW,
            Permissions.DISPOSAL_CREATE,
            Permissions.DISPOSAL_EDIT,
            Permissions.DISPOSAL_DELETE,
            /*Permissions.DEPRECIATION_ADJUSTMENT_VIEW,
            Permissions.DEPRECIATION_ADJUSTMENT_CREATE,
            Permissions.DEPRECIATION_ADJUSTMENT_EDIT,
            Permissions.DEPRECIATION_ADJUSTMENT_DELETE*/
          ],
          submenu: [
            {
              title: 'Depreciation Model',
              page: '/' + DEPRECIATION_MODEL.LIST,
              permission: [
                Permissions.DEPRECIATION_MODEL_VIEW,
                Permissions.DEPRECIATION_MODEL_CREATE,
                Permissions.DEPRECIATION_MODEL_EDIT,
                Permissions.DEPRECIATION_MODEL_DELETE
              ]
            },
            {
              title: 'Asset',
              page: '/' + ASSET.LIST,
              permission: [
                Permissions.ASSET_VIEW,
                Permissions.ASSET_CREATE,
                Permissions.ASSET_EDIT,
                Permissions.ASSET_DELETE
              ]
            },
            {
              title: 'CWIP',
              page: '/' + CWIP.LIST,
              permission: [
                Permissions.CWIP_CREATE,
                Permissions.CWIP_CREATE,
                Permissions.CWIP_EDIT,
                Permissions.CWIP_DELETE
              ]
            },
            {
              title: 'Depreciation Adjustment',
              page: '/' + DEPRECIATION_ADJUSTMENT.LIST,
              permission: [
                Permissions.DEPRECIATION_ADJUSTMENT_VIEW,
                Permissions.DEPRECIATION_ADJUSTMENT_CREATE,
                Permissions.DEPRECIATION_ADJUSTMENT_EDIT,
                Permissions.DEPRECIATION_ADJUSTMENT_DELETE
              ]
            },
            {
              title: 'Disposal',
              page: '/' + DISPOSAL.LIST,
              permission: [
                Permissions.DISPOSAL_CREATE,
                Permissions.DISPOSAL_CREATE,
                Permissions.DISPOSAL_EDIT,
                Permissions.DISPOSAL_DELETE
              ]
            },
            {
              title: 'Fixed Asset Report',
              page: '/' + ASSET_REPORT.LIST,
              // permission: [
              //   Permissions.ASSET_REPORT_VIEW,
              //   Permissions.ASSET_REPORT_CREATE,
              // ]
            }
          ]
        },


        //Procurement Section
        {
          title: 'Procurement',
          bullet: 'dot',
          icon: 'flaticon2-shopping-cart',
          permission: [
            Permissions.PURCHASEORDER_VIEW,
            Permissions.PURCHASEORDER_CREATE,
            Permissions.PURCHASEORDER_EDIT,
            Permissions.PURCHASEORDER_DELETE,
            Permissions.PURCHASEORDER_REVIEW,
            Permissions.PURCHASEORDER_APPROVE,
            Permissions.REQUISITION_VIEW,
            Permissions.REQUISITION_CREATE,
            Permissions.REQUISITION_EDIT,
            Permissions.REQUISITION_DELETE,
            Permissions.REQUISITION_REVIEW,
            Permissions.REQUISITION_APPROVE,
            Permissions.REQUEST_VIEW,
            Permissions.REQUEST_CREATE,
            Permissions.REQUEST_EDIT,
            Permissions.REQUEST_DELETE,
            Permissions.REQUEST_REVIEW,
            Permissions.REQUEST_APPROVE,
            Permissions.ISSUANCE_VIEW,
            Permissions.ISSUANCE_CREATE,
            Permissions.ISSUANCE_EDIT,
            Permissions.ISSUANCE_DELETE,
            Permissions.ISSUANCE_RETURN_VIEW,
            Permissions.ISSUANCE_RETURN_CREATE,
            Permissions.ISSUANCE_RETURN_EDIT,
            Permissions.ISSUANCE_RETURN_DELETE,
            Permissions.GRN_VIEW,
            Permissions.GRN_CREATE,
            Permissions.GRN_EDIT,
            Permissions.GRN_DELETE,
            Permissions.STOCK_VIEW,
            Permissions.GOODS_RETURN_NOTE_VIEW,
            Permissions.GOODS_RETURN_NOTE_CREATE,
            Permissions.GOODS_RETURN_NOTE_EDIT,
            Permissions.GOODS_RETURN_NOTE_DELETE,
            Permissions.BIDEVALUATION_VIEW,
            Permissions.BIDEVALUATION_CREATE,
            Permissions.BIDEVALUATION_EDIT,
            Permissions.BIDEVALUATION_DELETE,
            Permissions.QUOTATION_VIEW,
            Permissions.QUOTATION_CREATE,
            Permissions.QUOTATION_EDIT,
            Permissions.QUOTATION_DELETE,
            Permissions.CALL_QUOTATION_VIEW,
            Permissions.CALL_QUOTATION_CREATE,
            Permissions.CALL_QUOTATION_EDIT,
            Permissions.CALL_QUOTATION_DELETE,
            Permissions.QUOTATION_COMPARATIVE_VIEW,
            Permissions.QUOTATION_COMPARATIVE_CREATE,
            Permissions.QUOTATION_COMPARATIVE_EDIT,
            Permissions.QUOTATION_COMPARATIVE_DELETE
          ],
          submenu: [
            {
              title: 'Request Requisition',
              page: '/' + REQUEST_REQUISITION.LIST,
              permission: [
                Permissions.REQUEST_VIEW,
                Permissions.REQUEST_CREATE,
                Permissions.REQUEST_EDIT,
                Permissions.REQUEST_DELETE,
                Permissions.REQUEST_REVIEW,
                Permissions.REQUEST_APPROVE,
              ]
            },
            {
              title: 'Requisition',
              page: '/' + REQUISITION.LIST,
              permission: [
                Permissions.REQUISITION_VIEW,
                Permissions.REQUISITION_CREATE,
                Permissions.REQUISITION_EDIT,
                Permissions.REQUISITION_DELETE,
                Permissions.REQUISITION_REVIEW,
                Permissions.REQUISITION_APPROVE
              ]
            },
            {
              title: 'Call Quotation',
              page: '/' + CALL_QUOTATION.LIST,
              permission: [
                Permissions.CALL_QUOTATION_VIEW,
                Permissions.CALL_QUOTATION_CREATE,
                Permissions.CALL_QUOTATION_EDIT,
                Permissions.CALL_QUOTATION_DELETE,
              ]
            },
            {
              title: 'Quotation',
              page: '/' + QUOTATION.LIST,
              permission: [
                Permissions.QUOTATION_VIEW,
                Permissions.QUOTATION_CREATE,
                Permissions.QUOTATION_EDIT,
                Permissions.QUOTATION_DELETE,
                Permissions.QUOTATION_REVIEW,
                Permissions.QUOTATION_APPROVE,
              ]
            },
            {
              title: 'Quotation Comparative',
              page: '/' + QUOTATION_COMPARATIVE.LIST,
              permission: [
                Permissions.QUOTATION_COMPARATIVE_VIEW,
                Permissions.QUOTATION_COMPARATIVE_CREATE,
                Permissions.QUOTATION_COMPARATIVE_EDIT,
                Permissions.QUOTATION_COMPARATIVE_DELETE
              ]
            },
            {
              title: 'Issuance',
              page: '/' + ISSUANCE.LIST,
              permission: [
                Permissions.ISSUANCE_VIEW,
                Permissions.ISSUANCE_CREATE,
                Permissions.ISSUANCE_EDIT,
                Permissions.ISSUANCE_DELETE
              ],
            },
            {
              title: 'Issuance Return',
              page: '/' + ISSUANCE_RETURN.LIST,
              permission: [
                Permissions.ISSUANCE_RETURN_VIEW,
                Permissions.ISSUANCE_RETURN_CREATE,
                Permissions.ISSUANCE_RETURN_EDIT,
                Permissions.ISSUANCE_RETURN_DELETE,
              ],
            },
            {
              title: 'Purchase Order',
              page: '/' + PURCHASE_ORDER.LIST,
              permission: [
                Permissions.PURCHASEORDER_VIEW,
                Permissions.PURCHASEORDER_CREATE,
                Permissions.PURCHASEORDER_EDIT,
                Permissions.PURCHASEORDER_DELETE,
                Permissions.PURCHASEORDER_REVIEW,
                Permissions.PURCHASEORDER_APPROVE
              ]
            },
            {
              title: 'Goods Received Note',
              page: '/' + GOODS_RECEIVED_NOTE.LIST,
              permission: [
                Permissions.GRN_VIEW,
                Permissions.GRN_CREATE,
                Permissions.GRN_EDIT,
                Permissions.GRN_DELETE
              ]
            },
            {
              title: 'Goods Return Note',
              page: '/' + GOODS_RETURN_NOTE.LIST,
              permission: [
                Permissions.GOODS_RETURN_NOTE_VIEW,
                Permissions.GOODS_RETURN_NOTE_CREATE,
                Permissions.GOODS_RETURN_NOTE_EDIT,
                Permissions.GOODS_RETURN_NOTE_DELETE
              ]
            },
            {
              title: 'Bid Evaluation',
              page: '/' + BID_EVALUATION.LIST,
              permission: [
                Permissions.BIDEVALUATION_VIEW,
                Permissions.BIDEVALUATION_CREATE,
                Permissions.BIDEVALUATION_EDIT,
                Permissions.BIDEVALUATION_DELETE
              ]
            },
            {
              title: 'Inventory',
              page: '/' + STOCK.LIST,
              permission: [
                Permissions.STOCK_VIEW
              ]
            },
          ]
        },
        //Budget Portion
        {
          title: 'Budget',
          bullet: 'dot',
          icon: 'flaticon2-analytics',
          permission: [
            Permissions.BUDGET_VIEW,
            Permissions.BUDGET_CREATE,
            Permissions.BUDGET_EDIT,
            Permissions.BUDGET_DELETE,
            Permissions.BUDGET_REPORT_VIEW,
            Permissions.ESTIMATED_BUDGET_VIEW,
            Permissions.ESTIMATED_BUDGET_CREATE,
            Permissions.ESTIMATED_BUDGET_EDIT,
            Permissions.ESTIMATED_BUDGET_DELETE,
            Permissions.ESTIMATED_BUDGET_VIEW,
            Permissions.ESTIMATED_BUDGET_CREATE,
            Permissions.ESTIMATED_BUDGET_EDIT,
            Permissions.ESTIMATED_BUDGET_DELETE,
            Permissions.BUDGET_REPORT_VIEW,
          ],
          submenu: [
            {
              title: 'Estimated Budget',
              page: '/' + BUDGET.LIST,
              permission: [
                Permissions.BUDGET_VIEW,
                Permissions.BUDGET_CREATE,
                Permissions.BUDGET_EDIT,
                Permissions.BUDGET_DELETE
              ]
            },
            {
              title: 'Anticipated Budget',
              page: '/' + ESTIMATED_BUDGET.LIST,
              permission: [
                Permissions.ESTIMATED_BUDGET_VIEW,
                Permissions.ESTIMATED_BUDGET_CREATE,
                Permissions.ESTIMATED_BUDGET_EDIT,
                Permissions.ESTIMATED_BUDGET_DELETE
              ]
            },
            {
              title: 'Budget Report',
              page: '/' + BUDGET.REPORT,
              permission: [
                Permissions.BUDGET_REPORT_VIEW,
              ]
            },
            {
              title: 'Budget Reappropriation',
              page: '/' + BUDGET_REAPPROPIATION.LIST,
              permission: [
                Permissions.ESTIMATED_BUDGET_VIEW,
                Permissions.ESTIMATED_BUDGET_CREATE,
                Permissions.ESTIMATED_BUDGET_EDIT,
                Permissions.ESTIMATED_BUDGET_DELETE
              ]
            },
          ]
        },
        //Payroll Portion
        {
          title: 'Payroll',
          bullet: 'dot',
          icon: 'flaticon2-percentage',
          permission: [
            Permissions.PAYROLL_ITEM_VIEW,
            Permissions.PAYROLL_ITEM_CREATE,
            Permissions.PAYROLL_ITEM_EDIT,
            Permissions.PAYROLL_ITEM_DELETE,
            Permissions.PAYROLL_TRANSACTION_VIEW,
            Permissions.PAYROLL_TRANSACTION_CREATE,
            Permissions.PAYROLL_TRANSACTION_EDIT,
            Permissions.PAYROLL_TRANSACTION_DELETE,
            Permissions.PAYROLL_TRANSACTION_APPROVE,
            Permissions.PAYROLL_TRANSACTION_REVIEW,
            Permissions.PAYROLL_PAYMENT_VIEW,
            Permissions.PAYROLL_PAYMENT_CREATE,
            Permissions.PAYROLL_PAYMENT_EDIT,
            Permissions.PAYROLL_PAYMENT_DELETE,
            Permissions.DESIGNATIONS_VIEW,
            Permissions.DESIGNATIONS_CREATE,
            Permissions.DESIGNATIONS_EDIT,
            Permissions.DESIGNATIONS_DELETE,
            Permissions.DEPARTMENTS_VIEW,
            Permissions.DEPARTMENTS_CREATE,
            Permissions.DEPARTMENTS_EDIT,
            Permissions.DEPARTMENTS_DELETE,
            Permissions.EMPLOYEE_VIEW,
            Permissions.EMPLOYEE_CREATE,
            Permissions.EMPLOYEE_EDIT,
            Permissions.EMPLOYEE_DELETE
          ],
          submenu: [
            {
              title: 'Designation',
              page: '/' + DESIGNATION.LIST,
              permission: [
                Permissions.DESIGNATIONS_VIEW,
                Permissions.DESIGNATIONS_CREATE,
                Permissions.DESIGNATIONS_EDIT,
                Permissions.DESIGNATIONS_DELETE,
              ]
            },
            {
              title: 'Department',
              page: '/' + DEPARTMENT.LIST,
              permission: [
                Permissions.DEPARTMENTS_VIEW,
                Permissions.DEPARTMENTS_CREATE,
                Permissions.DEPARTMENTS_EDIT,
                Permissions.DEPARTMENTS_DELETE,
              ]
            },
            {
              title: 'Employee',
              page: '/' + EMPLOYEE.LIST,
              permission: [
                Permissions.EMPLOYEE_VIEW,
                Permissions.EMPLOYEE_CREATE,
                Permissions.EMPLOYEE_EDIT,
                Permissions.EMPLOYEE_DELETE
              ]
            },
            {
              title: 'Payroll Item',
              page: '/' + PAYROLL_ITEM.LIST,
              permission: [
                Permissions.PAYROLL_ITEM_VIEW,
                Permissions.PAYROLL_ITEM_CREATE,
                Permissions.PAYROLL_ITEM_EDIT,
                Permissions.PAYROLL_ITEM_DELETE
              ]
            },
            {
              title: 'Payroll Transaction',
              page: '/' + PAYROLL_TRANSACTION.LIST,
              permission: [
                Permissions.PAYROLL_TRANSACTION_VIEW,
                Permissions.PAYROLL_TRANSACTION_CREATE,
                Permissions.PAYROLL_TRANSACTION_EDIT,
                Permissions.PAYROLL_TRANSACTION_DELETE,
                Permissions.PAYROLL_TRANSACTION_APPROVE,
                Permissions.PAYROLL_TRANSACTION_REVIEW,
              ],
            },
            {
              title: 'Payroll Payment',
              page: '/' + PAYROLL_PAYMENT.LIST,
              permission: [
                Permissions.PAYROLL_PAYMENT_VIEW,
                Permissions.PAYROLL_PAYMENT_CREATE,
                Permissions.PAYROLL_PAYMENT_EDIT,
                Permissions.PAYROLL_PAYMENT_DELETE,
              ]
            },
            {
              title: 'Payroll Process',
              bullet: 'dot',
              permission: [
                Permissions.PAYROLL_TRANSACTION_CREATE,
                Permissions.PAYROLL_TRANSACTION_APPROVE,
                Permissions.PAYROLL_TRANSACTION_REVIEW,
              ],
              submenu: [
                {
                  title: 'Create Process',
                  page: '/' + PAYROLL_PROCESS.CREATE_PROCESS,
                  permission: [
                    Permissions.PAYROLL_TRANSACTION_CREATE,
                  ],
                },
                {
                  title: 'Approve Process',
                  page: '/' + PAYROLL_PROCESS.APPROVE_PROCESS,
                  permission: [
                    Permissions.PAYROLL_TRANSACTION_CREATE,
                    Permissions.PAYROLL_TRANSACTION_APPROVE,
                    Permissions.PAYROLL_TRANSACTION_REVIEW,
                  ],
                },
                {
                  title: 'Register Payment',
                  bullet: 'dot',
                  submenu: [
                    {
                      title: 'Create Process',
                      page: '/' + PAYROLL_PROCESS.CREATE_PAYMENT,
                      permission: [
                        Permissions.PAYROLL_TRANSACTION_CREATE,
                      ],
                    },
                    {
                      title: 'Approve Process',
                      page: '/' + PAYROLL_PROCESS.APPROVE_PAYMENT,
                      permission: [
                        Permissions.PAYROLL_TRANSACTION_CREATE,
                        Permissions.PAYROLL_TRANSACTION_APPROVE,
                        Permissions.PAYROLL_TRANSACTION_REVIEW,
                      ],
                    },
                  ]
                },
              ]
            },
            {
              title: 'Payroll Reports',
              bullet: 'dot',
              permission: [
                Permissions.PAYROLL_TRANSACTION_VIEW,
                Permissions.PAYROLL_TRANSACTION_CREATE,
                Permissions.PAYROLL_TRANSACTION_EDIT,
                Permissions.PAYROLL_TRANSACTION_DELETE,
                Permissions.PAYROLL_TRANSACTION_APPROVE,
                Permissions.PAYROLL_TRANSACTION_REVIEW,
              ],
              submenu: [
                {
                  title: 'Payroll Transaction Report',
                  page: '/' + PAYROLL_REPORTS.TRANSACTION.LIST,
                  permission: [
                    Permissions.PAYROLL_TRANSACTION_VIEW,
                    Permissions.PAYROLL_TRANSACTION_CREATE,
                    Permissions.PAYROLL_TRANSACTION_EDIT,
                    Permissions.PAYROLL_TRANSACTION_DELETE,
                    Permissions.PAYROLL_TRANSACTION_APPROVE,
                    Permissions.PAYROLL_TRANSACTION_REVIEW,
                  ],
                },
                {
                  title: 'Payroll Executive Summary',
                  page: '/' + PAYROLL_REPORTS.EXECUTIVE.LIST,
                  // permission: [
                  //   Permissions.PAYROLL_TRANSACTION_VIEW,
                  //   Permissions.PAYROLL_TRANSACTION_CREATE,
                  //   Permissions.PAYROLL_TRANSACTION_EDIT,
                  //   Permissions.PAYROLL_TRANSACTION_DELETE,
                  //   Permissions.PAYROLL_TRANSACTION_APPROVE,
                  //   Permissions.PAYROLL_TRANSACTION_REVIEW,
                  // ],
                },
                {
                  title: 'Bank Advice Report',
                  page: '/' + PAYROLL_REPORTS.BANK_ADVICE.LIST,
                  // permission: [
                  //   Permissions.PAYROLL_TRANSACTION_VIEW,
                  //   Permissions.PAYROLL_TRANSACTION_CREATE,
                  //   Permissions.PAYROLL_TRANSACTION_EDIT,
                  //   Permissions.PAYROLL_TRANSACTION_DELETE,
                  //   Permissions.PAYROLL_TRANSACTION_APPROVE,
                  //   Permissions.PAYROLL_TRANSACTION_REVIEW,
                  // ],
                },
              ]
            },
          ]
        },
        //region Report
        {
          title: 'Report',
          bullet: 'dot',
          icon: 'flaticon2-graphic',
          permission: [
            Permissions.GENERALLEDGER_VIEW,
            Permissions.TRIALBALANCE_VIEW,
            Permissions.BALANCESHEET_VIEW,
          ],
          submenu: [
            {
              title: 'General Ledger', // <= Title of the page
              page: '/' + APP_ROUTES.REPORT + '/' + REPORT.GENERAL_LEDGER, // <= URL
              permission: [
                Permissions.GENERALLEDGER_VIEW,
              ]
            },
            {
              title: 'Trial Balance',
              page: '/' + APP_ROUTES.REPORT + '/' + REPORT.TRIAL_BALANCE,
              permission: [
                Permissions.TRIALBALANCE_VIEW,
              ]
            },
            {
              title: 'Income & Expenditure',
              page: '/' + APP_ROUTES.REPORT + '/' + REPORT.PROFIT_N_LOSS,
              permission: [
                Permissions.PROFITLOSS_VIEW,
              ]
            },
            {
              title: 'Balance Sheet',
              page: '/' + APP_ROUTES.REPORT + '/' + REPORT.BALANCE_SHEET,
              permission: [
                Permissions.BALANCESHEET_VIEW,
              ]
            },
          ]
        },
        // // {section: 'Workflow'},
        {
          title: 'Workflow',
          bullet: 'dot',
          icon: 'flaticon-map',
          permission: [
            Permissions.WORKFLOW_CREATE,
            Permissions.WORKFLOW_VIEW,
            Permissions.WORKFLOW_EDIT,
            Permissions.WORKFLOW_DELETE,
            Permissions.STATUS_CREATE,
            Permissions.STATUS_EDIT,
            Permissions.STATUS_VIEW,
            Permissions.STATUS_DELETE,
          ],
          submenu: [
            {
              title: 'Workflows',
              page: '/' + WORKFLOW.LIST,
              permission: [
                Permissions.WORKFLOW_CREATE,
                Permissions.WORKFLOW_VIEW,
                Permissions.WORKFLOW_EDIT,
                Permissions.WORKFLOW_DELETE,
              ]
            },
            {
              title: 'Status',
              page: '/' + STATUS.LIST,
              permission: [
                Permissions.STATUS_CREATE,
                Permissions.STATUS_EDIT,
                Permissions.STATUS_VIEW,
                Permissions.STATUS_DELETE,
              ]
            }
          ]
        },
        //endregion
      ]
    },
  };

  public get configs(): any {
    return this.defaults;
  }
}
