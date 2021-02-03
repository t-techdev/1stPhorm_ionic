import { Component, OnInit } from '@angular/core';
import { AssessmentStateService } from './services/assessment-state/assessment-state.service';
import { AssessmentsService } from '../../services/assessments/assessments.service';
import { QuestionOption } from '../../interfaces/assessments';
import { NavController } from '@ionic/angular';
import { CameraService } from '../../services/camera/camera.service';
import { catchError, finalize, switchMap } from 'rxjs/operators';
import { NEVER, of } from 'rxjs';
import { ToastService } from '../../services/toast-service/toast-service.service';
import { ActivatedRoute } from '@angular/router';
import { ErrorsService } from '../../services/errors/errors.service';

@Component({
  selector: 'app-take-assessment',
  templateUrl: './take-assessment.page.html',
  styleUrls: ['./take-assessment.page.scss'],
})
export class TakeAssessmentPage implements OnInit {
  public spinner = false;

  /**
   * Custom update actions to be considered when returning to page using useExisting query parameter.
   */
  public updateActions: any = {};

  /**
   * State pointing loading of necessary items from service
   */
  public loadingData = true;

  constructor(
    public state: AssessmentStateService,
    public assessmentService: AssessmentsService,
    public cameraService: CameraService,
    public toastService: ToastService,
    public router: ActivatedRoute,
    public navCtrl: NavController,
    public errorService: ErrorsService
  ) {
  }

  async ngOnInit() {
    const queryParams = this.router.snapshot.queryParams;

    if (!queryParams.hasOwnProperty('useExisting')) {
      this.state.reset();
      this.assessmentService.assessmentQuestions()
        .subscribe((result) => {
          this.loadingData = false;
          this.state.setQuestions(result.questions);
          this.state.setVersion(result.version);
        },
        (error) => {
          const errorMessage = this.errorService.extractMessageAfterSendReport(error);
          this.toastService.flash('Error: ' +  errorMessage);
          throw error;
        });
    } else {
      const data = JSON.parse(queryParams.useExisting);
      this.updateActions = data;

      if (data.useRecentPhoto) {
        this.useRecentPhoto();
      }

      if (data.hasOwnProperty('jumpToStep')) {
        this.state.jumpTo(parseFloat(data.jumpToStep));
      }

      this.loadingData = false;
    }

  }

  /**
   * Update question and move to next step
   * @param selectedOption
   */
  public async updateQuestionOption(selectedOption: QuestionOption) {
    const question = this.state.question;
    question.options = question.options.map(option => {
      option.is_selected = option === selectedOption;
      return option;
    });

    this.state.updateQuestion(question, this.state.currentStep - 1);

    if (this.updateActions.backToSummary) {
      this.state.jumpTo(this.state.totalStep);
      this.updateActions = {};
      this.navCtrl.navigateRoot('/take-assessment/summary', {
        animated: true,
        animationDirection: 'forward'
      });
    } else {
      this.state.nextStep();
    }
  }

  /**
   * Use recent photo
   */
  public async useRecentPhoto() {

    this.spinner = true;

    this.cameraService.latestImage()
      .pipe(finalize(() => this.spinner = false))
      .pipe(catchError((error) => {
        const errorMessage = this.errorService.extractMessageAfterSendReport(error);
        this.toastService.flash('Error: ' +  errorMessage);
        return NEVER;
      }))
      .pipe(switchMap(camera => {
        if (!camera) {
          this.takeNewPhoto();
          this.spinner = false;
          return NEVER;
        }
        return of(camera);
      }))
      .subscribe(camera => {
        this.state.setPhoto(camera);
        this.state.nextStep();
      });
  }

  /**
   * Redirect to page to take new photo
   */
  public takeNewPhoto() {
    const data = {
      useRecentPhoto: true
    };

    const redirectBackUrl = encodeURIComponent(`/take-assessment?useExisting=${JSON.stringify(data)}`);
    this.navCtrl.navigateRoot(`/camera?hideExtraFields=true&returnOnComplete=${redirectBackUrl}`);
  }
}
