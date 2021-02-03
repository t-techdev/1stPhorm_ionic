import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ContactInfo } from '../../../../interfaces';

@Component({
  selector: 'app-personal-contact',
  templateUrl: './personal-contact.page.html',
  styleUrls: ['./personal-contact.page.scss'],
})
export class PersonalContactPage implements OnInit {
  public form: FormGroup;

  @Output() submitted: EventEmitter<ContactInfo> = new EventEmitter<ContactInfo>();

  constructor(
  ) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      address: new FormControl(''),
      city: new FormControl(''),
      state: new FormControl(''),
      postal_code: new FormControl(''),
      country: new FormControl('USA'),
      phone: new FormControl(''),
      instagram: new FormControl(''),
      twitter: new FormControl('')
    });
  }

  public submitForm() {
    const info = <ContactInfo>this.form.getRawValue();
    this.submitted.emit(info);
  }
}
