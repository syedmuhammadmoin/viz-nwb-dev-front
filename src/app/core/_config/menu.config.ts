import {
  ACADEMIC_DEPARTMENT,
  ACCESS_MANAGEMENT,
  APP_ROUTES,
  ADMISSION_CRITERIA,
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
  BUDGET_REAPPROPRIATION,
  BUSINESS_PARTNER,
  CALL_QUOTATION,
  CAMPUS,
  CATEGORY,
  CHART_OF_ACCOUNT, CITY, COUNTRY,
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
  DEGREE,
  QUALIFICATION,
  SUBJECT,
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
  SHIFT, STATE,
  STATUS,
  STOCK,
  TAX,
  UNIT_OF_MEASUREMENT,
  WAREHOUSE,
  WORKFLOW,
  DISTRICT,
  DOMICILE,
  FEE_ITEM,
  PETTY_CASH,
  JOURNAL,
  CURRENCY,
  TAXSETTING
} from 'src/app/views/shared/AppRoutes';


import { Permissions } from '../../views/shared/AppEnum'

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
          icon: 'flaticon-dashboard',
          page: '/' + APP_ROUTES.DASHBOARD,
          translate: 'MENU.DASHBOARD',
          bullet: 'dot',
        },

        // {
        //   title: 'Access Management',
        //   bullet: 'dot',
        //   icon: 'flaticon2-avatar',
        //   permission: [
        //     Permissions.AUTH_CREATE,
        //     Permissions.AUTH_VIEW,
        //     Permissions.AUTH_EDIT,
        //     Permissions.AUTH_DELETE,
        //   ],
        //   submenu: [
        //     {
        //       title: 'Roles', // <= Title of the page
        //       page: '/' + APP_ROUTES.ACCESS_MANAGEMENT + '/' + ACCESS_MANAGEMENT.ROLE_LIST, // <= URL
        //       permission: [
        //         Permissions.AUTH_CREATE,
        //         Permissions.AUTH_VIEW,
        //         Permissions.AUTH_EDIT,
        //         Permissions.AUTH_DELETE,
        //       ],
        //     },
        //     {
        //       title: 'Users', // <= Title of the page
        //       page: '/' + APP_ROUTES.ACCESS_MANAGEMENT + '/' + ACCESS_MANAGEMENT.USER_LIST, // <= URL
        //       permission: [
        //         Permissions.AUTH_CREATE,
        //         Permissions.AUTH_VIEW,
        //         Permissions.AUTH_EDIT,
        //         Permissions.AUTH_DELETE,
        //       ],
        //     },
        //   ]
        // },

        // { section: 'profiling' },
        // {
        //   title: 'Profiling',
        //   bullet: 'dot',
        //   icon: 'flaticon2-grids',
        //   permission: [
        //     Permissions.BUSINESSPARTNER_VIEW,
        //     Permissions.BUSINESSPARTNER_CREATE,
        //     Permissions.BUSINESSPARTNER_EDIT,
        //     Permissions.BUSINESSPARTNER_DELETE,
        //     Permissions.CATEGORIES_VIEW,
        //     Permissions.CATEGORIES_CREATE,
        //     Permissions.CATEGORIES_EDIT,
        //     Permissions.CATEGORIES_DELETE,
        //     Permissions.PRODUCT_VIEW,
        //     Permissions.PRODUCT_CREATE,
        //     Permissions.PRODUCT_EDIT,
        //     Permissions.PRODUCT_DELETE,
        //     Permissions.WAREHOUSE_VIEW,
        //     Permissions.WAREHOUSE_CREATE,
        //     Permissions.WAREHOUSE_EDIT,
        //     Permissions.WAREHOUSE_DELETE,
        //     Permissions.TAXES_VIEW,
        //     Permissions.TAXES_CREATE,
        //     Permissions.TAXES_EDIT,
        //     Permissions.TAXES_DELETE,
        //     Permissions.UNIT_OF_MEASUREMENT_VIEW,
        //     Permissions.UNIT_OF_MEASUREMENT_CREATE,
        //     Permissions.UNIT_OF_MEASUREMENT_EDIT,
        //     Permissions.UNIT_OF_MEASUREMENT_DELETE,
        //     Permissions.CAMPUS_VIEW,
        //     Permissions.CAMPUS_CREATE,
        //     Permissions.CAMPUS_EDIT,
        //     Permissions.CAMPUS_DELETE
        //   ],
        //   submenu: [
        //     {
        //       title: 'Campus', // <= Title of the page
        //       page: '/' + CAMPUS.LIST, // <= URL
        //       permission: [
        //         Permissions.CAMPUS_VIEW,
        //         Permissions.CAMPUS_CREATE,
        //         Permissions.CAMPUS_EDIT,
        //         Permissions.CAMPUS_DELETE
        //       ]
        //     },
        //     {
        //       title: 'Store',
        //       page: '/' + WAREHOUSE.LIST,
        //       permission: [
        //         Permissions.WAREHOUSE_VIEW,
        //         Permissions.WAREHOUSE_CREATE,
        //         Permissions.WAREHOUSE_EDIT,
        //         Permissions.WAREHOUSE_DELETE
        //       ]
        //     },
        //     {
        //       title: 'Business Partner', // <= Title of the page
        //       page: '/' + BUSINESS_PARTNER.LIST, // <= URL
        //       permission: [
        //         Permissions.BUSINESSPARTNER_VIEW,
        //         Permissions.BUSINESSPARTNER_CREATE,
        //         Permissions.BUSINESSPARTNER_EDIT,
        //         Permissions.BUSINESSPARTNER_DELETE
        //       ]
        //     },
        //     {
        //       title: 'Category',
        //       page: '/' + CATEGORY.LIST,
        //       permission: [
        //         Permissions.CATEGORIES_VIEW,
        //         Permissions.CATEGORIES_CREATE,
        //         Permissions.CATEGORIES_EDIT,
        //         Permissions.CATEGORIES_DELETE
        //       ]
        //     },
        //     {
        //       title: 'Tax',
        //       page: '/' + TAX.LIST,
        //       permission: [
        //         Permissions.TAXES_VIEW,
        //         Permissions.TAXES_CREATE,
        //         Permissions.TAXES_EDIT,
        //         Permissions.TAXES_DELETE,
        //       ]
        //     },
        //     {
        //       title: 'Unit Of Measurement',
        //       page: '/' + UNIT_OF_MEASUREMENT.LIST,
        //       permission: [
        //         Permissions.UNIT_OF_MEASUREMENT_VIEW,
        //         Permissions.UNIT_OF_MEASUREMENT_CREATE,
        //         Permissions.UNIT_OF_MEASUREMENT_EDIT,
        //         Permissions.UNIT_OF_MEASUREMENT_DELETE,
        //       ]
        //     },
        //     {
        //       title: 'Product',
        //       page: '/' + PRODUCT.LIST,
        //       permission: [
        //         Permissions.PRODUCT_VIEW,
        //         Permissions.PRODUCT_CREATE,
        //         Permissions.PRODUCT_EDIT,
        //         Permissions.PRODUCT_DELETE
        //       ]
        //     }
        //   ]
        // },
        //finance Portion
        // {
        //   title: 'Finance',
        //   bullet: 'dot',
        //   icon: 'flaticon-notepad',
        //   permission: [
        //     Permissions.JOURNALENTRY_VIEW,
        //     Permissions.JOURNALENTRY_CREATE,
        //     Permissions.JOURNALENTRY_EDIT,
        //     Permissions.JOURNALENTRY_DELETE,
        //     Permissions.JOURNALENTRY_REVIEW,
        //     Permissions.JOURNALENTRY_APPROVE,
        //     Permissions.PAYMENT_VIEW,
        //     Permissions.PAYMENT_CREATE,
        //     Permissions.PAYMENT_EDIT,
        //     Permissions.PAYMENT_DELETE,
        //     Permissions.PAYMENT_REVIEW,
        //     Permissions.PAYMENT_APPROVE,
        //     Permissions.RECEIPT_CREATE,
        //     Permissions.RECEIPT_EDIT,
        //     Permissions.RECEIPT_DELETE,
        //     Permissions.RECEIPT_REVIEW,
        //     Permissions.RECEIPT_APPROVE,
        //     Permissions.BANKSTATEMENT_VIEW,
        //     Permissions.BANKSTATEMENT_CREATE,
        //     Permissions.BANKSTATEMENT_EDIT,
        //     Permissions.BANKSTATEMENT_DELETE,
        //     Permissions.BANKACCOUNT_VIEW,
        //     Permissions.BANKACCOUNT_CREATE,
        //     Permissions.BANKACCOUNT_EDIT,
        //     Permissions.BANKACCOUNT_DELETE,
        //     Permissions.CASHACCOUNT_VIEW,
        //     Permissions.CASHACCOUNT_CREATE,
        //     Permissions.CASHACCOUNT_EDIT,
        //     Permissions.CASHACCOUNT_DELETE,
        //     Permissions.LEVEL3_VIEW,
        //     Permissions.LEVEL3_CREATE,
        //     Permissions.LEVEL3_EDIT,
        //     Permissions.LEVEL3_DELETE,
        //     Permissions.LEVEL4_VIEW,
        //     Permissions.LEVEL4_CREATE,
        //     Permissions.LEVEL4_EDIT,
        //     Permissions.LEVEL4_DELETE,
        //     Permissions.INVOICE_VIEW,
        //     Permissions.INVOICE_CREATE,
        //     Permissions.INVOICE_EDIT,
        //     Permissions.INVOICE_DELETE,
        //     Permissions.INVOICE_REVIEW,
        //     Permissions.INVOICE_APPROVE,
        //     Permissions.CREDITNOTE_VIEW,
        //     Permissions.CREDITNOTE_CREATE,
        //     Permissions.CREDITNOTE_EDIT,
        //     Permissions.CREDITNOTE_DELETE,
        //     Permissions.CREDITNOTE_REVIEW,
        //     Permissions.CREDITNOTE_APPROVE,
        //     Permissions.BILL_VIEW,
        //     Permissions.BILL_CREATE,
        //     Permissions.BILL_EDIT,
        //     Permissions.BILL_DELETE,
        //     Permissions.BILL_REVIEW,
        //     Permissions.BILL_APPROVE,
        //     Permissions.DEBITNOTE_VIEW,
        //     Permissions.DEBITNOTE_CREATE,
        //     Permissions.DEBITNOTE_EDIT,
        //     Permissions.DEBITNOTE_DELETE,
        //     Permissions.DEBITNOTE_REVIEW,
        //     Permissions.DEBITNOTE_APPROVE,
        //     Permissions.CHARTOFACCOUNT_VIEW,
        //     Permissions.BANK_RECON_VIEW,
        //     Permissions.BANK_RECON_CREATE,
        //     Permissions.BANK_RECON_EDIT,
        //     Permissions.BANK_RECON_DELETE,

        //     Permissions.JOURNAL_VIEW,
        //     Permissions.JOURNAL_CREATE,
        //     Permissions.JOURNAL_EDIT,
        //     Permissions.JOURNAL_DELETE,
        //     Permissions.JOURNAL_REVIEW,
        //     Permissions.JOURNAL_APPROVE,

        //   ],
        //   submenu: [
        //     {
        //       title: 'Bank Account',
        //       page: '/' + BANK_ACCOUNT.LIST,
        //       permission: [
        //         Permissions.BANKACCOUNT_VIEW,
        //         Permissions.BANKACCOUNT_CREATE,
        //         Permissions.BANKACCOUNT_EDIT,
        //         Permissions.BANKACCOUNT_DELETE
        //       ]
        //     },
        //     {
        //       title: 'Payment',
        //       page: '/' + PAYMENT.LIST,
        //       permission: [
        //         Permissions.PAYMENT_VIEW,
        //         Permissions.PAYMENT_CREATE,
        //         Permissions.PAYMENT_EDIT,
        //         Permissions.PAYMENT_DELETE,
        //         Permissions.PAYMENT_REVIEW,
        //         Permissions.PAYMENT_APPROVE,
        //       ]
        //     },
        //     {
        //       title: 'Receipt',
        //       page: '/' + RECEIPT.LIST,
        //       permission: [
        //         Permissions.RECEIPT_VIEW,
        //         Permissions.RECEIPT_CREATE,
        //         Permissions.RECEIPT_EDIT,
        //         Permissions.RECEIPT_DELETE,
        //         Permissions.RECEIPT_REVIEW,
        //         Permissions.RECEIPT_APPROVE,
        //       ]
        //     },
        //     {
        //       title: 'Journal',
        //       page: '/' + JOURNAL.LIST,
        //       permission: [
        //         Permissions.JOURNAL_VIEW,
        //         Permissions.JOURNAL_CREATE,
        //         Permissions.JOURNAL_EDIT,
        //         Permissions.JOURNAL_DELETE,
        //         Permissions.JOURNAL_REVIEW,
        //         Permissions.JOURNAL_APPROVE,
        //       ]
        //     }, 
        //     {
        //       title: 'Journal Entry',
        //       page: '/' + JOURNAL_ENTRY.LIST,
        //       permission: [
        //         Permissions.JOURNALENTRY_VIEW,
        //         Permissions.JOURNALENTRY_CREATE,
        //         Permissions.JOURNALENTRY_EDIT,
        //         Permissions.JOURNALENTRY_DELETE,
        //         Permissions.JOURNALENTRY_REVIEW,
        //         Permissions.JOURNALENTRY_APPROVE,
        //       ]
        //     },
        //     {
        //       title: 'Petty Cash',
        //       page: '/' + PETTY_CASH.LIST,
        //       permission: [
        //         Permissions.PETTYCASH_VIEW,
        //         Permissions.PETTYCASH_CREATE,
        //         Permissions.PETTYCASH_EDIT,
        //         Permissions.PETTYCASH_DELETE,
        //         Permissions.PETTYCASH_REVIEW,
        //         Permissions.PETTYCASH_APPROVE,
        //       ]
        //     },
        //     {
        //       title: 'Invoice',
        //       page: '/' + INVOICE.LIST,
        //       permission: [
        //         Permissions.INVOICE_VIEW,
        //         Permissions.INVOICE_CREATE,
        //         Permissions.INVOICE_EDIT,
        //         Permissions.INVOICE_DELETE,
        //         Permissions.INVOICE_REVIEW,
        //         Permissions.INVOICE_APPROVE,
        //       ]
        //     },
        //     {
        //       title: 'Credit Note',
        //       page: '/' + CREDIT_NOTE.LIST,
        //       permission: [
        //         Permissions.CREDITNOTE_VIEW,
        //         Permissions.CREDITNOTE_CREATE,
        //         Permissions.CREDITNOTE_EDIT,
        //         Permissions.CREDITNOTE_DELETE,
        //         Permissions.CREDITNOTE_REVIEW,
        //         Permissions.CREDITNOTE_APPROVE,
        //       ]
        //     },
        //     {
        //       title: 'Vendor Bill',
        //       page: '/' + BILL.LIST,
        //       permission: [
        //         Permissions.BILL_VIEW,
        //         Permissions.BILL_CREATE,
        //         Permissions.BILL_EDIT,
        //         Permissions.BILL_DELETE,
        //         Permissions.BILL_REVIEW,
        //         Permissions.BILL_APPROVE,
        //       ]
        //     },
        //     {
        //       title: 'Debit Note',
        //       page: '/' + DEBIT_NOTE.LIST,
        //       permission: [
        //         Permissions.DEBITNOTE_VIEW,
        //         Permissions.DEBITNOTE_CREATE,
        //         Permissions.DEBITNOTE_EDIT,
        //         Permissions.DEBITNOTE_DELETE,
        //         Permissions.DEBITNOTE_REVIEW,
        //         Permissions.DEBITNOTE_APPROVE,
        //       ]
        //     },
        //     {
        //       title: 'Bank Statement',
        //       page: '/' + BANK_STATEMENT.LIST,
        //       permission: [
        //         Permissions.BANKSTATEMENT_VIEW,
        //         Permissions.BANKSTATEMENT_CREATE,
        //         Permissions.BANKSTATEMENT_EDIT,
        //         Permissions.BANKSTATEMENT_DELETE,
        //       ]
        //     },
        //     {
        //       title: 'Bank Reconciliation',
        //       page: '/' + BANK_RECONCILIATION.LIST,
        //       permission: [
        //         Permissions.BANK_RECON_VIEW,
        //         Permissions.BANK_RECON_CREATE,
        //         Permissions.BANK_RECON_EDIT,
        //         Permissions.BANK_RECON_DELETE
        //       ]
        //     },
        //     {
        //       title: 'Chart Of Account',
        //       page: '/' + CHART_OF_ACCOUNT.LIST,
        //       permission: [
        //         Permissions.LEVEL3_VIEW,
        //         Permissions.LEVEL3_CREATE,
        //         Permissions.LEVEL3_EDIT,
        //         Permissions.LEVEL3_DELETE,
        //         Permissions.LEVEL4_VIEW,
        //         Permissions.LEVEL4_CREATE,
        //         Permissions.LEVEL4_EDIT,
        //         Permissions.LEVEL4_DELETE,
        //         Permissions.CHARTOFACCOUNT_VIEW
        //       ]
        //     },
        //   ]
        // },
        //  // ADMISSION Portion
        //   {
        //     title: 'Admission',
        //     bullet: 'dot',
        //     icon: 'flaticon2-analytics',
        //     permission: [
        //       Permissions.ADMISSION_CRITERIA_VIEW,
        //       Permissions.ADMISSION_CRITERIA_CREATE,
        //       Permissions.ADMISSION_CRITERIA_EDIT,
        //       Permissions.ADMISSION_CRITERIA_DELETE,
        //       Permissions.ADMISSION_ACADEMIC_DEPARTMENT_VIEW,
        //       Permissions.ADMISSION_ACADEMIC_DEPARTMENT_CREATE,
        //       Permissions.ADMISSION_ACADEMIC_DEPARTMENT_EDIT,
        //       Permissions.ADMISSION_ACADEMIC_DEPARTMENT_DELETE,
        //       Permissions.ADMISSION_FACULTY_VIEW,
        //       Permissions.ADMISSION_FACULTY_CREATE,
        //       Permissions.ADMISSION_FACULTY_EDIT,
        //       Permissions.ADMISSION_FACULTY_DELETE,
        //       Permissions.ADMISSION_SHIFT_VIEW,
        //       Permissions.ADMISSION_SHIFT_CREATE,
        //       Permissions.ADMISSION_SHIFT_EDIT,
        //       Permissions.ADMISSION_SHIFT_DELETE,
        //       Permissions.ADMISSION_BATCH_VIEW,
        //       Permissions.ADMISSION_BATCH_CREATE,
        //       Permissions.ADMISSION_BATCH_EDIT,
        //       Permissions.ADMISSION_BATCH_DELETE,
        //       Permissions.ADMISSION_COURSE_VIEW,
        //       Permissions.ADMISSION_COURSE_CREATE,
        //       Permissions.ADMISSION_COURSE_EDIT,
        //       Permissions.ADMISSION_COURSE_DELETE,
        //       Permissions.ADMISSION_SEMESTER_VIEW,
        //       Permissions.ADMISSION_SEMESTER_CREATE,
        //       Permissions.ADMISSION_SEMESTER_EDIT,
        //       Permissions.ADMISSION_SEMESTER_DELETE,
        //       Permissions.ADMISSION_COUNTRY_VIEW,
        //       Permissions.ADMISSION_COUNTRY_CREATE,
        //       Permissions.ADMISSION_COUNTRY_EDIT,
        //       Permissions.ADMISSION_COUNTRY_DELETE,
        //       Permissions.ADMISSION_STATE_VIEW,
        //       Permissions.ADMISSION_STATE_CREATE,
        //       Permissions.ADMISSION_STATE_EDIT,
        //       Permissions.ADMISSION_STATE_DELETE,
        //       Permissions.ADMISSION_CITY_VIEW,
        //       Permissions.ADMISSION_CITY_CREATE,
        //       Permissions.ADMISSION_CITY_EDIT,
        //       Permissions.ADMISSION_CITY_DELETE,
        //       Permissions.ADMISSION_DISTRICT_VIEW,
        //       Permissions.ADMISSION_DISTRICT_CREATE,
        //       Permissions.ADMISSION_DISTRICT_EDIT,
        //       Permissions.ADMISSION_DISTRICT_DELETE,
        //       Permissions.ADMISSION_DOMICILE_VIEW,
        //       Permissions.ADMISSION_DOMICILE_CREATE,
        //       Permissions.ADMISSION_DOMICILE_EDIT,
        //       Permissions.ADMISSION_DOMICILE_DELETE,
        //       Permissions.ADMISSION_DEGREE_VIEW,
        //       Permissions.ADMISSION_DEGREE_CREATE,
        //       Permissions.ADMISSION_DEGREE_EDIT,
        //       Permissions.ADMISSION_DEGREE_DELETE,
        //       Permissions.ADMISSION_FEEITEM_VIEW,
        //       Permissions.ADMISSION_FEEITEM_CREATE,
        //       Permissions.ADMISSION_FEEITEM_EDIT,
        //       Permissions.ADMISSION_FEEITEM_DELETE,
        //       Permissions.ADMISSION_PROGRAM_VIEW,
        //       Permissions.ADMISSION_PROGRAM_CREATE,
        //       Permissions.ADMISSION_PROGRAM_EDIT,
        //       Permissions.ADMISSION_PROGRAM_DELETE,
        //       Permissions.ADMISSION_QUALIFICATION_VIEW,
        //       Permissions.ADMISSION_QUALIFICATION_CREATE,
        //       Permissions.ADMISSION_QUALIFICATION_EDIT,
        //       Permissions.ADMISSION_QUALIFICATION_DELETE,
        //       Permissions.ADMISSION_SUBJECT_VIEW,
        //       Permissions.ADMISSION_SUBJECT_CREATE,
        //       Permissions.ADMISSION_SUBJECT_EDIT,
        //       Permissions.ADMISSION_SUBJECT_DELETE
        //     ],
        //     submenu: [
        //       {
        //         title: 'Admission Criteria',
        //         page: '/' + ADMISSION_CRITERIA.LIST,
        //         permission: [
        //           Permissions.ADMISSION_CRITERIA_VIEW,
        //           Permissions.ADMISSION_CRITERIA_CREATE,
        //           Permissions.ADMISSION_CRITERIA_EDIT,
        //           Permissions.ADMISSION_CRITERIA_DELETE
        //         ]
        //       },
        //       {
        //         title: 'Academic Department',
        //         page: '/' + ACADEMIC_DEPARTMENT.LIST,
        //         permission: [
        //           Permissions.ADMISSION_ACADEMIC_DEPARTMENT_VIEW,
        //           Permissions.ADMISSION_ACADEMIC_DEPARTMENT_CREATE,
        //           Permissions.ADMISSION_ACADEMIC_DEPARTMENT_EDIT,
        //           Permissions.ADMISSION_ACADEMIC_DEPARTMENT_DELETE
        //         ]
        //       },
        //       {
        //         title: 'Faculty',
        //         page: '/' + FACULTY.LIST,
        //         permission: [
        //           Permissions.ADMISSION_FACULTY_VIEW,
        //           Permissions.ADMISSION_FACULTY_CREATE,
        //           Permissions.ADMISSION_FACULTY_EDIT,
        //           Permissions.ADMISSION_FACULTY_DELETE
        //         ]
        //       },
        //       {
        //         title: 'Shift',
        //         page: '/' + SHIFT.LIST,
        //         permission: [
        //           Permissions.ADMISSION_SHIFT_VIEW,
        //           Permissions.ADMISSION_SHIFT_CREATE,
        //           Permissions.ADMISSION_SHIFT_EDIT,
        //           Permissions.ADMISSION_SHIFT_DELETE
        //         ]
        //       },
        //       {
        //         title: 'Batch',
        //         page: '/' + BATCH.LIST,
        //         permission: [
        //           Permissions.ADMISSION_BATCH_VIEW,
        //           Permissions.ADMISSION_BATCH_CREATE,
        //           Permissions.ADMISSION_BATCH_EDIT,
        //           Permissions.ADMISSION_BATCH_DELETE
        //         ]
        //       },
        //       {
        //         title: 'Course',
        //         page: '/' + COURSE.LIST,
        //         permission: [
        //           Permissions.ADMISSION_COURSE_VIEW,
        //           Permissions.ADMISSION_COURSE_CREATE,
        //           Permissions.ADMISSION_COURSE_EDIT,
        //           Permissions.ADMISSION_COURSE_DELETE
        //         ]
        //       },
        //       {
        //         title: 'Semester',
        //         page: '/' + SEMESTER.LIST,
        //         permission: [
        //           Permissions.ADMISSION_SEMESTER_VIEW,
        //           Permissions.ADMISSION_SEMESTER_CREATE,
        //           Permissions.ADMISSION_SEMESTER_EDIT,
        //           Permissions.ADMISSION_SEMESTER_DELETE
        //         ]
        //       },
        //       {
        //         title: 'Country',
        //         page: '/' + COUNTRY.LIST,
        //         permission: [
        //           Permissions.ADMISSION_COUNTRY_VIEW,
        //           Permissions.ADMISSION_COUNTRY_CREATE,
        //           Permissions.ADMISSION_COUNTRY_EDIT,
        //           Permissions.ADMISSION_COUNTRY_DELETE
        //         ]
        //       },
        //       {
        //         title: 'State',
        //         page: '/' + STATE.LIST,
        //         permission: [
        //           Permissions.ADMISSION_STATE_VIEW,
        //           Permissions.ADMISSION_STATE_CREATE,
        //           Permissions.ADMISSION_STATE_EDIT,
        //           Permissions.ADMISSION_STATE_DELETE
        //         ]
        //       },
        //       {
        //         title: 'City',
        //         page: '/' + CITY.LIST,
        //         permission: [
        //           Permissions.ADMISSION_CITY_VIEW,
        //           Permissions.ADMISSION_CITY_CREATE,
        //           Permissions.ADMISSION_CITY_EDIT,
        //           Permissions.ADMISSION_CITY_DELETE
        //         ]
        //       },
        //       {
        //         title: 'District',
        //         page: '/' + DISTRICT.LIST,
        //         permission: [
        //           Permissions.ADMISSION_DISTRICT_VIEW,
        //           Permissions.ADMISSION_DISTRICT_CREATE,
        //           Permissions.ADMISSION_DISTRICT_EDIT,
        //           Permissions.ADMISSION_DISTRICT_DELETE
        //         ]
        //       },
        //       {
        //         title: 'Domicile',
        //         page: '/' + DOMICILE.LIST,
        //         permission: [
        //           Permissions.ADMISSION_DOMICILE_VIEW,
        //           Permissions.ADMISSION_DOMICILE_CREATE,
        //           Permissions.ADMISSION_DOMICILE_EDIT,
        //           Permissions.ADMISSION_DOMICILE_DELETE
        //         ]
        //       },
        //       {
        //         title: 'Degree',
        //         page: '/' + DEGREE.LIST,
        //         permission: [
        //           Permissions.ADMISSION_DEGREE_VIEW,
        //           Permissions.ADMISSION_DEGREE_CREATE,
        //           Permissions.ADMISSION_DEGREE_EDIT,
        //           Permissions.ADMISSION_DEGREE_DELETE
        //         ]
        //       },
        //       {
        //         title: 'Fee Item',
        //         page: '/' + FEE_ITEM.LIST,
        //         permission: [
        //           Permissions.ADMISSION_FEEITEM_VIEW,
        //           Permissions.ADMISSION_FEEITEM_CREATE,
        //           Permissions.ADMISSION_FEEITEM_EDIT,
        //           Permissions.ADMISSION_FEEITEM_DELETE
        //         ]
        //       },
        //       {
        //         title: 'Program',
        //         page: '/' + PROGRAM.LIST,
        //         permission: [
        //           Permissions.ADMISSION_PROGRAM_VIEW,
        //           Permissions.ADMISSION_PROGRAM_CREATE,
        //           Permissions.ADMISSION_PROGRAM_EDIT,
        //           Permissions.ADMISSION_PROGRAM_DELETE
        //         ]
        //       },
        //       {
        //         title: 'Qualification',
        //         page: '/' + QUALIFICATION.LIST,
        //         permission: [
        //           Permissions.ADMISSION_QUALIFICATION_VIEW,
        //           Permissions.ADMISSION_QUALIFICATION_CREATE,
        //           Permissions.ADMISSION_QUALIFICATION_EDIT,
        //           Permissions.ADMISSION_QUALIFICATION_DELETE
        //         ]
        //       },
        //       {
        //         title: 'Subject',
        //         page: '/' + SUBJECT.LIST,
        //         permission: [
        //           Permissions.ADMISSION_SUBJECT_VIEW,
        //           Permissions.ADMISSION_SUBJECT_CREATE,
        //           Permissions.ADMISSION_SUBJECT_EDIT,
        //           Permissions.ADMISSION_SUBJECT_DELETE
        //         ]
        //       },
        //     ]
        //   },
        //Fixed Asset Section
        // {
        //   title: 'Fixed Asset',
        //   bullet: 'dot',
        //   icon: 'flaticon2-box-1',
        //   permission: [
        //     Permissions.DEPRECIATION_MODEL_VIEW,
        //     Permissions.DEPRECIATION_MODEL_CREATE,
        //     Permissions.DEPRECIATION_MODEL_EDIT,
        //     Permissions.DEPRECIATION_MODEL_DELETE,
        //     Permissions.ASSET_VIEW,
        //     Permissions.ASSET_CREATE,
        //     Permissions.ASSET_EDIT,
        //     Permissions.ASSET_DELETE,
        //     Permissions.CWIP_VIEW,
        //     Permissions.CWIP_CREATE,
        //     Permissions.CWIP_EDIT,
        //     Permissions.CWIP_DELETE,
        //     Permissions.DISPOSAL_VIEW,
        //     Permissions.DISPOSAL_CREATE,
        //     Permissions.DISPOSAL_EDIT,
        //     Permissions.DISPOSAL_DELETE,
        //     /*Permissions.DEPRECIATION_ADJUSTMENT_VIEW,
        //     Permissions.DEPRECIATION_ADJUSTMENT_CREATE,
        //     Permissions.DEPRECIATION_ADJUSTMENT_EDIT,
        //     Permissions.DEPRECIATION_ADJUSTMENT_DELETE*/
        //   ],
        //   submenu: [
        //     {
        //       title: 'Asset',
        //       page: '/' + ASSET.LIST,
        //       permission: [
        //         Permissions.ASSET_VIEW,
        //         Permissions.ASSET_CREATE,
        //         Permissions.ASSET_EDIT,
        //         Permissions.ASSET_DELETE
        //       ]
        //     },
        //     {
        //       title: 'CWIP',
        //       page: '/' + CWIP.LIST,
        //       permission: [
        //         Permissions.CWIP_CREATE,
        //         Permissions.CWIP_CREATE,
        //         Permissions.CWIP_EDIT,
        //         Permissions.CWIP_DELETE
        //       ]
        //     },
        //     {
        //       title: 'Depreciation',
        //       bullet: 'dot',
        //       permission: [
        //         Permissions.DEPRECIATION_MODEL_VIEW,
        //         Permissions.DEPRECIATION_MODEL_CREATE,
        //         Permissions.DEPRECIATION_MODEL_EDIT,
        //         Permissions.DEPRECIATION_MODEL_DELETE,
        //         Permissions.DEPRECIATION_ADJUSTMENT_VIEW,
        //         Permissions.DEPRECIATION_ADJUSTMENT_CREATE,
        //         Permissions.DEPRECIATION_ADJUSTMENT_EDIT,
        //         Permissions.DEPRECIATION_ADJUSTMENT_DELETE
        //       ],
        //       submenu: [
        //         {
        //           title: 'Model',
        //           page: '/' + DEPRECIATION_MODEL.LIST,
        //           permission: [
        //             Permissions.DEPRECIATION_MODEL_VIEW,
        //             Permissions.DEPRECIATION_MODEL_CREATE,
        //             Permissions.DEPRECIATION_MODEL_EDIT,
        //             Permissions.DEPRECIATION_MODEL_DELETE
        //           ]
        //         },
        //         {
        //           title: 'Adjustment',
        //           page: '/' + DEPRECIATION_ADJUSTMENT.LIST,
        //           permission: [
        //             Permissions.DEPRECIATION_ADJUSTMENT_VIEW,
        //             Permissions.DEPRECIATION_ADJUSTMENT_CREATE,
        //             Permissions.DEPRECIATION_ADJUSTMENT_EDIT,
        //             Permissions.DEPRECIATION_ADJUSTMENT_DELETE
        //           ]
        //         },

        //       ]
        //     },
        //     {
        //       title: 'Disposal',
        //       page: '/' + DISPOSAL.LIST,
        //       permission: [
        //         Permissions.DISPOSAL_CREATE,
        //         Permissions.DISPOSAL_CREATE,
        //         Permissions.DISPOSAL_EDIT,
        //         Permissions.DISPOSAL_DELETE
        //       ]
        //     },
        //     {
        //       title: 'Report',
        //       bullet: 'dot',
        //       permission: [
        //         Permissions.ASSET_REPORT_VIEW,
        //       ],
        //       submenu: [
        //         {
        //           title: 'Asset Report',
        //           page: '/' + ASSET_REPORT.LIST,
        //           permission: [
        //             Permissions.ASSET_REPORT_VIEW,
        //           ]
        //         },
        //         {
        //           title: 'Monthly Report',
        //           page: '/' + ASSET_REPORT.MONTHLY,
        //           permission: [
        //             Permissions.ASSET_REPORT_VIEW,
        //           ]
        //         },
        //         {
        //           title: 'Register Asset Report',
        //           page: '/' + ASSET_REPORT.REGISTER_ASSET,
        //           permission: [
        //             Permissions.ASSET_REPORT_VIEW,
        //           ]
        //         }
        //       ]
        //     },
        //   ]
        // },


        //Procurement Section
        // {
        //   title: 'Procurement',
        //   bullet: 'dot',
        //   icon: 'flaticon2-shopping-cart',
        //   permission: [
        //     Permissions.PURCHASEORDER_VIEW,
        //     Permissions.PURCHASEORDER_CREATE,
        //     Permissions.PURCHASEORDER_EDIT,
        //     Permissions.PURCHASEORDER_DELETE,
        //     Permissions.PURCHASEORDER_REVIEW,
        //     Permissions.PURCHASEORDER_APPROVE,
        //     Permissions.REQUISITION_VIEW,
        //     Permissions.REQUISITION_CREATE,
        //     Permissions.REQUISITION_EDIT,
        //     Permissions.REQUISITION_DELETE,
        //     Permissions.REQUISITION_REVIEW,
        //     Permissions.REQUISITION_APPROVE,
        //     Permissions.REQUEST_VIEW,
        //     Permissions.REQUEST_CREATE,
        //     Permissions.REQUEST_EDIT,
        //     Permissions.REQUEST_DELETE,
        //     Permissions.REQUEST_REVIEW,
        //     Permissions.REQUEST_APPROVE,
        //     Permissions.ISSUANCE_VIEW,
        //     Permissions.ISSUANCE_CREATE,
        //     Permissions.ISSUANCE_EDIT,
        //     Permissions.ISSUANCE_DELETE,
        //     Permissions.ISSUANCE_RETURN_VIEW,
        //     Permissions.ISSUANCE_RETURN_CREATE,
        //     Permissions.ISSUANCE_RETURN_EDIT,
        //     Permissions.ISSUANCE_RETURN_DELETE,
        //     Permissions.GRN_VIEW,
        //     Permissions.GRN_CREATE,
        //     Permissions.GRN_EDIT,
        //     Permissions.GRN_DELETE,
        //     Permissions.STOCK_VIEW,
        //     Permissions.GOODS_RETURN_NOTE_VIEW,
        //     Permissions.GOODS_RETURN_NOTE_CREATE,
        //     Permissions.GOODS_RETURN_NOTE_EDIT,
        //     Permissions.GOODS_RETURN_NOTE_DELETE,
        //     Permissions.BIDEVALUATION_VIEW,
        //     Permissions.BIDEVALUATION_CREATE,
        //     Permissions.BIDEVALUATION_EDIT,
        //     Permissions.BIDEVALUATION_DELETE,
        //     Permissions.QUOTATION_VIEW,
        //     Permissions.QUOTATION_CREATE,
        //     Permissions.QUOTATION_EDIT,
        //     Permissions.QUOTATION_DELETE,
        //     Permissions.CALL_QUOTATION_VIEW,
        //     Permissions.CALL_QUOTATION_CREATE,
        //     Permissions.CALL_QUOTATION_EDIT,
        //     Permissions.CALL_QUOTATION_DELETE,
        //     Permissions.QUOTATION_COMPARATIVE_VIEW,
        //     Permissions.QUOTATION_COMPARATIVE_CREATE,
        //     Permissions.QUOTATION_COMPARATIVE_EDIT,
        //     Permissions.QUOTATION_COMPARATIVE_DELETE
        //   ],
        //   submenu: [
        //     {
        //       title: 'Request Requisition',
        //       page: '/' + REQUEST_REQUISITION.LIST,
        //       permission: [
        //         Permissions.REQUEST_VIEW,
        //         Permissions.REQUEST_CREATE,
        //         Permissions.REQUEST_EDIT,
        //         Permissions.REQUEST_DELETE,
        //         Permissions.REQUEST_REVIEW,
        //         Permissions.REQUEST_APPROVE,
        //       ]
        //     },
        //     {
        //       title: 'Requisition',
        //       page: '/' + REQUISITION.LIST,
        //       permission: [
        //         Permissions.REQUISITION_VIEW,
        //         Permissions.REQUISITION_CREATE,
        //         Permissions.REQUISITION_EDIT,
        //         Permissions.REQUISITION_DELETE,
        //         Permissions.REQUISITION_REVIEW,
        //         Permissions.REQUISITION_APPROVE
        //       ]
        //     },
        //     {
        //       title: 'Call Quotation',
        //       page: '/' + CALL_QUOTATION.LIST,
        //       permission: [
        //         Permissions.CALL_QUOTATION_VIEW,
        //         Permissions.CALL_QUOTATION_CREATE,
        //         Permissions.CALL_QUOTATION_EDIT,
        //         Permissions.CALL_QUOTATION_DELETE,
        //       ]
        //     },
        //     {
        //       title: 'Quotation',
        //       page: '/' + QUOTATION.LIST,
        //       permission: [
        //         Permissions.QUOTATION_VIEW,
        //         Permissions.QUOTATION_CREATE,
        //         Permissions.QUOTATION_EDIT,
        //         Permissions.QUOTATION_DELETE,
        //         Permissions.QUOTATION_REVIEW,
        //         Permissions.QUOTATION_APPROVE,
        //       ]
        //     },
        //     {
        //       title: 'Quotation Comparative',
        //       page: '/' + QUOTATION_COMPARATIVE.LIST,
        //       permission: [
        //         Permissions.QUOTATION_COMPARATIVE_VIEW,
        //         Permissions.QUOTATION_COMPARATIVE_CREATE,
        //         Permissions.QUOTATION_COMPARATIVE_EDIT,
        //         Permissions.QUOTATION_COMPARATIVE_DELETE
        //       ]
        //     },
        //     {
        //       title: 'Issuance',
        //       page: '/' + ISSUANCE.LIST,
        //       permission: [
        //         Permissions.ISSUANCE_VIEW,
        //         Permissions.ISSUANCE_CREATE,
        //         Permissions.ISSUANCE_EDIT,
        //         Permissions.ISSUANCE_DELETE
        //       ],
        //     },
        //     {
        //       title: 'Issuance Return',
        //       page: '/' + ISSUANCE_RETURN.LIST,
        //       permission: [
        //         Permissions.ISSUANCE_RETURN_VIEW,
        //         Permissions.ISSUANCE_RETURN_CREATE,
        //         Permissions.ISSUANCE_RETURN_EDIT,
        //         Permissions.ISSUANCE_RETURN_DELETE,
        //       ],
        //     },
        //     {
        //       title: 'Purchase Order',
        //       page: '/' + PURCHASE_ORDER.LIST,
        //       permission: [
        //         Permissions.PURCHASEORDER_VIEW,
        //         Permissions.PURCHASEORDER_CREATE,
        //         Permissions.PURCHASEORDER_EDIT,
        //         Permissions.PURCHASEORDER_DELETE,
        //         Permissions.PURCHASEORDER_REVIEW,
        //         Permissions.PURCHASEORDER_APPROVE
        //       ]
        //     },
        //     {
        //       title: 'Goods Received Note',
        //       page: '/' + GOODS_RECEIVED_NOTE.LIST,
        //       permission: [
        //         Permissions.GRN_VIEW,
        //         Permissions.GRN_CREATE,
        //         Permissions.GRN_EDIT,
        //         Permissions.GRN_DELETE
        //       ]
        //     },
        //     {
        //       title: 'Goods Return Note',
        //       page: '/' + GOODS_RETURN_NOTE.LIST,
        //       permission: [
        //         Permissions.GOODS_RETURN_NOTE_VIEW,
        //         Permissions.GOODS_RETURN_NOTE_CREATE,
        //         Permissions.GOODS_RETURN_NOTE_EDIT,
        //         Permissions.GOODS_RETURN_NOTE_DELETE
        //       ]
        //     },
        //     {
        //       title: 'Bid Evaluation',
        //       page: '/' + BID_EVALUATION.LIST,
        //       permission: [
        //         Permissions.BIDEVALUATION_VIEW,
        //         Permissions.BIDEVALUATION_CREATE,
        //         Permissions.BIDEVALUATION_EDIT,
        //         Permissions.BIDEVALUATION_DELETE
        //       ]
        //     },
        //     {
        //       title: 'Inventory',
        //       page: '/' + STOCK.LIST,
        //       permission: [
        //         Permissions.STOCK_VIEW
        //       ]
        //     },
        //   ]
        // },
        //Budget Portion
        // {
        //   title: 'Budget',
        //   bullet: 'dot',
        //   icon: 'flaticon2-analytics',
        //   permission: [
        //     Permissions.BUDGET_VIEW,
        //     Permissions.BUDGET_CREATE,
        //     Permissions.BUDGET_EDIT,
        //     Permissions.BUDGET_DELETE,
        //     Permissions.BUDGET_REPORT_VIEW,
        //     Permissions.ESTIMATED_BUDGET_VIEW,
        //     Permissions.ESTIMATED_BUDGET_CREATE,
        //     Permissions.ESTIMATED_BUDGET_EDIT,
        //     Permissions.ESTIMATED_BUDGET_DELETE,
        //     Permissions.ESTIMATED_BUDGET_VIEW,
        //     Permissions.ESTIMATED_BUDGET_CREATE,
        //     Permissions.ESTIMATED_BUDGET_EDIT,
        //     Permissions.ESTIMATED_BUDGET_DELETE,
        //     Permissions.BUDGET_REPORT_VIEW,
        //   ],
        //   submenu: [
        //     {
        //       title: 'Budget',
        //       page: '/' + BUDGET.LIST,
        //       permission: [
        //         Permissions.BUDGET_VIEW,
        //         Permissions.BUDGET_CREATE,
        //         Permissions.BUDGET_EDIT,
        //         Permissions.BUDGET_DELETE
        //       ]
        //     },
        //     {
        //       title: 'Anticipated Budget',
        //       page: '/' + ESTIMATED_BUDGET.LIST,
        //       permission: [
        //         Permissions.ESTIMATED_BUDGET_VIEW,
        //         Permissions.ESTIMATED_BUDGET_CREATE,
        //         Permissions.ESTIMATED_BUDGET_EDIT,
        //         Permissions.ESTIMATED_BUDGET_DELETE
        //       ]
        //     },
        //     {
        //       title: 'Budget Report',
        //       page: '/' + BUDGET.REPORT,
        //       permission: [
        //         Permissions.BUDGET_REPORT_VIEW,
        //       ]
        //     },
        //     {
        //       title: 'Budget Reappropriation',
        //       page: '/' + BUDGET_REAPPROPRIATION.LIST,
        //       permission: [
        //         Permissions.ESTIMATED_BUDGET_VIEW,
        //         Permissions.ESTIMATED_BUDGET_CREATE,
        //         Permissions.ESTIMATED_BUDGET_EDIT,
        //         Permissions.ESTIMATED_BUDGET_DELETE
        //       ]
        //     },
        //   ]
        // },
        //Payroll Portion
        // {
        //   title: 'Payroll',
        //   bullet: 'dot',
        //   icon: 'flaticon2-percentage',
        //   permission: [
        //     Permissions.PAYROLL_ITEM_VIEW,
        //     Permissions.PAYROLL_ITEM_CREATE,
        //     Permissions.PAYROLL_ITEM_EDIT,
        //     Permissions.PAYROLL_ITEM_DELETE,
        //     Permissions.PAYROLL_TRANSACTION_VIEW,
        //     Permissions.PAYROLL_TRANSACTION_CREATE,
        //     Permissions.PAYROLL_TRANSACTION_EDIT,
        //     Permissions.PAYROLL_TRANSACTION_DELETE,
        //     Permissions.PAYROLL_TRANSACTION_APPROVE,
        //     Permissions.PAYROLL_TRANSACTION_REVIEW,
        //     Permissions.PAYROLL_PAYMENT_VIEW,
        //     Permissions.PAYROLL_PAYMENT_CREATE,
        //     Permissions.PAYROLL_PAYMENT_EDIT,
        //     Permissions.PAYROLL_PAYMENT_DELETE,
        //     Permissions.DESIGNATIONS_VIEW,
        //     Permissions.DESIGNATIONS_CREATE,
        //     Permissions.DESIGNATIONS_EDIT,
        //     Permissions.DESIGNATIONS_DELETE,
        //     Permissions.DEPARTMENTS_VIEW,
        //     Permissions.DEPARTMENTS_CREATE,
        //     Permissions.DEPARTMENTS_EDIT,
        //     Permissions.DEPARTMENTS_DELETE,
        //     Permissions.EMPLOYEE_VIEW,
        //     Permissions.EMPLOYEE_CREATE,
        //     Permissions.EMPLOYEE_EDIT,
        //     Permissions.EMPLOYEE_DELETE
        //   ],
        //   submenu: [
        //     {
        //       title: 'Designation',
        //       page: '/' + DESIGNATION.LIST,
        //       permission: [
        //         Permissions.DESIGNATIONS_VIEW,
        //         Permissions.DESIGNATIONS_CREATE,
        //         Permissions.DESIGNATIONS_EDIT,
        //         Permissions.DESIGNATIONS_DELETE,
        //       ]
        //     },
        //     {
        //       title: 'Department',
        //       page: '/' + DEPARTMENT.LIST,
        //       permission: [
        //         Permissions.DEPARTMENTS_VIEW,
        //         Permissions.DEPARTMENTS_CREATE,
        //         Permissions.DEPARTMENTS_EDIT,
        //         Permissions.DEPARTMENTS_DELETE,
        //       ]
        //     },
        //     {
        //       title: 'Employee',
        //       page: '/' + EMPLOYEE.LIST,
        //       permission: [
        //         Permissions.EMPLOYEE_VIEW,
        //         Permissions.EMPLOYEE_CREATE,
        //         Permissions.EMPLOYEE_EDIT,
        //         Permissions.EMPLOYEE_DELETE
        //       ]
        //     },
        //     {
        //       title: 'Payroll Item',
        //       page: '/' + PAYROLL_ITEM.LIST,
        //       permission: [
        //         Permissions.PAYROLL_ITEM_VIEW,
        //         Permissions.PAYROLL_ITEM_CREATE,
        //         Permissions.PAYROLL_ITEM_EDIT,
        //         Permissions.PAYROLL_ITEM_DELETE
        //       ]
        //     },
        //     {
        //       title: 'Payroll Transaction',
        //       page: '/' + PAYROLL_TRANSACTION.LIST,
        //       permission: [
        //         Permissions.PAYROLL_TRANSACTION_VIEW,
        //         Permissions.PAYROLL_TRANSACTION_CREATE,
        //         Permissions.PAYROLL_TRANSACTION_EDIT,
        //         Permissions.PAYROLL_TRANSACTION_DELETE,
        //         Permissions.PAYROLL_TRANSACTION_APPROVE,
        //         Permissions.PAYROLL_TRANSACTION_REVIEW,
        //       ],
        //     },
        //     {
        //       title: 'Payroll Payment',
        //       page: '/' + PAYROLL_PAYMENT.LIST,
        //       permission: [
        //         Permissions.PAYROLL_PAYMENT_VIEW,
        //         Permissions.PAYROLL_PAYMENT_CREATE,
        //         Permissions.PAYROLL_PAYMENT_EDIT,
        //         Permissions.PAYROLL_PAYMENT_DELETE,
        //       ]
        //     },
        //     {
        //       title: 'Payroll Process',
        //       bullet: 'dot',
        //       permission: [
        //         Permissions.PAYROLL_TRANSACTION_CREATE,
        //         Permissions.PAYROLL_TRANSACTION_APPROVE,
        //         Permissions.PAYROLL_TRANSACTION_REVIEW,
        //       ],
        //       submenu: [
        //         {
        //           title: 'Create Process',
        //           page: '/' + PAYROLL_PROCESS.CREATE_PROCESS,
        //           permission: [
        //             Permissions.PAYROLL_TRANSACTION_CREATE,
        //           ],
        //         },
        //         {
        //           title: 'Approve Process',
        //           page: '/' + PAYROLL_PROCESS.APPROVE_PROCESS,
        //           permission: [
        //             Permissions.PAYROLL_TRANSACTION_CREATE,
        //             Permissions.PAYROLL_TRANSACTION_APPROVE,
        //             Permissions.PAYROLL_TRANSACTION_REVIEW,
        //           ],
        //         },
        //         {
        //           title: 'Register Payment',
        //           bullet: 'dot',
        //           submenu: [
        //             {
        //               title: 'Create Process',
        //               page: '/' + PAYROLL_PROCESS.CREATE_PAYMENT,
        //               permission: [
        //                 Permissions.PAYROLL_TRANSACTION_CREATE,
        //               ],
        //             },
        //             {
        //               title: 'Approve Process',
        //               page: '/' + PAYROLL_PROCESS.APPROVE_PAYMENT,
        //               permission: [
        //                 Permissions.PAYROLL_TRANSACTION_CREATE,
        //                 Permissions.PAYROLL_TRANSACTION_APPROVE,
        //                 Permissions.PAYROLL_TRANSACTION_REVIEW,
        //               ],
        //             },
        //           ]
        //         },
        //       ]
        //     },
        //     {
        //       title: 'Payroll Reports',
        //       bullet: 'dot',
        //       permission: [
        //         Permissions.PAYROLL_TRANSACTION_VIEW,
        //         Permissions.PAYROLL_TRANSACTION_CREATE,
        //         Permissions.PAYROLL_TRANSACTION_EDIT,
        //         Permissions.PAYROLL_TRANSACTION_DELETE,
        //         Permissions.PAYROLL_TRANSACTION_APPROVE,
        //         Permissions.PAYROLL_TRANSACTION_REVIEW,
        //       ],
        //       submenu: [
        //         {
        //           title: 'Payroll Transaction Report',
        //           page: '/' + PAYROLL_REPORTS.TRANSACTION.LIST,
        //           permission: [
        //             Permissions.PAYROLL_TRANSACTION_VIEW,
        //             Permissions.PAYROLL_TRANSACTION_CREATE,
        //             Permissions.PAYROLL_TRANSACTION_EDIT,
        //             Permissions.PAYROLL_TRANSACTION_DELETE,
        //             Permissions.PAYROLL_TRANSACTION_APPROVE,
        //             Permissions.PAYROLL_TRANSACTION_REVIEW,
        //           ],
        //         },
        //         {
        //           title: 'Transaction Detail Report',
        //           page: '/' + PAYROLL_REPORTS.TRANS_DETAIL.LIST
        //         },
        //         {
        //           title: 'Payroll Executive Summary',
        //           page: '/' + PAYROLL_REPORTS.EXECUTIVE.LIST,
        //           // permission: [
        //           //   Permissions.PAYROLL_TRANSACTION_VIEW,
        //           //   Permissions.PAYROLL_TRANSACTION_CREATE,
        //           //   Permissions.PAYROLL_TRANSACTION_EDIT,
        //           //   Permissions.PAYROLL_TRANSACTION_DELETE,
        //           //   Permissions.PAYROLL_TRANSACTION_APPROVE,
        //           //   Permissions.PAYROLL_TRANSACTION_REVIEW,
        //           // ],
        //         },
        //         {
        //           title: 'Bank Advice Report',
        //           page: '/' + PAYROLL_REPORTS.BANK_ADVICE.LIST,
        //           // permission: [
        //           //   Permissions.PAYROLL_TRANSACTION_VIEW,
        //           //   Permissions.PAYROLL_TRANSACTION_CREATE,
        //           //   Permissions.PAYROLL_TRANSACTION_EDIT,
        //           //   Permissions.PAYROLL_TRANSACTION_DELETE,
        //           //   Permissions.PAYROLL_TRANSACTION_APPROVE,
        //           //   Permissions.PAYROLL_TRANSACTION_REVIEW,
        //           // ],
        //         },
        //       ]
        //     },
        //   ]
        // },
        //region Report
        // {
        //   title: 'Report',
        //   bullet: 'dot',
        //   icon: 'flaticon2-graphic',
        //   permission: [
        //     Permissions.GENERALLEDGER_VIEW,
        //     Permissions.TRIALBALANCE_VIEW,
        //     Permissions.BALANCESHEET_VIEW,
        //   ],
        //   submenu: [
        //     {
        //       title: 'General Ledger', // <= Title of the page
        //       page: '/' + APP_ROUTES.REPORT + '/' + REPORT.GENERAL_LEDGER, // <= URL
        //       permission: [
        //         Permissions.GENERALLEDGER_VIEW,
        //       ]
        //     },
        //     {
        //       title: 'Trial Balance',
        //       page: '/' + APP_ROUTES.REPORT + '/' + REPORT.TRIAL_BALANCE,
        //       permission: [
        //         Permissions.TRIALBALANCE_VIEW,
        //       ]
        //     },
        //     {
        //       title: 'Income & Expenditure',
        //       page: '/' + APP_ROUTES.REPORT + '/' + REPORT.PROFIT_N_LOSS,
        //       permission: [
        //         Permissions.PROFITLOSS_VIEW,
        //       ]
        //     },
        //     {
        //       title: 'Balance Sheet',
        //       page: '/' + APP_ROUTES.REPORT + '/' + REPORT.BALANCE_SHEET,
        //       permission: [
        //         Permissions.BALANCESHEET_VIEW,
        //       ]
        //     },
        //   ]
        // },
        // Workflow
        // {
        //   title: 'Workflow',
        //   bullet: 'dot',
        //   icon: 'flaticon-map',
        //   permission: [
        //     Permissions.WORKFLOW_CREATE,
        //     Permissions.WORKFLOW_VIEW,
        //     Permissions.WORKFLOW_EDIT,
        //     Permissions.WORKFLOW_DELETE,
        //     Permissions.STATUS_CREATE,
        //     Permissions.STATUS_EDIT,
        //     Permissions.STATUS_VIEW,
        //     Permissions.STATUS_DELETE,
        //   ],
        //   submenu: [
        //     {
        //       title: 'Workflows',
        //       page: '/' + WORKFLOW.LIST,
        //       permission: [
        //         Permissions.WORKFLOW_CREATE,
        //         Permissions.WORKFLOW_VIEW,
        //         Permissions.WORKFLOW_EDIT,
        //         Permissions.WORKFLOW_DELETE,
        //       ]
        //     },
        //     {
        //       title: 'Status',
        //       page: '/' + STATUS.LIST,
        //       permission: [
        //         Permissions.STATUS_CREATE,
        //         Permissions.STATUS_EDIT,
        //         Permissions.STATUS_VIEW,
        //         Permissions.STATUS_DELETE,
        //       ]
        //     }
        //   ]
        // },
        {
          title: 'Customers',
          bullet: 'dot',
          icon: 'flaticon-customer',

          submenu: [
            {
              title: 'Customers',
              page: '/' + BUSINESS_PARTNER.LIST,
              permission: [
                Permissions.BUSINESSPARTNER_VIEW,
                Permissions.BUSINESSPARTNER_CREATE,
                Permissions.BUSINESSPARTNER_EDIT,
                Permissions.BUSINESSPARTNER_DELETE
              ]
            },
            {
              title: 'Invoices',
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
              // page: '/' + BUSINESS_PARTNER.LIST,
              // permission: [
              //   Permissions.BUSINESSPARTNER_VIEW,
              //   Permissions.BUSINESSPARTNER_CREATE,
              //   Permissions.BUSINESSPARTNER_EDIT,
              //   Permissions.BUSINESSPARTNER_DELETE
              // ]
            },
            {
              title: 'Payments',
              // page: '/' + BUSINESS_PARTNER.LIST,
              // permission: [
              //   Permissions.BUSINESSPARTNER_VIEW,
              //   Permissions.BUSINESSPARTNER_CREATE,
              //   Permissions.BUSINESSPARTNER_EDIT,
              //   Permissions.BUSINESSPARTNER_DELETE
              // ]
            },
            {
              title: 'Products',
              // page: '/' + BUSINESS_PARTNER.LIST,
              // permission: [
              //   Permissions.BUSINESSPARTNER_VIEW,
              //   Permissions.BUSINESSPARTNER_CREATE,
              //   Permissions.BUSINESSPARTNER_EDIT,
              //   Permissions.BUSINESSPARTNER_DELETE
              // ]
            },


          ]
        },
        {
          title: 'Vendor',
          bullet: 'dot',
          icon: 'flaticon-user-ok',

          submenu: [
            {
              title: 'Vendors',
              page: '/' + BUSINESS_PARTNER.LIST,
              permission: [
                Permissions.BUSINESSPARTNER_VIEW,
                Permissions.BUSINESSPARTNER_CREATE,
                Permissions.BUSINESSPARTNER_EDIT,
                Permissions.BUSINESSPARTNER_DELETE
              ]
            },
            {
              title: 'Biils',
              // page: '/' + BUSINESS_PARTNER.LIST,
              // permission: [
              //   Permissions.BUSINESSPARTNER_VIEW,
              //   Permissions.BUSINESSPARTNER_CREATE,
              //   Permissions.BUSINESSPARTNER_EDIT,
              //   Permissions.BUSINESSPARTNER_DELETE
              // ]
            },
            {
              title: 'Refunds',
              // page: '/' + BUSINESS_PARTNER.LIST,
              // permission: [
              //   Permissions.BUSINESSPARTNER_VIEW,
              //   Permissions.BUSINESSPARTNER_CREATE,
              //   Permissions.BUSINESSPARTNER_EDIT,
              //   Permissions.BUSINESSPARTNER_DELETE
              // ]
            },
            {
              title: 'Payment',
              // page: '/' + BUSINESS_PARTNER.LIST,
              // permission: [
              //   Permissions.BUSINESSPARTNER_VIEW,
              //   Permissions.BUSINESSPARTNER_CREATE,
              //   Permissions.BUSINESSPARTNER_EDIT,
              //   Permissions.BUSINESSPARTNER_DELETE
              // ]
            },
            {
              title: 'Product',
              // page: '/' + BUSINESS_PARTNER.LIST,
              // permission: [
              //   Permissions.BUSINESSPARTNER_VIEW,
              //   Permissions.BUSINESSPARTNER_CREATE,
              //   Permissions.BUSINESSPARTNER_EDIT,
              //   Permissions.BUSINESSPARTNER_DELETE
              // ]
            },

          ]
        },
        {
          title: 'Accouting',
          bullet: 'dot',
          icon: 'flaticon-analytics',

          submenu: [
            {
              title: 'journal',
              page: '/' + JOURNAL.LIST,
              permission: [
                Permissions.JOURNAL_CREATE,
                Permissions.JOURNAL_VIEW,
                Permissions.JOURNAL_EDIT,
                Permissions.JOURNAL_DELETE,
              ]
            },
            

          ]
        },
        {
          title: 'Reporting',
          bullet: 'dot',
          icon: 'flaticon2-document',

          submenu: [
            {
              title: 'Reports',
              page: '/' + JOURNAL.LIST,
              permission: [
                Permissions.JOURNAL_CREATE,
                Permissions.JOURNAL_VIEW,
                Permissions.JOURNAL_EDIT,
                Permissions.JOURNAL_DELETE,
              ]
            },

          ]
        },
        {
          title: 'Configuration',
          bullet: 'dot',
          icon: 'flaticon-settings',

          submenu: [
            {
              title: 'Setting',
               page: '/' + TAXSETTING.CREATE,
              // permission: [
              //   Permissions.LEVEL3_VIEW,
              //   Permissions.LEVEL3_CREATE,
              //   Permissions.LEVEL3_EDIT,
              //   Permissions.LEVEL3_DELETE,
              //   Permissions.LEVEL4_VIEW,
              //   Permissions.LEVEL4_CREATE,
              //   Permissions.LEVEL4_EDIT,
              //   Permissions.LEVEL4_DELETE,
              //   Permissions.CHARTOFACCOUNT_VIEW
              // ]
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
           
            {
              title: 'journal',
              page: '/' + JOURNAL.LIST,
              permission: [
                Permissions.JOURNAL_CREATE,
                Permissions.JOURNAL_VIEW,
                Permissions.JOURNAL_EDIT,
                Permissions.JOURNAL_DELETE,
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
              title: 'Currency',
              page: '/' + CURRENCY.LIST,
              permission: [
                Permissions.CURRENCY_VIEW,
                Permissions.CURRENCY_CREATE,
                Permissions.CURRENCY_EDIT,
                Permissions.CURRENCY_DELETE,
              ]
            },

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
