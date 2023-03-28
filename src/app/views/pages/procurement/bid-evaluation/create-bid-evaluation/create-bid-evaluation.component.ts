import {ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit, ViewChild} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';
import {finalize, take} from 'rxjs/operators';
import {ActivatedRoute} from '@angular/router';
import {AppComponentBase} from 'src/app/views/shared/app-component-base';
import {Permissions} from 'src/app/views/shared/AppEnum';
import {AddModalButtonService} from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import {ProductService} from '../../../profiling/product/service/product.service';
import {IApiResponse} from 'src/app/views/shared/IApiResponse';
import {BidEvaluationService} from '../service/bid-evaluation.service';
import {IBidEvaluation} from '../model/IBidEvaluation';
import {IBidEvaluationLines} from '../model/IBidEvaluationLines';
import {BID_EVALUATION} from 'src/app/views/shared/AppRoutes';

@Component({
  selector: 'kt-create-bid-evaluation',
  templateUrl: './create-bid-evaluation.component.html',
  styleUrls: ['./create-bid-evaluation.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CreateBidEvaluationComponent extends AppComponentBase implements OnInit {

  public permissions = Permissions;

  // For Loading
  isLoading: boolean;

  // Declaring form variable
  bidEvaluationForm: FormGroup;

  // For Table Columns
  displayedColumns = ['nameOfBider', 'technicalTotal', 'technicalObtain', 'financialTotal', 'financialObtain', 'evaluatedCost', 'rule', 'action'];

  // Getting Table by id
  @ViewChild('table', {static: true}) table: any;

  // bidEvaluationModel
  bidEvaluationModel: IBidEvaluation = {} as IBidEvaluation;

  isBidEvaluation: any;

  //Limit Date
  maxDate: Date = new Date();
  minDate: Date
  dateCondition: boolean

  title: string = 'Create Bid Evaluation'

  //for resetting form
  @ViewChild('formDirective') private formDirective: NgForm;


  // Validation Messages
  validationMessages = {
    name: {
      required: 'Name is required.'
    },
    title: {
      required: 'Title is required.'
    },
    refNo: {
      required: 'PPRA Ref. No is required.'
    },
    methodOfProcurement: {
      required: 'Method is required.'
    },
    tendorInquiryNumber: {
      required: 'Inquiry Number is required.'
    },
    numberOfBids: {
      required: 'Number is required.',
      min: 'Minimum value is zero.'
    },
    dateOfOpeningBid: {
      required: 'Bid Opening Date is required.'
    },
    dateOfClosingBid: {
      required: 'Bid Closing Date is required.'
    },
    bidEvaluationCriteria: {
      required: 'Criteria is required.'
    },
    lowestEvaluatedBidder: {
      required: 'Bidder is required.'
    }
  }

  formErrors = {
    name: '',
    title: '',
    refNo: '',
    methodOfProcurement: '',
    tendorInquiryNumber: '',
    numberOfBids: '',
    dateOfOpeningBid: '',
    dateOfClosingBid: '',
    bidEvaluationCriteria: '',
    lowestEvaluatedBidder: ''
  }

  // Injecting Dependencies
  constructor(
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private bidEvaluationService: BidEvaluationService,
    public activatedRoute: ActivatedRoute,
    public productService: ProductService,
    public addButtonService: AddModalButtonService,
    public injector: Injector
  ) {
    super(injector);
  }

  ngOnInit() {

    this.bidEvaluationForm = this.fb.group({
      name: ['', [Validators.required]],
      title: ['', [Validators.required]],
      refNo: ['', [Validators.required]],
      methodOfProcurement: ['', [Validators.required]],
      tendorInquiryNumber: ['', [Validators.required]],
      numberOfBids: [0, [Validators.required, Validators.min(0)]],
      dateOfOpeningBid: ['', [Validators.required]],
      dateOfClosingBid: ['', [Validators.required]],
      bidEvaluationCriteria: ['', [Validators.required]],
      lowestEvaluatedBidder: ['', [Validators.required]],
      bidEvaluationLines: this.fb.array([
        this.addBidEvaluationLines()
      ])
    });

    //get id by using route
    this.activatedRoute.queryParams.subscribe((param) => {
      const id = param.q;
      this.isBidEvaluation = param.isBidEvaluation;

      if (id && this.isBidEvaluation) {
        this.title = 'Edit Bid Evaluation'
        this.getBidEvaluation(id);
      }
    })
  }

  // Form Reset
  reset() {
    this.formDirective.resetForm();
    this.table.renderRows();
  }

  //for save or submit
  isSubmit(val: number) {
    this.bidEvaluationModel.isSubmit = (val === 0) ? false : true;
  }

  // Add Bid Evaluation line
  addBidEvaluationLineClick(): void {
    const controls = this.bidEvaluationForm.controls.bidEvaluationLines as FormArray;
    controls.push(this.addBidEvaluationLines());
    this.table.renderRows();
  }

  addBidEvaluationLines(): FormGroup {
    return this.fb.group({
      nameOfBider: ['', [Validators.required]],
      technicalTotal: [0, [Validators.required, Validators.min(0)]],
      technicalObtain: [0, [Validators.required, Validators.min(0)]],
      financialTotal: [0, [Validators.required, Validators.min(0)]],
      financialObtain: [0, [Validators.required, Validators.min(0)]],
      evaluatedCost: [0, [Validators.required, Validators.min(0)]],
      rule: ['', [Validators.required]]
    });
  }

  // Remove Bid Evaluation line
  removeBidEvaluationLineClick(bidEvaluationLineIndex: number): void {
    const bidEvaluationArray = this.bidEvaluationForm.get('bidEvaluationLines') as FormArray;
    bidEvaluationArray.removeAt(bidEvaluationLineIndex);
    bidEvaluationArray.markAsDirty();
    bidEvaluationArray.markAsTouched();
    this.table.renderRows();
  }


  //Get Bid Evaluation Data for Edit
  private getBidEvaluation(id: number) {
    this.isLoading = true;
    this.bidEvaluationService.getBidEvaluationById(id)
      .pipe(
        take(1),
        finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
        })
      )
      .subscribe((res: IApiResponse<IBidEvaluation>) => {
        if (!res) {
          return
        }
        this.bidEvaluationModel = res.result
        this.editBidEvaluation(this.bidEvaluationModel)
      });
  }

  //Edit Bid Evaluation
  editBidEvaluation(data: IBidEvaluation) {

    this.bidEvaluationForm.patchValue({
      name: data.name,
      title: data.title,
      refNo: data.refNo,
      methodOfProcurement: data.methodOfProcurement,
      tendorInquiryNumber: data.tendorInquiryNumber,
      numberOfBids: data.numberOfBids,
      dateOfOpeningBid: data.dateOfOpeningBid,
      dateOfClosingBid: data.dateOfClosingBid,
      bidEvaluationCriteria: data.bidEvaluationCriteria,
      lowestEvaluatedBidder: data.lowestEvaluatedBidder
    });

    this.bidEvaluationForm.setControl('bidEvaluationLines', this.editBidEvaluationLines(data.bidEvaluationLines));
  }

  //Edit Bid Evaluation Lines
  editBidEvaluationLines(bidEvaluationLines: IBidEvaluationLines[]): FormArray {
    const formArray = new FormArray([]);
    bidEvaluationLines.forEach((line: IBidEvaluationLines | any) => {
      formArray.push(this.fb.group({
        id: line.id,
        nameOfBider: [line.nameOfBider, [Validators.required]],
        technicalTotal: [line.technicalTotal, [Validators.required, Validators.min(0)]],
        technicalObtain: [line.technicalObtain, [Validators.required, Validators.min(0)]],
        financialTotal: [line.financialTotal, [Validators.required, Validators.min(0)]],
        financialObtain: [line.financialObtain, [Validators.required, Validators.min(0)]],
        evaluatedCost: [line.evaluatedCost, [Validators.required, Validators.min(0)]],
        rule: [line.rule, [Validators.required]]
      }))
    })
    return formArray
  }

  // Submit Form Function
  onSubmit(): void {
    if (this.bidEvaluationForm.get('bidEvaluationLines').invalid) {
      this.bidEvaluationForm.get('bidEvaluationLines').markAllAsTouched();
    }

    const controls = <FormArray>this.bidEvaluationForm.controls['bidEvaluationLines'];
    if (controls.length == 0) {
      this.toastService.error('Please add BidEvaluation lines', 'Bid Evaluation')
      return;
    }

    if (this.bidEvaluationForm.invalid) {
      this.toastService.error('Please fill all required fields!', 'Bid Evaluation')
      return;
    }


    this.isLoading = true;
    this.mapFormValuesToBidEvaluationModel();

    if (this.bidEvaluationModel.id) {
      this.bidEvaluationService.updateBidEvaluation(this.bidEvaluationModel)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe((res) => {
          this.toastService.success('Updated Successfully', 'Bid Evaluation')
          this.cdRef.detectChanges();
          this.router.navigate(['/' + BID_EVALUATION.ID_BASED_ROUTE('details', this.bidEvaluationModel.id)]);
        })
    } else {
      delete this.bidEvaluationModel.id;
      this.bidEvaluationService.createBidEvaluation(this.bidEvaluationModel)
        .pipe(
          take(1),
          finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
          })
        )
        .subscribe(
          (res) => {
            this.toastService.success('Created Successfully', 'Bid Evaluation')
            this.router.navigate(['/' + BID_EVALUATION.ID_BASED_ROUTE('details', res.result.id)]);
          });
    }
  }

  // Mapping value to model
  mapFormValuesToBidEvaluationModel() {
    this.bidEvaluationModel.name = this.bidEvaluationForm.value.name;
    this.bidEvaluationModel.title = this.bidEvaluationForm.value.title;
    this.bidEvaluationModel.refNo = this.bidEvaluationForm.value.refNo;
    this.bidEvaluationModel.methodOfProcurement = this.bidEvaluationForm.value.methodOfProcurement;
    this.bidEvaluationModel.tendorInquiryNumber = this.bidEvaluationForm.value.tendorInquiryNumber;
    this.bidEvaluationModel.numberOfBids = this.bidEvaluationForm.value.numberOfBids;
    this.bidEvaluationModel.dateOfOpeningBid = this.transformDate(this.bidEvaluationForm.value.dateOfOpeningBid, 'yyyy-MM-dd');
    this.bidEvaluationModel.dateOfClosingBid = this.transformDate(this.bidEvaluationForm.value.dateOfClosingBid, 'yyyy-MM-dd');
    this.bidEvaluationModel.bidEvaluationCriteria = this.bidEvaluationForm.value.bidEvaluationCriteria;
    this.bidEvaluationModel.lowestEvaluatedBidder = this.bidEvaluationForm.value.lowestEvaluatedBidder;
    this.bidEvaluationModel.bidEvaluationLines = this.bidEvaluationForm.value.bidEvaluationLines;
  }
}
