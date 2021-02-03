import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MacrosBarComponent } from './macros-bar/macros-bar.component';
import { VideoPlayerComponent } from './video-player/video-player.component';
import { IonicModule } from '@ionic/angular';
import { AssessmentViewComponent } from './assessment-view/assessment-view.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { AnswersListModule } from './assessment/answers-list/answers-list.module';
import { NutritionDetailModule } from './nutrition-detail/nutrition-detail.module';
import { ProgressComparisonModule } from './progress-comparison/progress-comparison.module';
import { WorkoutModule } from './workout/workout.module';
import { ConvertUnitModule } from '../pipes/convert-unit/convert-unit.module';
import { AdvisorCardComponent } from './advisor-card/advisor-card.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    FormsModule,
    AnswersListModule,
    NutritionDetailModule,
    ProgressComparisonModule,
    WorkoutModule,
    ConvertUnitModule,
  ],
  declarations: [
    MacrosBarComponent,
    VideoPlayerComponent,
    AssessmentViewComponent,
    AdvisorCardComponent,
    ChangePasswordComponent
  ],
  exports: [
    MacrosBarComponent,
    VideoPlayerComponent,
    AssessmentViewComponent,
    AdvisorCardComponent,
    ChangePasswordComponent
  ],
})
export class AppComponentsModule {
}
