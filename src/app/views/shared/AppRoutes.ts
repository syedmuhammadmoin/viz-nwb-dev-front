export const APP_ROUTES = {

  //AUTH
  AUTH: 'auth',

  //DASHBOARD
  BUILDER: 'builder',
  DASHBOARD: 'dashboard',

  //ACCESS MANAGEMENT
  ACCESS_MANAGEMENT: 'access-management',

  //FINANCE
  BANK_ACCOUNT: 'bank-account',
  BANK_RECONCILIATION: 'bank-reconciliation',
  BANK_STATEMENT: 'bank-statement',
  CASH_ACCOUNT: 'cash-account',
  CHART_OF_ACCOUNT: 'chart-of-account',
  JOURNAL_ENTRY: 'journal-entry',
  PAYMENT: 'payment',

  //INVENTORY
  GOODS_RECEIVED_NOTE: 'goods-received-note',
  GOODS_RETURN_NOTE: 'goods-return-note',
  STOCK: 'stock',
  ISSUANCE: 'issuance',
  ISSUANCE_RETURN: 'issuance-return',

  //PROCUREMENT
  REQUISITION: 'requisition',
  REQUEST_REQUISITION: 'request-requisition',
  BID_EVALUATION: 'bid-evaluation',
  QUOTATION: 'quotation',
  QUOTATION_COMPARATIVE: 'quotation-comparative',
  CALL_QUOTATION: 'call-quotation',

  //PROFILING
  CAMPUS: 'campus',
  BUSINESS_PARTNER: 'business-partner',
  CATEGORY: 'category',
  ORGANIZATION: 'organization',
  PRODUCT: 'product',
  WAREHOUSE: 'warehouse',
  TAX: 'tax',
  UNIT_OF_MEASUREMENT: 'unit-of-measurement',

  //BUDGET
  BUDGET: 'budget',
  ESTIMATED_BUDGET: 'estimated-budget',
  BUDGET_REAPPROPRIATION: 'budget-reappropriation',

  //PURCHASE
  DEBIT_NOTE: 'debit-note',
  BILL: 'vendor-bill',
  PURCHASE_ORDER: 'purchase-order',

  //PAYROLL
  PAYROLL_ITEM: 'payroll-item',
  PAYROLL_TRANSACTION: 'payroll-transaction',
  PAYROLL_PROCESS: 'payroll-process',
  EMPLOYEE: 'employee',
  DEPARTMENT: 'department',
  DESIGNATION: 'designation',
  PAYROLL_REPORTS: 'payroll-reports',

  //REPORT
  REPORT: 'report',

  //SALES
  CREDIT_NOTE: 'credit-note',
  INVOICE: 'invoice',

  //WORKFLOW
  WORKFLOW: 'workflow',

  //STATUS
  STATUS: 'status',

  //ADMISSION
  FACULTY: 'faculty',
  DEGREE: 'degree',
  ADMISSION_CRITERIA: 'admission-criteria',
  ACADEMIC_DEPARTMENT: 'academic-department',
  FEE_TYPE: 'fee-type',
  SHIFT: 'shift',
  BATCH: 'batch',
  BATCH_TYPE: 'batch-type',
  COURSE: 'course',
  PROGRAM: 'program',
  QUALIFICATION: 'qualification',
  SUBJECT: 'subject',
  SEMESTER: 'semester',
  COUNTRY: 'country',
  STATE: 'state',
  CITY: 'city',
  DISTRICT: 'district',
  DOMICILE: 'domicile',
  FEE_ITEM: 'fee-item',

  //FIXED ASSET
  FIXED_ASSET: 'fixed-asset',
  DEPRECIATION_MODEL: 'depreciation-model',
  ASSET_CATEGORY: 'asset-category',
  ASSET: 'asset',
  CWIP: 'cwip',
  DISPOSAL: 'disposal',
  DEPRECIATION_ADJUSTMENT: 'depreciation-adjustment',
  ASSET_REPORT: 'assets-report'
}

