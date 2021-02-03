import { TestBed } from '@angular/core/testing';
import { NutritionCalculator } from './nutrition-calculator';
import { Goal, Sex, Transphormer } from '../../interfaces';

describe('NutritionCalculator', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  const male = {sex: Sex.Male, transphormation_goal: Goal.Gain};
  const maintain = {sex: Sex.Male, transphormation_goal: Goal.Maintain};
  const female = {sex: Sex.Female, transphormation_goal: Goal.Lose};

  it('should be created', () => {
    const service: NutritionCalculator = new NutritionCalculator(<Transphormer>male, 120, 4);
    expect(service).toBeTruthy();
  });

  it('should return correct base profiles', () => {
    const service: NutritionCalculator = new NutritionCalculator(<Transphormer>male, 120, 4);
    expect(service.getBaseProfile('male', 130)).toBe(0);
    expect(service.getBaseProfile('male', 150)).toBe(1);
    expect(service.getBaseProfile('male', 165)).toBe(2);
    expect(service.getBaseProfile('male', 190)).toBe(3);
    expect(service.getBaseProfile('male', 205)).toBe(4);
    expect(service.getBaseProfile('male', 240)).toBe(5);
    expect(service.getBaseProfile('male', 270)).toBe(6);
  });

  it('should properly modify base profiles with goal', () => {
    const service: NutritionCalculator = new NutritionCalculator(<Transphormer>male, 120, 4);
    expect(service.getModifiedProfile(0, Goal.Lose, 'male')).toBe(0);
    expect(service.getModifiedProfile(0, Goal.Maintain, 'male')).toBe(0);
    expect(service.getModifiedProfile(0, Goal.Gain, 'male')).toBe(1);
    expect(service.getModifiedProfile(NutritionCalculator.MAX_MALE_PROFILE, Goal.Lose, 'male'))
      .toBe(NutritionCalculator.MAX_MALE_PROFILE - 1);
    expect(service.getModifiedProfile(NutritionCalculator.MAX_MALE_PROFILE, Goal.Maintain, 'male'))
      .toBe(NutritionCalculator.MAX_MALE_PROFILE);
    expect(service.getModifiedProfile(NutritionCalculator.MAX_MALE_PROFILE, Goal.Gain, 'male'))
      .toBe(NutritionCalculator.MAX_MALE_PROFILE);

    expect(service.getModifiedProfile(0, Goal.Lose, 'female')).toBe(0);
    expect(service.getModifiedProfile(0, Goal.Maintain, 'female')).toBe(0);
    expect(service.getModifiedProfile(0, Goal.Gain, 'female')).toBe(1);
    expect(service.getModifiedProfile(NutritionCalculator.MAX_FEMALE_PROFILE, Goal.Lose, 'female'))
      .toBe(NutritionCalculator.MAX_FEMALE_PROFILE - 1);
    expect(service.getModifiedProfile(NutritionCalculator.MAX_FEMALE_PROFILE, Goal.Maintain, 'female'))
      .toBe(NutritionCalculator.MAX_FEMALE_PROFILE);
    expect(service.getModifiedProfile(NutritionCalculator.MAX_FEMALE_PROFILE, Goal.Gain, 'female'))
      .toBe(NutritionCalculator.MAX_FEMALE_PROFILE);
  });

  it('should handle loss', () => {
    const service: NutritionCalculator = new NutritionCalculator(<Transphormer>female, 190, 4);
    expect(service.getMacros().calories).toEqual(1821);
    expect(service.getMacros().protein).toEqual(180);
    expect(service.getMacros().fats).toEqual(45);
    expect(service.getMacros().carbs).toEqual(174);
  });

  it('should handle gains', () => {
    const service: NutritionCalculator = new NutritionCalculator(<Transphormer>male, 165, 4);
    expect(service.getMacros().calories).toEqual(2082);
    expect(service.getMacros().protein).toEqual(204);
    expect(service.getMacros().fats).toEqual(50);
    expect(service.getMacros().carbs).toEqual(204);
  });

  it('should handle maintain', () => {
    const service: NutritionCalculator = new NutritionCalculator(<Transphormer>maintain, 240, 4);
    expect(service.getMacros().calories).toEqual(2319);
    expect(service.getMacros().protein).toEqual(240);
    expect(service.getMacros().fats).toEqual(55);
    expect(service.getMacros().carbs).toEqual(216);
  });

});
