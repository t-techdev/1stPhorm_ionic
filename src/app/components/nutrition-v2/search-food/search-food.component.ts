import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FoodItem } from '../../../services/nutrition/nutrition.service';
import { forkJoin, Subscription } from 'rxjs';
import { BrandedFood, CommonDetail, CommonDetailFood, NutritionixService } from '../../../services/third-party/nutritionix.service';
import { CustomFoodTemplate, CustomFoodTemplateService } from '../../../services/custom-food-template/custom-food-template.service';
import { MealTemplate, MealTemplatesService } from '../../../services/meal-templates/meal-templates.service';
import { Platform } from '@ionic/angular';

@Component({
  selector: 'app-search-food',
  templateUrl: './search-food.component.html',
  styleUrls: ['./search-food.component.scss'],
})
export class SearchFoodComponent implements OnInit {
  
  @Output()
  public addMealTemplate: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public openCustomFood: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public openCommonFood: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public openBrandedFood: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public createFood: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public searchContentChange: EventEmitter<any> = new EventEmitter<any>();

  @Output()
  public scanBarcode: EventEmitter<any> = new EventEmitter<any>();

  private searchSubscription: Subscription;
  public searchValue = '';
  public foodItem: FoodItem;
  public searchFocused = false;
  public showMore = false;
  
  public searchResults: {
    branded: BrandedFood[],
    common: any[],
    customFood: CustomFoodTemplate[],
    meals: any[],
    totalFoodList: {
      type: 'custom' | 'branded' | 'common' | 'meal';
      typeId: 1 | 2 | 3 | 4;
      data: BrandedFood | CustomFoodTemplate | MealTemplate<FoodItem> | any;
    }[]
  } = {
    branded: [],
    common: [],
    customFood: [],
    totalFoodList: [],
    meals: [],
  };
  public isLoaded = false;

  constructor(
    private customFoodTemplateService: CustomFoodTemplateService,
    public nutritioninxService: NutritionixService,
    public mealTemplateService: MealTemplatesService,
    public platform: Platform
  ) { }

  ngOnInit() {}

  public async searchContentChangeEvent() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }

    this.showMore = false;
    this.isLoaded = false;

    if (this.searchValue.trim() === '') {
      this.searchResults.branded = [];
      this.searchResults.customFood = [];
      this.searchResults.common = [];
      this.searchResults.meals = [];
      this.searchResults.totalFoodList = [];

      this.searchContentChange.emit(false);
    } else {
      this.isLoaded = true;
      this.searchSubscription = forkJoin(
        this.nutritioninxService.search(this.searchValue),
        this.customFoodTemplateService.searchTemplate(this.searchValue),
        this.mealTemplateService.list(this.searchValue)
      ).subscribe(results => {
        this.searchResults.branded = results[0].branded;
        this.searchResults.common = results[0].common;
        this.searchResults.customFood = <CustomFoodTemplate[]>results[1];
        this.searchResults.meals = <MealTemplate<FoodItem>[]>results[2];
        this.setTotalItems();

        this.isLoaded = false;
        this.searchContentChange.emit(this.searchValue !== "" || this.hasSearchResults);
      }, err => {
        this.isLoaded = false;
      });
      this.searchContentChange.emit(true);
    }
  }

  public get hasSearchResults(): boolean {
    return this.searchResults.branded.length > 0
      || this.searchResults.customFood.length > 0
      || this.searchResults.meals.length > 0
      || this.searchResults.common.length > 0;
  }

  public setTotalItems() {
    this.searchResults.totalFoodList = [];
    const searchTerm = this.searchValue.trim().toLowerCase();
    if (searchTerm.indexOf('1stphorm') !== -1) {
      searchTerm.replace('1stphorm', '1st phorm');
    }

    const matchesBranded = this.searchResults.branded.some(function (i: BrandedFood) {
      return i.brand_name !== '' && searchTerm.indexOf(i.brand_name.toLowerCase()) !== -1;
    });

    this.searchResults.customFood.forEach(food => {
      this.searchResults.totalFoodList.push({
        type: 'custom',
        typeId: 1,
        data: food
      });
    });

    this.searchResults.meals.forEach(food => {
      this.searchResults.totalFoodList.push({
        type: 'meal',
        typeId: 4,
        data: food
      });
    });

    if (matchesBranded) {
      this.searchResults.branded.forEach(food => {
        this.searchResults.totalFoodList.push({
          type: 'branded',
          typeId: 2,
          data: food
        });
      });
    }

    this.searchResults.common.forEach(food => {
      this.searchResults.totalFoodList.push({
        type: 'common',
        typeId: 3,
        data: food
      });
    });

    if (!matchesBranded) {
      this.searchResults.branded.forEach(food => {
        this.searchResults.totalFoodList.push({
          type: 'branded',
          typeId: 2,
          data: food
        });
      });
    }

  }

  public formatNumber(num: number) {
    return Number.isInteger(num) ? num : num.toFixed(2);
  }

}