export const CRUD_ROUTES = {
  CREATE: 'create',
  LIST: 'list',
  EDIT: 'edit/:id',
  DETAILS: 'details/:id',
  PRINT: 'print/:id',
  AGING_REPORT: 'aging-report',
  APPROVE_PROCESS: 'approve-process',
  CREATE_PROCESS: 'create-process',
  APPROVE_PAYMENT: 'approve-payment',
  CREATE_PAYMENT: 'create-payment',
  REGISTER_PAYMENT: 'register-payment'
}

//AUTH SECTION
export const AUTH = {
  LOGIN: 'login',
  REGISTER: 'register',
  FORGOT_PASSWORD: 'forgot-password',
}

//REPORT SECTION
export const REPORT = {
  GENERAL_LEDGER: 'ledger',
  TRIAL_BALANCE: 'trial-balance',
  BALANCE_SHEET: 'balance-sheet',
  PROFIT_N_LOSS: 'income-n-expenditure',
  BUDGET_REPORT: 'report',
  PRINT: 'print'
}

//PAYROLL REPORTS SECTION
export const PAYROLL_REPORT = {
  TRANSACTION: 'transaction',
  ALLOWANCE: 'allowance',
  EXECUTIVE: 'executive',
  BANK_ADVICE: 'bank-advice',
  TRANS_DETAIL: 'transaction-detail'
}

//ACCESS_MANAGEMENT SECTION
export const ACCESS_MANAGEMENT = {
  USER_LIST: 'users',
  CREATE_USER: 'users/create',
  ROLE_LIST: 'roles',
  CREATE_ROLE: 'roles/create',
  CHANGE_PASSWORD: 'users/change-password',
  ROLE_PERMISSIONS: 'roles/permissions/print'
}

//FINANCE SECTION
export const BANK_ACCOUNT = {
  LIST: APP_ROUTES.BANK_ACCOUNT + '/' + CRUD_ROUTES.LIST
}

export const BANK_RECONCILIATION = {
  LIST: APP_ROUTES.BANK_RECONCILIATION + '/' + CRUD_ROUTES.LIST
}

export const BANK_STATEMENT = {
  LIST: APP_ROUTES.BANK_STATEMENT + '/' + CRUD_ROUTES.LIST,
  CREATE: APP_ROUTES.BANK_STATEMENT + '/' + CRUD_ROUTES.CREATE,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.BANK_STATEMENT + '/' + route + '/' + id
  }
}

// ADMISSION SECTION
export const FACULTY = {
  LIST: APP_ROUTES.FACULTY + '/' + CRUD_ROUTES.LIST,
  CREATE: APP_ROUTES.FACULTY + '/' + CRUD_ROUTES.CREATE,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.FACULTY + '/' + route + '/' + id
  }
}

export const DEGREE = {
  LIST: APP_ROUTES.DEGREE + '/' + CRUD_ROUTES.LIST,
  CREATE: APP_ROUTES.DEGREE + '/' + CRUD_ROUTES.CREATE,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.DEGREE + '/' + route + '/' + id
  }
}

export const QUALIFICATION = {
  LIST: APP_ROUTES.QUALIFICATION + '/' + CRUD_ROUTES.LIST,
  CREATE: APP_ROUTES.QUALIFICATION + '/' + CRUD_ROUTES.CREATE,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.QUALIFICATION + '/' + route + '/' + id
  }
}

export const SUBJECT = {
  LIST: APP_ROUTES.SUBJECT + '/' + CRUD_ROUTES.LIST,
  CREATE: APP_ROUTES.SUBJECT + '/' + CRUD_ROUTES.CREATE,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.SUBJECT + '/' + route + '/' + id
  }
}

export const ADMISSION_CRITERIA = {
  LIST: APP_ROUTES.ADMISSION_CRITERIA + '/' + CRUD_ROUTES.LIST,
  CREATE: APP_ROUTES.ADMISSION_CRITERIA + '/' + CRUD_ROUTES.CREATE,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.ADMISSION_CRITERIA + '/' + route + '/' + id
  }
}

