import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import {ControlContainer, ControlValueAccessor, FormControl, FormControlDirective, NG_VALUE_ACCESSOR, Validators} from '@angular/forms';
import {Observable, ReplaySubject} from 'rxjs';

@Component({
  selector: 'kt-simple-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  changeDetection: ChangeDetectionStrategy.Default,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: DropdownComponent,
    multi: true
  }]
})
export class DropdownComponent implements OnInit, OnChanges, ControlValueAccessor, Validators {

  @ViewChild(FormControlDirective, {static: true}) formControlDirective: FormControlDirective;
  @ViewChild('customSelect') customSelect: ElementRef

  @Input() formControl: FormControl<any> | any;
  @Input() formControlName: string;
  @Input() optionList: Observable<any> | any;
  @Input() readonly: boolean;
  @Input() propertyName: string;
  @Input() propertyValue: string;
  @Input() isRequired = false;
  @Input() secondaryPropertyName: string;
  @Input() placeholder: string;
  @Input() searchPlaceholder: string;
  @Input() hintText: string;
  @Input() errorMessage: string | any;
  @Input() clickEventButtonName: string;
  @Input() buttonPermission: boolean;
  @Input() matFormFieldClass: any | [] | string;
  @Input() matSelectClass: any | [] | string;
  @Input() callBackFunction: (param: any) => any
  @Input() isDisabled: boolean
  @Input() isDisabledNone: boolean = false;
  @Input() id: string;
  @Input() labelText: string | null;


  @Output() clickEvent = new EventEmitter<any>();
  @Output() selectionChange = new EventEmitter<any>();
  @Output() blurEvent = new EventEmitter<any>();
  @Output() dataLoaded = new EventEmitter<boolean>();

  @Input() isMultiple = false;
  @Input() maxSelectionCount: number

  isLoading: boolean;
  filterControl: FormControl = new FormControl();
  filteredOptionList: ReplaySubject<[]> = new ReplaySubject<[]>(1);
  private options: any = [];
  private selectedOptions = []

  get control() {
    return this.formControl || this.controlContainer.control.get(this.formControlName);
  }

  constructor(private controlContainer: ControlContainer) { }

  // For Getting diff Dropdown Data in issuance throug item dropdown && !changes.optionList.previousValue

  ngOnChanges(changes: SimpleChanges): void {
    if (changes && changes.optionList && changes.optionList.currentValue) {
      this.optionList = changes.optionList.currentValue
      this.ngOnInit()
    }
  }

  ngOnInit(): void {

    if (this.optionList instanceof Observable) {
      this.isLoading = true;
      this.optionList.subscribe((res) => {
        this.options = (res && res.result) ? res.result : res;
        //This condition is just for temporary work
        //Please re-work and correct this...
        if (typeof (this.options) === 'number') {
          this.isLoading = false;
        }
        if (this.options) {
          this.options = this.callBackFunction ? this.options.flatMap(this.callBackFunction) : this.options

          if (this.options.length > 0 || res?.isSuccess) {
            this.isLoading = false;
          }
          this.filteredOptionList.next(this.options.slice());
        }
      })
    } else {
      this.options = this.callBackFunction ? this.optionList.flatMap(this.callBackFunction) : this.optionList;
      this.filteredOptionList.next(this.options?.slice());
    }

    // listen for search field value changes
    this.filterControl.valueChanges
      .subscribe(() => {
        this.filterBanks();
      });
  }

  protected filterBanks() {
    if (!this.options) {
      return;
    }
    // get the search keyword
    let search = this.filterControl.value;
    if (!search) {
      this.filteredOptionList.next(this.options.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredOptionList.next(
      this.options.filter(option => option[this.propertyName].toString().toLowerCase().indexOf(search) > -1)
    );
  }

  registerOnChange(fn: any): void {
    this.formControlDirective.valueAccessor.registerOnChange(fn);
    // this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.formControlDirective.valueAccessor.registerOnTouched(fn);
    // this.onTouched = fn;
  }

  writeValue(obj: any): void {
    this.formControlDirective.valueAccessor.writeValue(obj);
  }

  emitClickEvent() {
    this.clickEvent.emit();
  }

  selectionChangeEvent(event) {
    if (this.maxSelectionCount && this.selectedOptions.length <= this.maxSelectionCount) {
      this.selectedOptions = event.value
    }
    this.selectionChange.emit(event);
  }

  isOptionDisabled(id): boolean {
    return (this.selectedOptions.length >= this.maxSelectionCount && !this.selectedOptions.find(x => x === id));
  }

  blur() {
    this.blurEvent.emit()
  }

}
