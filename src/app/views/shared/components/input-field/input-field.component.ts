import { Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import { ControlContainer, ControlValueAccessor, FormControl, FormControlDirective, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';

@Component({
  selector: 'kt-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: InputFieldComponent,
    multi: true
  }]
})
  
export class InputFieldComponent implements OnInit , ControlValueAccessor, Validators {

  @ViewChild(FormControlDirective, {static: true}) formControlDirective: FormControlDirective;

  @Input() formControl: FormControl;
  @Input() formControlName: string;
  @Input() placeholder: string;
  @Input() readonly: boolean;
  @Input() hintText: string;
  @Input() errorMessage: string | any;
  @Input() errorMessage2: string | any;
  @Input() matFormFieldClass: any | [] | string;
  @Input() value: number | string | any = null;
  @Input() inputClass: any | [] | string;
  @Input() isDisabled: boolean;
  @Input() id: string;

  @Input() type: any;
  @Input() min: number;
  @Input() max: number | any;


  @Output() blurEvent = new EventEmitter<any>();
  @Output() changeEvent = new EventEmitter<any>();

  constructor ( private controlContainer: ControlContainer ) { }

  ngOnInit(): void { }

  get control() {
    return this.formControl || this.controlContainer.control.get(this.formControlName) 
  }

  // registerOnChange(fn: any): void {
  //   this.formControlDirective.valueAccessor.registerOnChange(fn);
  // }

  registerOnChange(fn: (_: number|null) => void): void {
    if(this.type === 'number') {
      this.onChange = () => {
        fn((this.control.value) ? Number(this.control.value) : null);
      };
    }
    else {
      this.formControlDirective.valueAccessor.registerOnChange(fn);
    }
  }

  registerOnTouched(fn: any): void {
    this.formControlDirective.valueAccessor.registerOnTouched(fn);
  }

  writeValue(obj: any): void {
    this.formControlDirective.valueAccessor.writeValue(obj);
  }

  onChange(event) {
    this.changeEvent.emit(event)
  }

  blur() {
    this.blurEvent.emit()
  }

}