export const ACADEMIC_DEPARTMENT = {
  LIST: APP_ROUTES.ACADEMIC_DEPARTMENT + '/' + CRUD_ROUTES.LIST,
  CREATE: APP_ROUTES.ACADEMIC_DEPARTMENT + '/' + CRUD_ROUTES.CREATE,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.ACADEMIC_DEPARTMENT + '/' + route + '/' + id
  }
}

export const PROGRAM = {
  LIST: APP_ROUTES.PROGRAM + '/' + CRUD_ROUTES.LIST,
  CREATE: APP_ROUTES.PROGRAM + '/' + CRUD_ROUTES.CREATE,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.PROGRAM + '/' + route + '/' + id
  }
}

export const SHIFT = {
  LIST: APP_ROUTES.SHIFT + '/' + CRUD_ROUTES.LIST,
  CREATE: APP_ROUTES.SHIFT + '/' + CRUD_ROUTES.CREATE,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.SHIFT + '/' + route + '/' + id
  }
}

export const FEE_TYPE = {
  LIST: APP_ROUTES.FEE_TYPE + '/' + CRUD_ROUTES.LIST,
  CREATE: APP_ROUTES.FEE_TYPE + '/' + CRUD_ROUTES.CREATE,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.FEE_TYPE + '/' + route + '/' + id
  }
}

export const BATCH = {
  LIST: APP_ROUTES.BATCH + '/' + CRUD_ROUTES.LIST,
  CREATE: APP_ROUTES.BATCH + '/' + CRUD_ROUTES.CREATE,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.BATCH + '/' + route + '/' + id
  }
}

export const BATCH_TYPE = {
  LIST: APP_ROUTES.BATCH_TYPE + '/' + CRUD_ROUTES.LIST,
  CREATE: APP_ROUTES.BATCH_TYPE + '/' + CRUD_ROUTES.CREATE,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.BATCH_TYPE + '/' + route + '/' + id
  }
}

export const COURSE = {
  LIST: APP_ROUTES.COURSE + '/' + CRUD_ROUTES.LIST,
  CREATE: APP_ROUTES.COURSE + '/' + CRUD_ROUTES.CREATE,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.COURSE + '/' + route + '/' + id
  }
}

export const SEMESTER = {
  LIST: APP_ROUTES.SEMESTER + '/' + CRUD_ROUTES.LIST,
  CREATE: APP_ROUTES.SEMESTER + '/' + CRUD_ROUTES.CREATE,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.SEMESTER + '/' + route + '/' + id
  }
}

export const COUNTRY = {
  LIST: APP_ROUTES.COUNTRY + '/' + CRUD_ROUTES.LIST,
  CREATE: APP_ROUTES.COUNTRY + '/' + CRUD_ROUTES.CREATE,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.COUNTRY + '/' + route + '/' + id
  }
}

export const STATE = {
  LIST: APP_ROUTES.STATE + '/' + CRUD_ROUTES.LIST,
  CREATE: APP_ROUTES.STATE + '/' + CRUD_ROUTES.CREATE,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.STATE + '/' + route + '/' + id
  }
}

export const CITY = {
  LIST: APP_ROUTES.CITY + '/' + CRUD_ROUTES.LIST,
  CREATE: APP_ROUTES.CITY + '/' + CRUD_ROUTES.CREATE,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.CITY + '/' + route + '/' + id
  }
}

export const FEE_ITEM = {
  LIST: APP_ROUTES.FEE_ITEM + '/' + CRUD_ROUTES.LIST,
  CREATE: APP_ROUTES.FEE_ITEM + '/' + CRUD_ROUTES.CREATE,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.FEE_ITEM + '/' + route + '/' + id
  }
}

export const DISTRICT = {
  LIST: APP_ROUTES.DISTRICT + '/' + CRUD_ROUTES.LIST,
  CREATE: APP_ROUTES.DISTRICT + '/' + CRUD_ROUTES.CREATE,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.DISTRICT + '/' + route + '/' + id
  }
}

export const DOMICILE = {
  LIST: APP_ROUTES.DOMICILE + '/' + CRUD_ROUTES.LIST,
  CREATE: APP_ROUTES.DOMICILE + '/' + CRUD_ROUTES.CREATE,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.DOMICILE + '/' + route + '/' + id
  }
}

