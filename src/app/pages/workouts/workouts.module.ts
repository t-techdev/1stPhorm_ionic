import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { WorkoutsPage } from './workouts.page';
import { TrackerComponent } from './tracker/tracker.component';
import { AddNoteComponent } from './add-note/add-note.component';
import { WorkoutHistoryComponent } from './workout-history/workout-history.component';
import { LogoModule } from '../../components/logo/logo.module';
import { AndroidBackButtonGuard } from '../../guards/android-back-button.guard';
import { CalendarModule } from '../../components/calendar/calendar.module';

const routes: Routes = [
  {
    path: '',
    component: WorkoutsPage,
    canDeactivate: [AndroidBackButtonGuard]
  }
];

@NgModule({
  imports: [
    CommonModule,
    LogoModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    CalendarModule
  ],
  declarations: [WorkoutsPage, TrackerComponent, AddNoteComponent, WorkoutHistoryComponent],
  entryComponents: [TrackerComponent, AddNoteComponent, WorkoutHistoryComponent]
})
export class WorkoutsPageModule {
}
