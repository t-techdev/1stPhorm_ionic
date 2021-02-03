import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ErrorsService } from '../../services/errors/errors.service';
import {
  LoadingController,
  NavController,
  ModalController,
} from '@ionic/angular';
import {
  AuthenticationService,
} from '../../services/authentication/authentication.service';
import { TermsComponent } from './terms/terms.component';
import { FirebaseService } from '../../services/firebase/firebase.service';
import { ToastService } from '../../services/toast-service/toast-service.service';
import { BranchioService } from '../../services/branchio/branchio.service';
import { Transphormer } from '../../interfaces';
import { ErrorFormat } from '../../interfaces/errors';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  public spinner = false;
  public form: FormGroup;

  public password = 'password';

  constructor(
    public navCtrl: NavController,
    private authenticationService: AuthenticationService,
    private loadingCtrl: LoadingController,
    public errorService: ErrorsService,
    public toastSvc: ToastService,
    private modal: ModalController,
    private branch: BranchioService,
    private firebase: FirebaseService
  ) {
  }

  ngOnInit() {
    this.setupForm();
  }

  private setupForm() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      first_name: new FormControl('', [Validators.required]),
      last_name: new FormControl('', [Validators.required]),
    });
  }

  public async terms() {
    const termsModal = await this.modal.create({
      component: TermsComponent,
      backdropDismiss: false,
    });
    await termsModal.present();
  }

  public register() {
    this.spinner = true;
    this.authenticationService.register(
      this.form.get('email').value,
      this.form.get('password').value,
      this.form.get('first_name').value,
      this.form.get('last_name').value,
      this.branch.advisorId,
    )
    .then((value: Transphormer) => {
      return this.firebase.saveTokenToServer(this.firebase.token());
    })
    .then(_ => {
      this.spinner = false;
    })
    .then(() => {
      return this.navCtrl.navigateRoot(this.branch.advisorId ? 'onboarding' : 'choose-advisor');
    })
    .catch((e: ErrorFormat) => {
      this.spinner = false;
      return this.toastSvc.flash(this.errorService.firstError(e));
    });
  }

  signIn() {
    this.navCtrl.navigateRoot('/');
  }
}
