import { Component, Optional, OnInit, forwardRef } from '@angular/core';
import { ICellEditorAngularComp } from 'ag-grid-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ChartOfAccountService } from '../service/chart-of-account.service';
import { ControlContainer, ControlValueAccessor, FormControl, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-group-dropdown-cell-editor',
  template: `
    <kt-group-dropdown
      id="level3Ctrl"
       [formControl]="internalControl"
      [optionList]="level3List"
      [groupChildrenName]="'children'"
      [groupPropertyName]="'level1Name'"
      [matFormFieldClass]="'full-width'"
      [placeholder]="'Select Head Account'"
      [propertyName]="'name'"
      [propertyValue]="'id'"
      >
    </kt-group-dropdown>
  `,
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => GroupDropdownCellEditorComponent),
    multi: true
  }]
})
export class GroupDropdownCellEditorComponent implements ControlValueAccessor, OnInit, ICellEditorAngularComp {
  public level3List: Observable<any> | any;
  public selectedValue: any;
  internalControl = new FormControl(); // Internal control

  private onChange: any = () => { };
  private onTouched: any = () => { };
  params: any;

  constructor(@Optional() public controlContainer: ControlContainer) {

    if (!controlContainer) {
      console.error('ControlContainer not found');
    }
  }
  ngOnInit() {
    this.internalControl.valueChanges.subscribe(value => {
      this.selectedValue = value; // Track the selected value here
      this.onChange(value); // Notify the parent form of changes
    });
  }

  agInit(params: any): void {
    const chartOfAccountService: ChartOfAccountService = params.context.chartOfAccountService;
    this.level3List = chartOfAccountService.getAccountsTypeDropdown().pipe(
      map((res: any) => res.result)
    );
    this.selectedValue = params.value; // Set the initial value
    this.internalControl.setValue(this.selectedValue, { emitEvent: false }); // Set value in form control without triggering valueChanges
  }


  getValue(): any {
    return this.selectedValue;
  }
  writeValue(value: any): void {
    this.internalControl.setValue(value, { emitEvent: false }); // Set initial value
  }

  registerOnChange(fn: any): void {
    this.onChange = fn; // Register the change function
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn; // Register the touched function
  }

  setDisabledState(isDisabled: boolean): void {
    isDisabled ? this.internalControl.disable() : this.internalControl.enable();
  }
}
