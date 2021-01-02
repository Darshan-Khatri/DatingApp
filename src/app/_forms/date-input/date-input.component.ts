import { Component, Input, OnInit, Self } from '@angular/core';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-date-input',
  templateUrl: './date-input.component.html',
  styleUrls: ['./date-input.component.css']
})
export class DateInputComponent implements ControlValueAccessor {
  @Input() label: string;
  @Input() maxDate: Date;

  /*Every single property inside "BsDatepickerConfig" would be optional,
  i.e we don't have to provide all the configuration options. If we don't specify partial then we have to provide every
  possible configurations.*/
  bsConfig: Partial<BsDatepickerConfig>;

  constructor(@Self() public ngControl: NgControl) {
    this.ngControl.valueAccessor = this;

    this.bsConfig = {
      containerClass: 'theme-dark-blue',
      dateInputFormat: 'DD MMMM YYYY',
    }
   }

  writeValue(obj: any): void {
  }
  registerOnChange(fn: any): void {
  }
  registerOnTouched(fn: any): void {
  }

}
