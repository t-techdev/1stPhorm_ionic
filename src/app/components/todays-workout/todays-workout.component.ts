import { AfterViewChecked, Component, OnInit } from '@angular/core';
import { DashboardService, DashboardWorkoutSessionInfo } from '../../services/dashboard/dashboard.service';
import * as moment from 'moment';
import * as _ from 'lodash';
import { WorkoutsService } from '../../services/workouts/workouts.service';
import { WorkoutSummary } from '../../pages/dashboard/dashboard.page';

@Component({
  selector: 'app-todays-workout',
  templateUrl: './todays-workout.component.html',
  styleUrls: ['./todays-workout.component.scss'],
})
export class TodaysWorkoutComponent implements OnInit, AfterViewChecked {
  public workoutSession: DashboardWorkoutSessionInfo;
  public workoutSummary: WorkoutSummary[];
  private debouncedWorkoutUpdates;

  constructor(
    private dashboardService: DashboardService,
    private workoutService: WorkoutsService,
  ) {
    this.debouncedWorkoutUpdates = _.debounce(this.setupWorkouts, 15000, {leading: true, trailing: false});
  }

  ngAfterViewChecked() {
    this.debouncedWorkoutUpdates();
  }

  public async setupWorkouts() {
    // We want to show "this week" which starts on Monday and ends on Sunday.
    const today = moment().local();
    const dayOfWeek = today.weekday() || 7;
    const firstDay = today.clone().subtract(dayOfWeek - 1, 'day');
    const lastDay = today.clone().add(7 - dayOfWeek, 'day');

    try {
      const recentWorkouts = await this.workoutService.fetchWorkoutSummary(firstDay.toDate(), lastDay.toDate());
      const workoutSummary = [];

      if (Array.isArray(recentWorkouts)) {
        do {
          workoutSummary.push({
            completed: recentWorkouts
              .filter(workout => workout.workout_date === firstDay.format('YYYY-MM-DD'))
              .reduce((a, c) => {
                return a ? a : c.completed;
              }, false),
            future: firstDay.isAfter(today),
            day: firstDay.format('dd')
          });
          firstDay.add(1, 'day');
        }
        while (firstDay <= lastDay);
      }
      if (_.isEqual(this.workoutSummary, workoutSummary)) {
        return;
      }
      this.workoutSummary = workoutSummary;
    } catch (e) {

    }
  }

  ngOnInit() {
    this.dashboardService.dashboard()
      .then((workout: DashboardWorkoutSessionInfo) => {
        this.workoutSession = workout;
      });

    this.setupWorkouts();
  }

}
