import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhotoPreviewComponent } from './photo-preview/photo-preview.component';
import { QuestionComponent } from './question/question.component';
import { StepCounterComponent } from './step-counter/step-counter.component';
import { IonicModule } from '@ionic/angular';
import { QuestionOptionComponent } from './question-option/question-option.component';

@NgModule({
  declarations: [
    PhotoPreviewComponent,
    QuestionComponent,
    QuestionOptionComponent,
    StepCounterComponent
  ],
  imports: [
    CommonModule,
    IonicModule
  ],
  exports: [
    PhotoPreviewComponent,
    QuestionComponent,
    StepCounterComponent
  ],
})
export class AssessmentCommonModule { }
