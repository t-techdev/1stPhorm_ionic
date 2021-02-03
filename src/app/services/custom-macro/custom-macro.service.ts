import { Inject, Injectable } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';
import { AlertController, NavController, Platform } from '@ionic/angular';
import * as moment from 'moment';
import { RollbarService } from '../../rollbar';
import * as Rollbar from 'rollbar';
import { ConvertWeightPipe } from '../../pipes/convert-unit/pipes/convert-weight/convert-weight.pipe';
import { UserService } from '../user/user.service';
import { UnitTypes } from '../../interfaces/unit-types.enum';
import { mapWeightUnit } from '../../helpers/map-unit-helper';
import { CustomMacro } from '../../interfaces/nutrition';
import { ErrorFormat } from '../../interfaces/errors';

@Injectable({
  providedIn: 'root'
})
export class CustomMacroService extends BaseService {

  constructor(
    public http: HttpClient,
    protected platform: Platform,
    public alertCtrl: AlertController,
    public navCtrl: NavController,
    @Inject(RollbarService) public rollbar: Rollbar,
    public user: UserService
  ) {
    super(http, platform, user, rollbar);
    CustomMacroService.SET_PLATFORM(platform);
    CustomMacroService.SET_ROLLBAR(rollbar);
  }

  /**
   * Returns list of previously created macros
   */
  public history(): Promise<CustomMacro[] | ErrorFormat> {
    return this.http.get<CustomMacro[]>(
      CustomMacroService.Url('nutritions/custom-macros'),
      CustomMacroService.BaseOptions(true, true)
    )
      .toPromise()
      .then(result => result.map(macro => {
        macro.edit_date = moment(macro.edit_date);
        return macro;
      }))
      .catch(CustomMacroService.HandleError);
  }

  /**
   * Creates new custom macro record
   *
   * @param reset_to_original
   * @param protein
   * @param carbs
   * @param fats
   * @param date
   */
  public create(
    reset_to_original: boolean, protein: number, carbs: number, fats: number, date: string
  ): Promise<CustomMacro | ErrorFormat> {
    const data = {
      reset_to_original,
      carbs,
      fats,
      protein,
      date
    };
    return this.http.post<CustomMacro>(CustomMacroService.Url('nutritions/custom-macros'), data, CustomMacroService.BaseOptions())
      .toPromise()
      .then(result => {
        result.edit_date = moment(result.edit_date);
        return result;
      })
      .catch(CustomMacroService.HandleError);
  }

  /**
   * Action to update existing custom macro record
   * @param id
   * @param reset_to_original
   * @param protein
   * @param carbs
   * @param fats
   */
  public update(
    id: number, reset_to_original: boolean, protein: number, carbs: number, fats: number
  ): Promise<CustomMacro | ErrorFormat> {
    const data = {
      reset_to_original,
      carbs,
      fats,
      protein
    };
    return this.http.patch<CustomMacro>(
      CustomMacroService.Url(`nutritions/custom-macros/${id}`), data, CustomMacroService.BaseOptions()
    )
      .toPromise()
      .then(result => {
        result.edit_date = moment(result.edit_date);
        return result;
      })
      .catch(CustomMacroService.HandleError);
  }

  /**
   * Returns the latest custom macro
   */
  public latestMacro(): Promise<CustomMacro | null | ErrorFormat> {
    return this.http.get<CustomMacro | null>(
      CustomMacroService.Url('nutritions/custom-macros/latest'), CustomMacroService.BaseOptions()
    )
      .toPromise()
      .then<CustomMacro | null>(result => {
        if (result.id) {
          result.edit_date = moment(result.edit_date);
          result.base_weight = mapWeightUnit(result.base_weight);
          return result;
        } else {
          return null;
        }
      })
      .catch(CustomMacroService.HandleError);
  }

  /**
   * Notifying the user to update custom macro values if transphormer is doing calorie counting and has set custom macro with weigh diff
   * to base weight more than 10
   * @param newWeight
   */
  public async notifyToUpdateMacro(newWeight: number) {
    const transphormer = this.user.user;

    // checking if transphormer is doing calories counting and is not in standard macro
    if (transphormer.likely_to_do !== 'Calorie / Macro counting') {
      return;
    }

    let latestMacro = <CustomMacro>await this.latestMacro();
    latestMacro = latestMacro || <CustomMacro>{reset_to_original: true};

    if (latestMacro.reset_to_original) {
      return;
    }

    const convertWeight = new ConvertWeightPipe(this.user);

    const diff = newWeight - parseFloat(convertWeight.transform(latestMacro.base_weight));

    if (this.checkDiffBasedOnUnit(Math.abs(diff))) {
      return;
    }

    const alert = await this.alertCtrl.create({
      header: 'Update your macros',
      message: `You have ${diff > 0 ? 'gained' : 'lost'} ${this.user.unitType() === UnitTypes.Imperial ? '10' : '5'} ${this.user.unitTypeLabel('weight')} or more. You should update your macros.`,
      backdropDismiss: false,
      buttons: [{
        text: 'Later',
        cssClass: 'global-danger',
      }, {
        text: 'Let\'s do it',
        handler: () => {
          this.navCtrl.navigateRoot('macro?openCustomMacro=true');
        }
      }]
    });

    await alert.present();
  }

  /**
   * Check if difference is less than expected value.
   * @param diff
   */
  private checkDiffBasedOnUnit(diff: number): boolean {
    if (this.user.unitType() === UnitTypes.Imperial) {
      return diff < 10;
    }

    return diff < 5;
  }
}
