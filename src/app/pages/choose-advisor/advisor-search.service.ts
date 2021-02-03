import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { EMPTY, Observable } from 'rxjs';
import { RollbarService } from '../../rollbar';
import * as Rollbar from 'rollbar';
import { catchError } from 'rxjs/operators';
import { ToastService } from '../../services/toast-service/toast-service.service';
import { Trainer } from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class AdvisorSearchService {

  constructor(
    public http: HttpClient,
    @Inject(RollbarService) private rollbar: Rollbar,
    public toastSvc: ToastService,
  ) {
  }

  public advisorSearch(search: string): Observable<{ advisor: Trainer }> {
    const url = environment.apiUrl + 'advisor/search/' + search;
    return this.http.get<{ advisor: Trainer }>(url);
  }

  chooseAdvisor(advisor: Trainer) {
    return this.http.post(environment.apiUrl + 'advisor/assign', {campaign_id: advisor.legionnaire_url})
      .pipe(catchError((err) => {
        this.toastSvc.flash('Error assigning advisor. Please contact support.');
        this.rollbar.error(err);
        return EMPTY;
      }));
  }
}
