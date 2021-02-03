import { Inject, Injectable } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { RollbarService } from '../../rollbar';
import * as Rollbar from 'rollbar';
import { ErrorFormat, ReportFormat, StateColors } from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class ErrorsService {

  constructor(@Inject(RollbarService) private rollbar: Rollbar) {
  }

  // noinspection JSMethodCanBeStatic
  public stateColor(item: FormControl | AbstractControl): StateColors {
    if (item.invalid && !item.dirty) {
      return 'dark';
    } else if (item.invalid) {
      return 'danger';
    } else {
      return 'dark';
    }
  }

  // noinspection JSMethodCanBeStatic
  /**
   * Returns the first error key with first value in the error object
   * @param errors
   * @return string
   */
  public firstError(errors: ErrorFormat): string {
    if (!this.checkIsCorrectStructure(errors)) {
      return '';
    }

    const keys = Object.keys(errors.list);
    return errors.list[keys[0]][0];
  }

  // noinspection JSMethodCanBeStatic
  /**
   * Returns the errors for the key
   * @param key
   * @param errors
   */
  public errorForKey(key: string, errors: ErrorFormat): string[] {
    if (!this.checkIsCorrectStructure(errors)) {
      return [];
    }
    if (errors.list.hasOwnProperty(key)) {
      return errors.list[key];
    }

    return [];
  }

  // noinspection JSMethodCanBeStatic
  /**
   * Returns the first error value for the given key
   * @param key
   * @param errors
   */
  public firstErrorForKey(key: string, errors: ErrorFormat): string {
    if (!this.checkIsCorrectStructure(errors)) {
      return '';
    }

    if (errors.list.hasOwnProperty(key)) {
      if (errors.list[key].length > 0) {
        return errors.list[key][0];
      }
    }

    return '';
  }

  // noinspection JSMethodCanBeStatic
  /**
   * Checks whether the given key has any errors
   * @param key
   * @param errors
   */
  public keyHasError(key: string, errors: ErrorFormat): boolean {

    if (!this.checkIsCorrectStructure(errors)) {
      return false;
    }

    if (errors.list.hasOwnProperty(key)) {
      return errors.list[key].length > 0;
    }

    return false;
  }

  // noinspection JSMethodCanBeStatic
  /**
   * Checks whether the given key has any errors
   * @param errors
   */
  public hasError(errors: ErrorFormat): boolean {

    if (!this.checkIsCorrectStructure(errors)) {
      return false;
    }

    for (const key in errors.list) {
      if (errors.list[key].length > 0) {
        return true;
      }
    }

    return false;
  }

  /**
   * Returns the error status value
   * @param errors
   */
  public status(errors: ErrorFormat): number {
    if (!this.checkIsCorrectStructure(errors)) {
      return -1;
    }
    return errors.status;
  }

  public checkIsCorrectStructure(error: any | ErrorFormat, throwException: boolean = true): boolean {
    const isCorrect = !(!error.hasOwnProperty('status') || !error.hasOwnProperty('list'));

    if (throwException && isCorrect === false) {
      throw error;
    }

    return isCorrect;
  }

  /**
   * Extract display message from Http Error Message
   * Send Error Report via Rollbar
   * @param errorResponse Http Error Response
   */
  public extractMessageAfterSendReport(errorResponse: any) {

    const errorContent = <ReportFormat>{};
    errorContent.status = errorResponse.status;
    errorContent.message = errorResponse.message || '';
    errorContent.url = errorResponse.url || '';
    errorContent.content = errorResponse.error.errors || {};

    this.rollbar.error(errorContent);

    const keys = Object.keys(errorResponse.error.errors);
    let errorMessage = '';
    if (errorResponse.error.errors[keys[0]]) {
      errorMessage = errorResponse.error.errors[keys[0]][0];
    } else if (errorResponse.message) {
      errorMessage = errorResponse.message;
    } else {
      errorMessage = 'Error Response: ' + errorResponse.status.toString();
    }

    return errorMessage;
  }
}
