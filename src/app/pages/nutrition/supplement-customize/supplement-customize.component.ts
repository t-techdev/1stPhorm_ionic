import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { UserPreferencesService } from '../../../services/user-preferences.service';
import { SimpleNutritionService } from '../../../services/simple-nutrition.service';
import { Store } from '@ngxs/store';
import { SupplementsState } from '../../../store/states/supplements.state';
import { ApplySupplementConfiguration } from '../../../store/actions/supplements.actions';
import { MealItem } from '../../../interfaces/simple-nutrition';

@Component({
  selector: 'app-supplement-customize',
  templateUrl: './supplement-customize.component.html',
  styleUrls: ['./supplement-customize.component.scss'],
})
export class SupplementCustomizeComponent implements OnInit {

  supplements: MealItem[] = [];

  constructor(
    public modalCtrl: ModalController,
    private prefs: UserPreferencesService,
    private nutrition: SimpleNutritionService,
    private store: Store,
  ) {
  }

  async ngOnInit() {
    const data = this.store.selectSnapshot<MealItem[]>(SupplementsState.supplements);

    this.supplements = this.store.selectSnapshot<MealItem[]>(SupplementsState.allSupplements)
      .map(i => {
        const config = data.find(configItem => configItem.name === i.name);
        const newItem = Object.assign({}, i);
        if (config) {
          newItem.use = config.use;
        }
        return newItem;
      });
  }

  public close() {
    this.modalCtrl.dismiss();
  }

  public updateSupplements() {
    this.store.dispatch(new ApplySupplementConfiguration(this.supplements));
    this.modalCtrl.dismiss(this.supplements);
  }
}