// BUDGET SECTION
export const BUDGET = {
  LIST: APP_ROUTES.BUDGET + '/' + CRUD_ROUTES.LIST,
  CREATE: APP_ROUTES.BUDGET + '/' + CRUD_ROUTES.CREATE,
  REPORT: APP_ROUTES.BUDGET + '/' + REPORT.BUDGET_REPORT,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.BUDGET + '/' + route + '/' + id
  }
}

export const ESTIMATED_BUDGET = {
  LIST: APP_ROUTES.ESTIMATED_BUDGET + '/' + CRUD_ROUTES.LIST,
  CREATE: APP_ROUTES.ESTIMATED_BUDGET + '/' + CRUD_ROUTES.CREATE,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.ESTIMATED_BUDGET + '/' + route + '/' + id
  }
}

export const BUDGET_REAPPROPRIATION = {
  LIST: APP_ROUTES.BUDGET_REAPPROPRIATION + '/' + CRUD_ROUTES.LIST,
  CREATE: APP_ROUTES.BUDGET_REAPPROPRIATION + '/' + CRUD_ROUTES.CREATE,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.BUDGET_REAPPROPRIATION + '/' + route + '/' + id
  }
}

export const CASH_ACCOUNT = {
  LIST: APP_ROUTES.CASH_ACCOUNT + '/' + CRUD_ROUTES.LIST
}

export const CHART_OF_ACCOUNT = {
  LIST: APP_ROUTES.CHART_OF_ACCOUNT + '/' + CRUD_ROUTES.LIST,
}

export const JOURNAL_ENTRY = {
  LIST: APP_ROUTES.JOURNAL_ENTRY + '/' + CRUD_ROUTES.LIST,
  CREATE: APP_ROUTES.JOURNAL_ENTRY + '/' + CRUD_ROUTES.CREATE,

  EDIT: APP_ROUTES.JOURNAL_ENTRY + '/edit/',          //
  DETAIL: APP_ROUTES.JOURNAL_ENTRY + '/detail/',      //  JOURNAL_ENTRY.EDIT + this.journalEntry.id
  PRINT: APP_ROUTES.JOURNAL_ENTRY + '/print/',        //

  //OR
  ID_BASED_ROUTE(route: string, id: number) {               //JOURNAL_ENTRY.ID_BASED_ROUTE('edit' , this.journalEntry.id)
    return APP_ROUTES.JOURNAL_ENTRY + '/' + route + '/' + id
  }
}

export const PAYMENT = {
  LIST: APP_ROUTES.PAYMENT + '/voucher/' + CRUD_ROUTES.LIST,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.PAYMENT + '/voucher/' + route + '/' + id
  }
}

export const RECEIPT = {
  LIST: APP_ROUTES.PAYMENT + '/receipt/' + CRUD_ROUTES.LIST,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.PAYMENT + '/receipt/' + route + '/' + id
  }
}

export const PAYROLL_PAYMENT = {
  LIST: APP_ROUTES.PAYMENT + '/payroll-payment/' + CRUD_ROUTES.LIST,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.PAYMENT + '/payroll-payment/' + route + '/' + id
  }
}


//INVENTORY SECTION
export const GOODS_RECEIVED_NOTE = {
  LIST: APP_ROUTES.GOODS_RECEIVED_NOTE + '/' + CRUD_ROUTES.LIST,
  CREATE: APP_ROUTES.GOODS_RECEIVED_NOTE + '/' + CRUD_ROUTES.CREATE,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.GOODS_RECEIVED_NOTE + '/' + route + '/' + id
  }
}

export const GOODS_RETURN_NOTE = {
  LIST: APP_ROUTES.GOODS_RETURN_NOTE + '/' + CRUD_ROUTES.LIST,
  CREATE: APP_ROUTES.GOODS_RETURN_NOTE + '/' + CRUD_ROUTES.CREATE,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.GOODS_RETURN_NOTE + '/' + route + '/' + id
  }
}

