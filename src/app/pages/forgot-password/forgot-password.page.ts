import { Component, OnInit } from '@angular/core';
import { ErrorsService } from '../../services/errors/errors.service';
import { ToastService } from '../../services/toast-service/toast-service.service';
import {
  NavController
} from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../services/authentication/authentication.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  public spinner = false;
  public form: FormGroup;

  constructor(
    public errorService: ErrorsService,
    private authenticationService: AuthenticationService,
    private toastSvc: ToastService,
    public navCtrl: NavController
  ) {
  }

  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  public async submit() {
    this.spinner = true;

    try {
      await this.authenticationService.forgotPassword(
        this.form.get('email').value
      );
      this.toastSvc.flash('An email has been sent with link to reset password.');
    } catch (e) {
      this.toastSvc.flash(this.errorService.firstError(e));
    } finally {
      this.spinner = false;
      this.navCtrl.back();
    }
  }
}
