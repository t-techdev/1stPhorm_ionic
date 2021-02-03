import { Component } from '@angular/core';
import { AssessmentStateService } from '../../services/assessment-state/assessment-state.service';
import { AssessmentsService } from '../../../../services/assessments/assessments.service';
import { NavController } from '@ionic/angular';
import { ToastService } from '../../../../services/toast-service/toast-service.service';
import { ErrorsService } from '../../../../services/errors/errors.service';
import { catchError, finalize } from 'rxjs/operators';
import { NEVER } from 'rxjs';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss'],
})
export class SummaryComponent {
  public spinner = false;

  constructor(
    public state: AssessmentStateService,
    public assessmentService: AssessmentsService,
    public toastService: ToastService,
    public errorService: ErrorsService,
    public navCtrl: NavController
  ) {
  }

  /**
   * Submit the assessment
   */
  public async submitAssessment() {
    this.spinner = true;

    this.assessmentService.saveAssessment(this.state.questions, this.state.questionVersion, this.state.photo)
      .pipe(finalize(() => this.spinner = false))
      .pipe(catchError( () => {
        this.toastService.flash('Something went wrong');
        return NEVER;
      }))
      .subscribe(() => {
        this.navCtrl.navigateRoot('/take-assessment/thank-you', {
          animated: true,
          animationDirection: 'forward'
        });
      });
  }

  /**
   * Jump to question for retaking answer
   * @param questionIndex
   * @param backToSummary
   */
  public goToQuestion(questionIndex, backToSummary = true) {
    const data = {
      jumpToStep: questionIndex + 1,
      backToSummary
    };

    this.navCtrl.navigateRoot(`/take-assessment?useExisting=${encodeURIComponent(JSON.stringify(data))}`, {
      animated: true,
      animationDirection: 'back'
    });
  }

}