export const ISSUANCE = {
  LIST: APP_ROUTES.ISSUANCE + '/' + CRUD_ROUTES.LIST,
  CREATE: APP_ROUTES.ISSUANCE + '/' + CRUD_ROUTES.CREATE,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.ISSUANCE + '/' + route + '/' + id
  }
}

export const ISSUANCE_RETURN = {
  LIST: APP_ROUTES.ISSUANCE_RETURN + '/' + CRUD_ROUTES.LIST,
  CREATE: APP_ROUTES.ISSUANCE_RETURN + '/' + CRUD_ROUTES.CREATE,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.ISSUANCE_RETURN + '/' + route + '/' + id
  }
}

export const STOCK = {
  LIST: APP_ROUTES.STOCK + '/' + CRUD_ROUTES.LIST,
}


//PROCUREMENT SECTION
export const REQUISITION = {
  LIST: APP_ROUTES.REQUISITION + '/' + CRUD_ROUTES.LIST,
  CREATE: APP_ROUTES.REQUISITION + '/' + CRUD_ROUTES.CREATE,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.REQUISITION + '/' + route + '/' + id
  }
}

//PROCUREMENT SECTION
export const REQUEST_REQUISITION = {
  LIST: APP_ROUTES.REQUEST_REQUISITION + '/' + CRUD_ROUTES.LIST,
  CREATE: APP_ROUTES.REQUEST_REQUISITION + '/' + CRUD_ROUTES.CREATE,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.REQUEST_REQUISITION + '/' + route + '/' + id
  }
}

//PROCUREMENT SECTION
export const BID_EVALUATION = {
  LIST: APP_ROUTES.BID_EVALUATION + '/' + CRUD_ROUTES.LIST,
  CREATE: APP_ROUTES.BID_EVALUATION + '/' + CRUD_ROUTES.CREATE,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.BID_EVALUATION + '/' + route + '/' + id
  }
}

export const QUOTATION = {
  LIST: APP_ROUTES.QUOTATION + '/' + CRUD_ROUTES.LIST,
  CREATE: APP_ROUTES.QUOTATION + '/' + CRUD_ROUTES.CREATE,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.QUOTATION + '/' + route + '/' + id
  }
}

export const QUOTATION_COMPARATIVE = {
  LIST: APP_ROUTES.QUOTATION_COMPARATIVE + '/' + CRUD_ROUTES.LIST,
  CREATE: APP_ROUTES.QUOTATION_COMPARATIVE + '/' + CRUD_ROUTES.CREATE,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.QUOTATION_COMPARATIVE + '/' + route + '/' + id
  }
}

export const CALL_QUOTATION = {
  LIST: APP_ROUTES.CALL_QUOTATION + '/' + CRUD_ROUTES.LIST,
  CREATE: APP_ROUTES.CALL_QUOTATION + '/' + CRUD_ROUTES.CREATE,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.CALL_QUOTATION + '/' + route + '/' + id
  }
}


//PROFILING SECTION
export const CAMPUS = {
  LIST: APP_ROUTES.CAMPUS + '/' + CRUD_ROUTES.LIST,
}

export const BUSINESS_PARTNER = {
  LIST: APP_ROUTES.BUSINESS_PARTNER + '/' + CRUD_ROUTES.LIST,
}

export const CATEGORY = {
  LIST: APP_ROUTES.CATEGORY + '/' + CRUD_ROUTES.LIST,
}

export const ORGANIZATION = {
  LIST: APP_ROUTES.ORGANIZATION + '/' + CRUD_ROUTES.LIST
}

export const PRODUCT = {
  LIST: APP_ROUTES.PRODUCT + '/' + CRUD_ROUTES.LIST,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.PRODUCT + '/' + route + '/' + id
  }
}

export const WAREHOUSE = {
  LIST: APP_ROUTES.WAREHOUSE + '/' + CRUD_ROUTES.LIST
}

export const TAX = {
  LIST: APP_ROUTES.TAX + '/' + CRUD_ROUTES.LIST
}

