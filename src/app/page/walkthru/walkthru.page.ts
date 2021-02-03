import { Component, OnInit, ViewChild } from '@angular/core';
import { BottomMenuService } from '../../services/bottom-menu.service';
import { OnboardingService} from '../../services/onboarding/onboarding.service';
import { UserService } from '../../services/user/user.service';
import { NutritionPlan } from '../../interfaces';

@Component({
  selector: 'app-walkthru',
  templateUrl: './walkthru.page.html',
  styleUrls: ['./walkthru.page.scss'],
})
export class WalkthruPage implements OnInit {
  NutritionPlan = NutritionPlan;
  @ViewChild('slider') public slider: any;
  public isComplete = false;

  constructor(public bottomMenu: BottomMenuService,
              public userService: UserService) { }

  ngOnInit() {}

  ionViewWillEnter() {
    this.bottomMenu.hide();
  }

  getOptions() {
    const ratio =  window.screen.width / window.screen.height;
    return { spaceBetween: -(window.screen.width * ratio * ratio) + (15 * ratio) };
  }

  didChange() {
    return this.slider.isEnd()
      .then(yesOrNo => {
        this.isComplete = yesOrNo;
      });
  }

  ionViewWillLeave() {
    this.bottomMenu.show();
  }

  nextSlide() {
    this.slider.slideNext();
  }
}
