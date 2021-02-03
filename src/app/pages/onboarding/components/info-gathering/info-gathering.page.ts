import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PersonalInfo, Sex, UnitTypes } from '../../../../interfaces';

@Component({
  selector: 'app-info-gathering',
  templateUrl: './info-gathering.page.html',
  styleUrls: ['./info-gathering.page.scss'],
})
export class InfoGatheringPage implements OnInit {

  public SexValues = Sex;
  public form: FormGroup;
  public unit = UnitTypes.Imperial;
  public UnitTypes = UnitTypes;
  public unitType: UnitTypes = UnitTypes.Imperial;

  @Output() submitted: EventEmitter<PersonalInfo> = new EventEmitter<PersonalInfo>();

  @Input() values: { [key: string]: string } = {};

  constructor() {
  }

  ngOnInit() {
    this.form = new FormGroup({
      date_of_birth: new FormControl('1988-01-01', [Validators.required]),
      height: new FormControl('', [Validators.required]),
      weight: new FormControl('', [Validators.required]),
      goal_weight: new FormControl('', [Validators.required]),
      sex: new FormControl('', [Validators.required]),
      unit_type: new FormControl(UnitTypes.Imperial, [Validators.required]),
      goal_weight_unit: new FormControl(UnitTypes.Imperial, [Validators.required])
    });
    if (this.values) {
      this.form.patchValue(this.values);
    }
  }

  public submitForm() {
    const info = <PersonalInfo>this.form.getRawValue();
    this.submitted.emit(info);
  }

  sexChanged($event: CustomEvent) {
    this.form.get('sex').setValue($event.detail.value);
  }

  unitChanged($event: CustomEvent) {
    this.unitType = +$event.detail.value;
    this.form.get('unit_type').setValue(+$event.detail.value);
    this.form.get('goal_weight_unit').setValue(+$event.detail.value);
  }
}
