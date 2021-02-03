import { Inject, Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';
import { merge } from 'lodash';
import { Platform } from '@ionic/angular';
import { RollbarService } from '../../rollbar';
import * as Rollbar from 'rollbar';
import { mapGoalWeightUnit, mapWeightUnit } from '../../helpers/map-unit-helper';
import { UserService } from '../user/user.service';
import { BaseInfo, Goal, NutritionValues, OnBoarding, PersonalInfo, ContactInfo, TransphormationGoalTypes, Transphormer } from '../../interfaces';
import { ErrorFormat } from '../../interfaces/errors';

@Injectable({
  providedIn: 'root'
})
export class OnboardingService extends BaseService {

  private onboardingState = {};
  private baseInfo: BaseInfo;
  public personalInfo: PersonalInfo;
  public contactInfo: ContactInfo;

  constructor(
    protected http: HttpClient,
    protected platform: Platform,
    protected userService: UserService,
    @Inject(RollbarService) public rollbar: Rollbar
  ) {
    super(http, platform, userService, rollbar);
    OnboardingService.SET_PLATFORM(platform);
    OnboardingService.SET_ROLLBAR(rollbar);
  }

  public addBaseInfo(answers: BaseInfo) {
    this.baseInfo = answers;
  }

  public addPersonalInfo(answers: PersonalInfo) {
    answers.goal_weight_unit = answers.unit_type;
    answers.transphormation_goal = determineTransphormationGoal(answers.weight, answers.goal_weight);
    this.personalInfo = answers;
  }

  public addContactInfo(answers: ContactInfo) {
    this.contactInfo = answers;
  }

  public finishOnboarding() {
    return this.saveOnBoard(this.personalInfo, this.baseInfo, this.contactInfo);
  }

  /**
   * Service to store onboarding data
   *
   * @param personalInfo
   * @param baseInfo
   * @param contactInfo
   */
  public saveOnBoard(
    personalInfo: PersonalInfo,
    baseInfo: BaseInfo,
    contactInfo: ContactInfo
  ): Promise<Transphormer | ErrorFormat> {
    const data: OnBoarding = merge({}, personalInfo, baseInfo, contactInfo);
    return this.http
      .post<Transphormer>(
      OnboardingService.Url('onboarding'),
      data,
      OnboardingService.BaseOptions()
      )
      .toPromise()
      .then(transphormer => {
        if (transphormer.latest_weight) {
          transphormer.latest_weight = mapWeightUnit(transphormer.latest_weight);
        }
        if (transphormer.starting_weight) {
          transphormer.starting_weight = mapWeightUnit(transphormer.starting_weight);
        }
        transphormer = mapGoalWeightUnit(transphormer);
        this.saveTransphormer(transphormer);
        return transphormer;
      })
      .catch(OnboardingService.HandleError);
  }

  public get nutritionChoice(): NutritionValues {
    return (this.onboardingState as any).likely_to_do || 'Macro meal plan';
  }

  /**
   * Fetches the transphormer data
   */
  public fetchOnBoard(): Promise<Transphormer | ErrorFormat> {
    return this.http.get<Transphormer>(OnboardingService.Url('onboarding'), OnboardingService.BaseOptions())
      .toPromise()
      .then(result => {
        if (result.latest_weight) {
          result.latest_weight = mapWeightUnit(result.latest_weight);
        }
        if (result.starting_weight) {
          result.starting_weight = mapWeightUnit(result.starting_weight);
        }
        result = mapGoalWeightUnit(result);
        this.saveTransphormer(result);
        return result;
      })
      .catch(OnboardingService.HandleError);
  }

  public updateOnBoardInformation(data: OnBoarding): Promise<Transphormer | ErrorFormat> {
    return this.http.put<Transphormer>(OnboardingService.Url('onboarding'), data, OnboardingService.BaseOptions())
      .toPromise()
      .then(result => {
        if (result.latest_weight) {
          result.latest_weight = mapWeightUnit(result.latest_weight);
        }
        if (result.starting_weight) {
          result.starting_weight = mapWeightUnit(result.starting_weight);
        }
        result = mapGoalWeightUnit(result);
        this.saveTransphormer(result);
        return result;
      })
      .catch(OnboardingService.HandleError);
  }
}

export function determineTransphormationGoal(startWeight: number, goalWeight: number): TransphormationGoalTypes {
  const weightDifference = startWeight - goalWeight;
  if (Math.abs(weightDifference) <= 3) {
    return Goal.Maintain;
  }
  return startWeight > goalWeight ? Goal.Lose : Goal.Gain;
}
