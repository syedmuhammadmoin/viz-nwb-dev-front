import {Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {ControlContainer, ControlValueAccessor, FormControl, FormControlDirective, NG_VALUE_ACCESSOR} from '@angular/forms';
import {Observable, ReplaySubject} from 'rxjs';

@Component({
  selector: 'kt-group-dropdown',
  templateUrl: './group-dropdown.component.html',
  styleUrls: ['./group-dropdown.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: GroupDropdownComponent,
    multi: true
  }]
})
export class GroupDropdownComponent implements OnInit, ControlValueAccessor {

  @ViewChild(FormControlDirective, {static: true}) formControlDirective: FormControlDirective;
  @ViewChild('customGroupSelect') customSelect: ElementRef

  @Input() formControl: FormControl<any> | any;
  @Input() formControlName: string;
  @Input() optionList: Observable<any> | [];
  @Input() propertyName: string;
  @Input() propertyValue: string;
  @Input() isRequired = false;
  @Input() buttonPermission: boolean;
  @Input() secondaryPropertyName: string;
  @Input() placeholder: string;
  @Input() searchPlaceholder: string;
  @Input() hintText: string;
  @Input() errorMessage: string | any;
  @Input() groupPropertyName: string;
  @Input() groupChildrenName: string;
  @Input() clickEventButtonName: string;
  @Input() matSelectClass: any | [] | string
  @Input() matFormFieldClass: any | [] | string
  @Input() isDisabled: boolean;
  @Input() isDisabledNone: boolean = false;

  @Output() selectionChangeEvent = new EventEmitter<any>()
  @Output() clickEvent = new EventEmitter<any>();
  @Output() blurEvent = new EventEmitter<any>();
  @Output() dataLoaded = new EventEmitter<boolean>();

  isLoading: boolean
  filterControl: FormControl = new FormControl();
  filteredOptionList: ReplaySubject<[]> = new ReplaySubject<[]>(1);
  private options: any = [];

  get control() {
    return this.formControl || this.controlContainer.control.get(this.formControlName);
  }

  constructor(
    // @Self() public controlDir: NgControl,
    private controlContainer: ControlContainer) {
    // this.controlDir.valueAccessor = this;
  }

  ngOnInit(): void {
    if (this.optionList instanceof Observable) {
      this.isLoading = true;
      this.optionList.subscribe((res) => {
        this.options = (res.result) ? res.result : res;
        this.isLoading = false;
        this.filteredOptionList.next(this.options.slice());
      });
    } else {
      this.options = this.optionList;
      this.filteredOptionList.next(this.options.slice());
    }

    // listen for search field value changes
    this.filterControl.valueChanges
      .subscribe(() => {
        this.filterOptionGroups();
      });
  }

  protected filterOptionGroups() {
    if (!this.optionList) {
      return;
    }
    // get the search keyword
    let search = this.filterControl.value;
    const optionGroupsCopy: any = this.copyBankGroups(this.options);
    if (!search) {
      this.filteredOptionList.next(optionGroupsCopy);
      return;
    } else {
      search = search.toLowerCase();
    }
    // filter the banks
    this.filteredOptionList.next(
      optionGroupsCopy.filter(optionGroup => {
        const showOptionGroup = optionGroup[this.groupPropertyName].toLowerCase().indexOf(search) > -1;
        if (!showOptionGroup) {
          optionGroup[this.groupChildrenName] = optionGroup[this.groupChildrenName]
            .filter(child => child[this.propertyName].toLowerCase().indexOf(search) > -1);
        }
        return optionGroup[this.groupChildrenName].length > 0;
      })
    );
  }

  protected copyBankGroups(optionGroups: []) {
    const optionGroupsCopy = [];
    optionGroups.forEach(optionGroup => {
      optionGroupsCopy.push({
        [this.groupPropertyName]: optionGroup[this.groupPropertyName],
        // @ts-expect-error ...
        [this.groupChildrenName]: optionGroup[this.groupChildrenName].slice()
      });
    });
    return optionGroupsCopy;
  }


  registerOnChange(fn: any): void {
    this.formControlDirective.valueAccessor.registerOnChange(fn);
    // this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.formControlDirective.valueAccessor.registerOnTouched(fn);
  }

  writeValue(obj: any): void {
    this.formControlDirective.valueAccessor.writeValue(obj);
  }

  emitClickEvent() {
    this.clickEvent.emit();
  }

  blur() {
    this.blurEvent.emit()
  }

  selectionChange(event) {
    this.selectionChangeEvent.emit(event)
  }
}
