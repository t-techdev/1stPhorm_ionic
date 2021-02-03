import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AssessmentQuestion, NutritionPlan, QuestionOption } from '../../../../interfaces';
import { opt } from '../../../../pages/onboarding/questions';

@Component({
  selector: 'app-subscription-nutrition-plan',
  templateUrl: './subscription-nutrition-plan.component.html',
  styleUrls: ['./subscription-nutrition-plan.component.scss'],
})
export class SubscriptionNutritionPlanComponent implements OnInit {
  @Input() values: any;
  @Output() next = new EventEmitter<any>();
  @Output() updated = new EventEmitter<any>();

  public currentQuestion = 'likely_to_do';

  mainQuestion: AssessmentQuestion = {
    id: 'likely_to_do',
    description: 'Get the most out of your premium subscription with updated Nutrition tracking.',
    title: 'Update Nutrition',
    order: 0,
    options: [
      opt(0, 'Calorie / Macro Counting', NutritionPlan.CalorieMacroCounting, 'Track custom foods & water intake and use personalized or custom macros.', 'icons-maintain'),
      opt(1, 'Macro meal plan', NutritionPlan.MacroMealPlan, 'Plan meals and get better results with tailored portion sizes.', 'icons-meal-plan'),
      opt(2, 'Portion Control', NutritionPlan.PortionControl, 'Choose from select foods in basic portion sizes.', 'icons-portion-control'),
    ]
  };
  mealPerDayQuestion = <AssessmentQuestion>{
    id: 'meals_per_day',
    title: 'How many meals per day?',
    description: 'With three meals per day offers larger portions. You can choose up to five if you want to eat smaller meals throughout the day.',
    order: 0,
    options: [
      opt(0, 'Three', 3, '', 'icons-3-meals'),
      opt(1, 'Four', 4, '', 'icons-4-meals'),
      opt(2, 'Five', 5, '', 'icons-5-meals'),
    ]
  };
  preferenceQuestion = {
    id: 'preference_macro_counting',
    description: 'All plans have a calculated amount of protein and base amounts of carbs and fats. You can split up the remaining calories however you like.',
    title: 'Do you prefer Carbs or Fats?',
    order: 0,
    options: [
      opt(0, 'Split 50-50', 'Both', 'Remaining calories will be split equally between carbs and fats.', 'icons-both'),
      opt(1, 'More Carbs', 'Carbs', 'Remaining calories will be added to carbs. Examples: fruits, veggies, bread, pasta, grains, etc.', 'icons-carbs'),
      opt(2, 'More Fats', 'Fats', 'Remaining calories will be added to fats. Examples: avocados, butter, oil, almonds, nut butters, etc.', 'icons-fats'),
    ]
  };
  public question: AssessmentQuestion;

  constructor() {
  }

  ngOnInit() {
    this.question = this.mainQuestion;
    this.values['likely_to_do'] = this.values.likely_to_do;
    this.values['meals_per_day'] = this.values.meals_per_day;
    this.values['preference_macro_counting'] = this.values.preference_macro_counting;
    this.applyAnswerToQuestion();
  }

  private applyAnswerToQuestion() {
    const options = this.question.options.map((o) => {
      const is_selected = o.value === this.values[this.question.id];
      return {...o, is_selected};
    });
    this.question = {...this.question, options};
  }

  click() {
    if (this.currentQuestion === 'likely_to_do') {
      const currentValue = this.values[this.currentQuestion];
      if (currentValue === NutritionPlan.MacroMealPlan) {
        this.currentQuestion = 'meals_per_day';
        this.question = this.mealPerDayQuestion;
      } else if (currentValue === NutritionPlan.CalorieMacroCounting) {
        this.currentQuestion = 'preference_macro_counting';
        this.question = this.preferenceQuestion;
      }
    } else {
      this.next.emit();
    }
  }

  chooseOption($event: QuestionOption) {
    this.values[this.currentQuestion] = $event.value;
    this.applyAnswerToQuestion();
    this.updated.emit(this.values);
  }
}
