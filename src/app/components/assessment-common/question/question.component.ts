import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AssessmentQuestion, QuestionOption } from '../../../interfaces';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent {

  /**
   * Questions to render
   */
  @Input()
  public question: AssessmentQuestion;

  @Input()
  public value: string | number = null;

  /**
   * Show questions as sekeleton text
   */
  @Input()
  public showSkeleton = false;

  /**
   * Return option selected in the question
   */
  @Output()
  public optionSelected: EventEmitter<QuestionOption> = new EventEmitter<QuestionOption>();

}
