import { Inject, Injectable } from '@angular/core';
import { RollbarService } from '../rollbar';
import * as Rollbar from 'rollbar';
import { ToastService } from '../services/toast-service/toast-service.service';

@Injectable({
  providedIn: 'root'
})
export class FormErrorDecoratorService {
  private static error: Rollbar | undefined = undefined;
  public static toast: ToastService | undefined = undefined;

  public constructor(
    @Inject(RollbarService) private rollbar: Rollbar,
    public toastService: ToastService,
  ) {
    FormErrorDecoratorService.error = rollbar;
    FormErrorDecoratorService.toast = toastService;
  }

  public static getToast(): ToastService {
    if (!FormErrorDecoratorService.toast) {
      throw new Error('ToastService not initialized');
    }
    return FormErrorDecoratorService.toast;
  }
}
