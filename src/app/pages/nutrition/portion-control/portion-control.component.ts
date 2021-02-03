import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ModalController, NavController } from '@ionic/angular';
import { HelpPopupComponent } from '../help-popup/help-popup.component';
import { UserPreferencesService, UserService } from '../../../services';
import { Select, Store } from '@ngxs/store';
import { NutritionState } from '../../../store/states/nutrition.state';
import { Observable } from 'rxjs';
import { Meal, MealItem, NutritionPlan } from '../../../interfaces';

@Component({
  selector: 'app-portion-control',
  templateUrl: './portion-control.component.html',
  styleUrls: ['./portion-control.component.scss']
})
export class PortionControlComponent implements OnInit {

  @Select(NutritionState.activeNutritionData) public nutritionData$: Observable<any>;
  @Select(NutritionState.activeSupplementData) public activeSupplements$: Observable<any>;

  @Input() activeDate: string;
  @Input() public showAmounts = true;

  @Output() public pickedItem = new EventEmitter<{ meal: Meal, mealItem: MealItem }>();

  constructor(
    public navCtrl: NavController,
    private userService: UserService,
    public modalCtrl: ModalController,
    private prefs: UserPreferencesService,
    private store: Store
  ) {
  }

  ngOnInit() {
    this.showHelpPopup();
  }

  public pickItem(meal: Meal, mealItem: MealItem) {
    this.pickedItem.emit({meal, mealItem});
  }

  public showHelpPopup() {
    const {prefKey, whichContent} = this.userService.user.likely_to_do === NutritionPlan.PortionControl
      ? {prefKey: 'showedPortionControlHelp', whichContent: 'portion'}
      : {prefKey: 'showedMealPlanHelp', whichContent: 'meal'};

    this.prefs.getAsync(prefKey, false)
      .then((value) => {
        if (value) {
          return this.openHelpPopup(whichContent)
            .then(() => {
              this.prefs.set(prefKey, true);
            });
        }
      })
      ;
  }

  public async openHelpPopup(popupType: string) {
    const helpModal = await this.modalCtrl.create({
      component: HelpPopupComponent,
      backdropDismiss: false,
      componentProps: {
        popupType: popupType
      }
    });

    return helpModal.present();
  }

}
