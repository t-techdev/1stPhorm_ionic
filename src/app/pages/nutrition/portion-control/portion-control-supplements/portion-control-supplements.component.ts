import { Component, Input, OnInit } from '@angular/core';
import { SimpleNutritionService } from '../../../../services';
import { Store } from '@ngxs/store';
import { ToggleExpandSupplements, ToggleSupplementUsed } from '../../../../store/app.actions';
import { SupplementCustomizeComponent } from '../../supplement-customize/supplement-customize.component';
import { ModalController } from '@ionic/angular';
import { Meal } from '../../../../interfaces';

@Component({
  selector: 'app-portion-control-supplements',
  templateUrl: './portion-control-supplements.component.html',
  styleUrls: ['./portion-control-supplements.component.scss'],
})
export class PortionControlSupplementsComponent implements OnInit {

  @Input() supplements: Meal;

  constructor(
    private simpleNutrition: SimpleNutritionService,
    public modalCtrl: ModalController,
    private store: Store
  ) { }

  ngOnInit() {}

  async customize() {
    const modal = await this.modalCtrl.create({
      component: SupplementCustomizeComponent,
      backdropDismiss: false
    });

    await modal.present();
  }

  updateSelectedNutrition(index: number) {
    this.store.dispatch(new ToggleSupplementUsed(index));
  }

  toggleSupplementExpanded() {
    this.store.dispatch(new ToggleExpandSupplements());
  }
}
