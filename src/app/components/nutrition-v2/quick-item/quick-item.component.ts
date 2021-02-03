import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FoodItem } from '../../../services/nutrition/nutrition.service';
import { FoodItemsService } from '../../../services/food-items/food-items.service';
import { ToastService } from '../../../services/toast-service/toast-service.service';
import { ErrorsService } from '../../../services/errors/errors.service';

@Component({
  selector: 'app-quick-item',
  templateUrl: './quick-item.component.html',
  styleUrls: ['./quick-item.component.scss'],
})
export class QuickItemComponent implements OnInit {
  public spinner = false;

  @Input() public quickItem: FoodItem;

  @Input()
  public nutritionDayId = 0;
  
  @Output() public openEditQuickItem: EventEmitter<any> = new EventEmitter<any>();
  @Output() public removeQuickItem: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private foodItemService: FoodItemsService,
    private toastService: ToastService,
    private errorService: ErrorsService
  ) { }

  ngOnInit() { }

  public async removeItem() {
    this.spinner = true;
    try {
      await this.foodItemService.deleteQuickAddItem(this.quickItem.id, this.nutritionDayId);
      this.removeQuickItem.emit(this.quickItem);
    } catch (e) {
      this.toastService.flash(this.errorService.firstError(e));
    } finally {
      this.spinner = false;
    }
  }
}
