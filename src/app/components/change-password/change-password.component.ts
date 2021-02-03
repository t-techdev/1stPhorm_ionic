import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorsService, ToastService, ProfileService } from '../../services';

@Component({
  selector: 'app-change-password, [appChangePassword]',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent implements OnInit {

  public form: FormGroup;

  constructor(
    public profileService: ProfileService,
    public toastCtrl: ToastService,
    public errorService: ErrorsService
  ) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      old_password: new FormControl('', [Validators.required]),
      password: new FormControl('', [Validators.required]),
      password_confirmation: new FormControl('', [Validators.required]),
    });
  }

  public async changePassword() {
    const data = this.form.getRawValue();
    this.profileService.changePassword(
      data.old_password,
      data.password,
      data.password_confirmation
    ).subscribe(() => {
      this.toastCtrl.flash('Password changed successfully');
      this.form.reset();
    }, (e) => {
      this.toastCtrl.flash('Unable to change password.');
      throw e;
    });
  }

}
