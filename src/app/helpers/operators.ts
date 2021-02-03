import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { FormErrorDecoratorService } from '../decorators/form-error-decorator.service';

export function catchFormError() {
  return <T>(source: Observable<T>) => {
    return source.pipe(
      catchError((e) => {
        const toast = FormErrorDecoratorService.getToast();
        if (e.status !== 422 || !e.error) {
          throw e;
        }
        if (e.error && e.error.errors) {
          const firstKey = Object.keys(e.error.errors)[0];
          toast.flash(e.error.errors[firstKey][0]);
        } else if (e.error && e.error.message) {
          toast.flash(e.error.message);
        } else {
          toast.flash('Unable to process entity.');
        }
        return EMPTY;
      })
    );
  };
};
