import { AssessmentQuestion, AtHomeWorkoutTypes, NutritionPlan, TrainingLevel } from '../../interfaces';

export const opt = (order: number, title: string, value?: any, description?: string, icon = '', isPremium = false) => {
  if (!value) {
    value = title;
  }
  return { value, title, description, order, icon: icon, isPremium };
};

export const questions: AssessmentQuestion[] = [
  {
    id: 'activity_level',
    description: 'A good way to measure this is by how many steps you average a day (not including any workouts). If you\'re not sure, choose Not Active.',
    title: 'How active are you?',
    order: 0,
    options: [
      {
        value: 'Sedentary',
        title: 'Not Active',
        description: 'Less than 7,000 daily steps.',
        order: 1,
        icon: 'icon-sedentary',
      },
      {
        value: 'Light Activity',
        title: 'Somewhat Active',
        description: 'Less than 15,000 steps per day.',
        order: 2,
        icon: 'icon-somewhat-active'
      },
      {
        value: 'Very Active',
        title: 'Very Active',
        description: 'More than 15,000 steps a day.',
        order: 3,
        icon: 'icon-running'
      }
    ]
  },
  {
    id: 'training_level_past',
    title: 'What\'s your workout history?',
    description: 'Which of these best describes you?',
    order: 0,
    options: [
      opt(0, '', TrainingLevel.Beginner, 'I have not exercised consistently for the past month or more.', 'icon-beginner'),
      opt(1, '', TrainingLevel.Intermediate, 'I have exercised 2-4 times a week for the last month.', 'icon-intermediate'),
      opt(2, '', TrainingLevel.Advanced, 'I have exercised 5 or more times a week for the last month and love a good challenge.', 'icon-advanced'),
    ]
  },
  {
    id: 'training_level',
    title: 'Planning your weekly workouts in the app.',
    description: 'How much time can you commit to your workouts?',
    order: 0,
    options: [
      opt(0, '', TrainingLevel.Beginner, '15-30 minutes a day, 3 to 5 days a week.', 'icon-beginner'),
      opt(1, '', TrainingLevel.Intermediate, '30-45 minutes a day 5 days a week.', 'icon-intermediate'),
      opt(2, '', TrainingLevel.Advanced, '45+ minutes a day, 6 to 7 days a week.', 'icon-advanced'),
    ]
  },
  {
    id: 'likely_to_do_past',
    description: '',
    title: 'What is your current nutrition plan?',
    order: 0,
    options: [
      opt(0, 'No specific plan', 'Nothing', 'Not doing anything right now.', 'icons-no'),
      opt(0, 'Portion Control', NutritionPlan.PortionControl, 'Paying attention mainly to portion sizes of the foods I eat.', 'icons-portion-control'),
      opt(1, 'Macro meal plan', NutritionPlan.MacroMealPlan, 'Planning meals with certain foods and pre-set portions sizes.', 'icons-meal-plan'),
      opt(2, 'Calorie / Macro Counting', NutritionPlan.CalorieMacroCounting, 'Eating whatever I want and logging my food.', 'icons-maintain'),
    ]
  },
  {
    id: 'likely_to_do',
    description: '',
    title: 'How would you like to track your food?',
    order: 0,
    options: [
      opt(0, 'Portion Control', NutritionPlan.PortionControl, 'I just want to get started and learn about choosing the right foods and portion sizes.', 'icons-portion-control'),
      opt(1, 'Macro meal plan', NutritionPlan.MacroMealPlan, 'I’m looking to plan meals and get better results with tailored portion sizes.', 'icons-meal-plan'),
      opt(2, 'Calorie / Macro Counting', NutritionPlan.CalorieMacroCounting, 'I want total control over my nutrition, personalized or custom macros, and flexible tracking.', 'icons-maintain'),
    ]
  },
  {
    id: 'meals_per_day',
    title: 'How many meals per day?',
    description: 'With three meals per day offers larger portions. You can choose up to five if you want to eat smaller meals throughout the day.',
    order: 0,
    options: [
      opt(0, 'Three', 3, '', 'icons-3-meals'),
      opt(1, 'Four', 4, '', 'icons-4-meals'),
      opt(2, 'Five', 5, '', 'icons-5-meals'),
    ]
  },
  {
    id: 'preference_macro_counting',
    description: 'All plans have a calculated amount of protein and base amounts of carbs and fats. You can split up the remaining calories however you like.',
    title: 'Do you prefer Carbs or Fats?',
    order: 0,
    options: [
      opt(0, 'Split 50-50', 'Both', 'Remaining calories will be split equally between carbs and fats.', 'icons-both'),
      opt(1, 'More Carbs', 'Carbs', 'Remaining calories will be added to carbs. Examples: fruits, veggies, bread, pasta, grains, etc.', 'icons-carbs'),
      opt(2, 'More Fats', 'Fats', 'Remaining calories will be added to fats. Examples: avocados, butter, oil, almonds, nut butters, etc.', 'icons-fats'),
    ]
  },
  {
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
  },

];
