import { ModalController, ActionSheetController, LoadingController } from '@ionic/angular';
import { Component, HostListener, OnInit } from '@angular/core';
import { Meal, NutritionService, MacroCountingInfo } from '../../services/nutrition/nutrition.service';
import * as moment from 'moment';
import { CanLeaveRoute } from '../../guards/android-back-button.guard';
import { ToastService } from '../../services/toast-service/toast-service.service';
import { ErrorsService } from '../../services/errors/errors.service';
import { ActivatedRoute } from '@angular/router';
import { AnalyticEvents } from '../../services/analytics/analytic-events.enum';
import { AnalyticsService } from '../../services/analytics/analytics.service';
import { MacroManagementService, MacroCounting } from '../../services/macro-management/macro-management.service';
import { UserService } from '../../services/user/user.service';
import { NutritionCalculatorService } from '../../services/nutrition-calculator/nutrition-calculator.service';
import { CopyMealsDayComponent } from '../../components/nutrition-v2/copy-meals-day/copy-meals-day.component';
import { Transphormer } from '../../interfaces';

@Component({
  selector: 'app-macro',
  templateUrl: './macro.page.html',
  styleUrls: ['./macro.page.scss'],
})
export class MacroPage implements OnInit, CanLeaveRoute {
  public spinner = false;

  public water = 0;
  public macroCounting: MacroCounting;

  public today = moment();

  public transphormer: Transphormer;

  public date = moment();

  public canLeaveAndroidBack = true;

  public isOpenCustomMacro = false;

  constructor(
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController,
    public actionSheetCtrl: ActionSheetController,
    public nutritionService: NutritionService,
    private toastService: ToastService,
    public errorService: ErrorsService,
    public route: ActivatedRoute,
    public analyticService: AnalyticsService,
    private userService: UserService,
    public macroManagement: MacroManagementService,
    public nutritionCalculator: NutritionCalculatorService
  ) {
  }

  async ngOnInit() {
    await this.setupMacro();
    if (this.route.snapshot.queryParams.openCustomMacro) {
      this.isOpenCustomMacro = true;
    }
  }

  public updateMeal(updatedMeal: Meal) {
    this.macroCounting.updateMeal(updatedMeal);

    this.analyticService.logEvent(AnalyticEvents.LoggingNutrition);
  }

  public async updateWaterAmount(water: number) {
    this.spinner = true;

    try {
      this.macroCounting.macroCountingInfo.water_amount += water;

      this.macroCounting.macroCountingInfo = <MacroCountingInfo>await this.nutritionService.updateMacroCountingInfo(this.macroCounting.macroCountingInfo);

    } catch (e) {
      this.toastService.flash(this.errorService.firstError(e));
      this.macroCounting.macroCountingInfo.water_amount -= water;
    } finally {
      this.spinner = false;
    }
  }

  public async resetMacroInfoForDate(date: Date) {
    this.date = moment(date);
    this.spinner = true;
    try {
      this.macroCounting.macroCountingInfo = await this.macroManagement.macroCounting(moment(date));
      const meals = this.macroManagement.setupMeals(this.macroManagement.blankMeal(), this.macroCounting.macroCountingInfo);
      this.macroCounting.meals = meals;
    } catch (e) {
      this.toastService.flash(this.errorService.firstError(e));
    } finally {
      this.spinner = false;
    }
  }

  public async openPopover(ev: any) {
    const actionSheet = await this.actionSheetCtrl.create({
      buttons: [
        {
          text: 'Copy All Meals To',
          handler: () => {
            this.mealCopied(this.macroCounting.meals, false);
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        },
      ],
    });

    await actionSheet.present();
  }

  public async mealCopied(copiedMeals: Meal[], singleMeal = true) {
    const modal = await this.modalCtrl.create({
      component: CopyMealsDayComponent,
      cssClass: 'global-modal-copy-meals',
      componentProps: {
        date: this.date,
        meals: copiedMeals,
        macroCounting: this.macroCounting,
        singleMeal: singleMeal
      },
      backdropDismiss: false
    });

    await modal.present();

    const result = await modal.onDidDismiss();
    if (result.data) {
      this.resetMacroInfoForDate(new Date(result.data));
    }
  }

  private async setupMacro() {
    this.transphormer = this.userService.user;
    this.spinner = true;

    try {
      const result = await this.macroManagement.macros(this.transphormer, true, null, this.date);
      this.macroCounting = new MacroCounting(
        result.weight,
        result.macroCounting,
        result.bmrValues,
        result.meals,
        result.goalValues,
        this.macroManagement,
        this.loadingCtrl,
        this.nutritionService,
        this.toastService,
        this.errorService
      );
    } catch (e) {
      this.toastService.flash(this.errorService.firstError(e));
    } finally {
      this.spinner = false;
    }
  }

  @HostListener('document:backbutton', ['$event'])
  public backButtonHandler($event) {
    $event.preventDefault();
    this.canLeaveAndroidBack = false;
  }

}
