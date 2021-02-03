import { Component, OnInit } from '@angular/core';
import { ErrorsService } from '../../services/errors/errors.service';
import { ExerciseService } from '../../services/excercise/exercise.service';
import {
  NavController,
  ToastController,
} from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Exercise } from '../../interfaces';

@Component({
  selector: 'app-exercise-view',
  templateUrl: './exercise-view.page.html',
  styleUrls: ['./exercise-view.page.scss'],
})
export class ExerciseViewPage implements OnInit {
  public spinner = false;
  public exercise: Exercise;

  constructor(
    public errorService: ErrorsService,
    private exerciseService: ExerciseService,
    private toastCtrl: ToastController,
    private routing: ActivatedRoute,
    private navCtrl: NavController
  ) {
  }

  ngOnInit() {
    this.getExercise();
  }

  private async getExercise() {
    await this.routing.params.subscribe(async params => {
      this.spinner = true;

      try {
        this.exercise = <Exercise>(
          await this.exerciseService.getExercise(params.id)
        );
      } catch (e) {
        const toast = await this.toastCtrl.create({
          message: this.errorService.firstError(e),
          duration: 3000,
        });
        await toast.present();
      } finally {
        this.spinner = false;
      }
    });
  }

  public goToAlternateExercise(id) {
    this.navCtrl.navigateForward(`/exercises/${id}`);
  }
}