export const UNIT_OF_MEASUREMENT = {
  LIST: APP_ROUTES.UNIT_OF_MEASUREMENT + '/' + CRUD_ROUTES.LIST
}

//FIXED ASSET SECTION
export const DEPRECIATION_MODEL = {
  LIST: APP_ROUTES.DEPRECIATION_MODEL + '/' + CRUD_ROUTES.LIST
}

export const DEPRECIATION_ADJUSTMENT = {
  LIST: APP_ROUTES.DEPRECIATION_ADJUSTMENT + '/' + CRUD_ROUTES.LIST,
  CREATE: APP_ROUTES.DEPRECIATION_ADJUSTMENT + '/' + CRUD_ROUTES.CREATE,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.DEPRECIATION_ADJUSTMENT + '/' + route + '/' + id
  }
}

export const ASSET = {
  LIST: APP_ROUTES.ASSET + '/' + CRUD_ROUTES.LIST,
  CREATE: APP_ROUTES.ASSET + '/' + CRUD_ROUTES.CREATE,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.ASSET + '/' + route + '/' + id
  }
}

export const CWIP = {
  LIST: APP_ROUTES.CWIP + '/' + CRUD_ROUTES.LIST,
  CREATE: APP_ROUTES.CWIP + '/' + CRUD_ROUTES.CREATE,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.CWIP + '/' + route + '/' + id
  }
}

export const DISPOSAL = {
  LIST: APP_ROUTES.DISPOSAL + '/' + CRUD_ROUTES.LIST,
  CREATE: APP_ROUTES.DISPOSAL + '/' + CRUD_ROUTES.CREATE,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.DISPOSAL + '/' + route + '/' + id
  }
}

export const ASSET_REPORT = {
  LIST: APP_ROUTES.ASSET_REPORT + '/' + CRUD_ROUTES.LIST,
  PRINT: APP_ROUTES.ASSET_REPORT + '/print',
  MONTHLY: APP_ROUTES.ASSET_REPORT + '/monthly',
  MONTHLY_PRINT: APP_ROUTES.ASSET_REPORT + '/monthly/print',
  REGISTER_ASSET: APP_ROUTES.ASSET_REPORT + '/register',
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.ASSET_REPORT + '/' + route + '/' + id
  }
}

//PAYROLL SECTION
export const PAYROLL_ITEM = {
  LIST: APP_ROUTES.PAYROLL_ITEM + '/' + CRUD_ROUTES.LIST,
  CREATE: APP_ROUTES.PAYROLL_ITEM + '/' + CRUD_ROUTES.CREATE,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.PAYROLL_ITEM + '/' + route + '/' + id
  }
}

export const PAYROLL_TRANSACTION = {
  LIST: APP_ROUTES.PAYROLL_TRANSACTION + '/' + CRUD_ROUTES.LIST,
  CREATE: APP_ROUTES.PAYROLL_TRANSACTION + '/' + CRUD_ROUTES.CREATE,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.PAYROLL_TRANSACTION + '/' + route + '/' + id
  }
}

export const PAYROLL_PROCESS = {
  APPROVE_PROCESS: APP_ROUTES.PAYROLL_PROCESS + '/' + CRUD_ROUTES.APPROVE_PROCESS,
  CREATE_PROCESS: APP_ROUTES.PAYROLL_PROCESS + '/' + CRUD_ROUTES.CREATE_PROCESS,
  APPROVE_PAYMENT: APP_ROUTES.PAYROLL_PROCESS + '/' + CRUD_ROUTES.REGISTER_PAYMENT + '/' + CRUD_ROUTES.APPROVE_PAYMENT,
  CREATE_PAYMENT: APP_ROUTES.PAYROLL_PROCESS + '/' + CRUD_ROUTES.REGISTER_PAYMENT + '/' + CRUD_ROUTES.CREATE_PAYMENT
}

