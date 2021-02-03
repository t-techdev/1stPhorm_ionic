import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AssessmentQuestion, AtHomeWorkoutTypes, ProgramTypes, QuestionOption } from '../../../../interfaces';
import { opt } from '../../../../pages/onboarding/questions';

@Component({
  selector: 'app-subscription-training-plan',
  templateUrl: './subscription-training-plan.component.html',
  styleUrls: ['./subscription-training-plan.component.scss'],
})
export class SubscriptionTrainingPlanComponent implements OnInit {

  @Input() values: any;

  @Output() next = new EventEmitter<any>();

  @Output() updated = new EventEmitter<any>();

  public question: AssessmentQuestion = {
    id: 'gym_workout_selection',
    description: 'This can be changed at anytime.',
    title: 'Preferred training plan',
    order: 0,
    options: [
      opt(5, 'At-home (no equipment)', AtHomeWorkoutTypes[0].value, 'An at-home workout that requires no special equipment.', 'icons-home'),
      opt(6, 'At-home (DB, KB, bands)', AtHomeWorkoutTypes[1].value, 'An at-home workout for people with dumbbells, kettlebells, or bands.', 'icons-emom'),
      opt(1, 'Traditional', 2, 'A well-rounded training program with a mix of cardio and weights.', 'icons-traditional-training'),
      opt(3, 'Weight Loss', 4, 'Tailored for weight loss.', 'icons-weight-loss'),
      opt(4, 'Strength Training', 9, 'Designed with specific programs to increase strength and performance. ', 'icons-strength-trainings'),
      opt(0, 'EMOM', 1, 'High intensity interval workouts for all fitness levels.', 'icons-emom'),
      opt(2, 'Cross Training', 3, 'A mix of several modes of training to promote well-rounded health and performance.', 'icons-cross-training'),
    ]
  };
  selectedValue: ProgramTypes;

  constructor() {
  }

  ngOnInit() {
    this.selectedValue = this.values.gym_workout_selection;
  }

  chooseOption($event: QuestionOption) {
    this.selectedValue = +$event.value;
    this.updated.emit({gym_workout_selection: +$event.value});
  }

  click() {
    this.next.emit();
  }
}