export const PAYROLL_REPORTS = {
  TRANSACTION: {
    LIST: APP_ROUTES.PAYROLL_REPORTS + '/' + PAYROLL_REPORT.TRANSACTION + '/' + CRUD_ROUTES.LIST
  },
  TRANS_DETAIL: {
    LIST: APP_ROUTES.PAYROLL_REPORTS + '/' + PAYROLL_REPORT.TRANS_DETAIL + '/' + CRUD_ROUTES.LIST
  },
  ALLOWANCE: {
    LIST: APP_ROUTES.PAYROLL_REPORTS + '/' + PAYROLL_REPORT.ALLOWANCE + '/' + CRUD_ROUTES.LIST
  },
  EXECUTIVE: {
    LIST: APP_ROUTES.PAYROLL_REPORTS + '/' + PAYROLL_REPORT.EXECUTIVE + '/' + CRUD_ROUTES.LIST
  },
  BANK_ADVICE: {
    LIST: APP_ROUTES.PAYROLL_REPORTS + '/' + PAYROLL_REPORT.BANK_ADVICE + '/' + CRUD_ROUTES.LIST
  }
  // CREATE: APP_ROUTES.PAYROLL_TRANSACTION + '/' + CRUD_ROUTES.CREATE,
  // ID_BASED_ROUTE (route: string , id: number) {
  //   return APP_ROUTES.PAYROLL_TRANSACTION + '/' + route + '/' + id
  // }
}

export const EMPLOYEE = {
  LIST: APP_ROUTES.EMPLOYEE + '/' + CRUD_ROUTES.LIST,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.EMPLOYEE + '/' + route + '/' + id
  }
}

export const DEPARTMENT = {
  LIST: APP_ROUTES.DEPARTMENT + '/' + CRUD_ROUTES.LIST,
}

export const DESIGNATION = {
  LIST: APP_ROUTES.DESIGNATION + '/' + CRUD_ROUTES.LIST,
}

//PURCHASE SECTION
export const DEBIT_NOTE = {
  LIST: APP_ROUTES.DEBIT_NOTE + '/' + CRUD_ROUTES.LIST,
  CREATE: APP_ROUTES.DEBIT_NOTE + '/' + CRUD_ROUTES.CREATE,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.DEBIT_NOTE + '/' + route + '/' + id
  }
}

export const PURCHASE_ORDER = {
  LIST: APP_ROUTES.PURCHASE_ORDER + '/' + CRUD_ROUTES.LIST,
  CREATE: APP_ROUTES.PURCHASE_ORDER + '/' + CRUD_ROUTES.CREATE,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.PURCHASE_ORDER + '/' + route + '/' + id
  }
}

export const BILL = {
  LIST: APP_ROUTES.BILL + '/' + CRUD_ROUTES.LIST,
  CREATE: APP_ROUTES.BILL + '/' + CRUD_ROUTES.CREATE,
  AGING_REPORT: APP_ROUTES.BILL + '/aging-report',
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.BILL + '/' + route + '/' + id
  }
}

//SALES SECTION
export const CREDIT_NOTE = {
  LIST: APP_ROUTES.CREDIT_NOTE + '/' + CRUD_ROUTES.LIST,
  CREATE: APP_ROUTES.CREDIT_NOTE + '/' + CRUD_ROUTES.CREATE,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.CREDIT_NOTE + '/' + route + '/' + id
  }
}

export const INVOICE = {
  LIST: APP_ROUTES.INVOICE + '/' + CRUD_ROUTES.LIST,
  CREATE: APP_ROUTES.INVOICE + '/' + CRUD_ROUTES.CREATE,
  AGING_REPORT: APP_ROUTES.INVOICE + '/aging-report',
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.INVOICE + '/' + route + '/' + id
  }
}

//WORKFLOW SECTION
export const WORKFLOW = {
  LIST: APP_ROUTES.WORKFLOW + '/' + CRUD_ROUTES.LIST,
  CREATE: APP_ROUTES.WORKFLOW + '/' + CRUD_ROUTES.CREATE,
  ID_BASED_ROUTE(route: string, id: number) {
    return APP_ROUTES.WORKFLOW + '/' + route + '/' + id
  }
}

export const STATUS = {
  LIST: APP_ROUTES.STATUS + '/' + CRUD_ROUTES.LIST,
}
