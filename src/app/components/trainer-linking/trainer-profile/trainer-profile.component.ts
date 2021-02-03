import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Advisor, Transphormer } from '../../../interfaces';

@Component({
  selector: 'app-trainer-profile',
  templateUrl: './trainer-profile.component.html',
  styleUrls: ['./trainer-profile.component.scss'],
})
export class TrainerProfileComponent implements OnInit {

  @Input() public user: Transphormer;
  @Input() public advisor: Advisor;

  @Output() drop: EventEmitter<true> = new EventEmitter<true>();

  constructor(
    private navCtrl: NavController,
  ) { }

  ngOnInit() {
  }

  get canMessage() {
    return this.user.is_paid_user || false;
  }

  public visitFacebook(url) {
    return this.visitUrl(this.checkHttp(url, 'https://www.facebook.com/'));
  }

  public visitTwitter(url) {
    return this.visitUrl(this.checkHttp(url, 'https://www.twitter.com/'));
  }

  public visitPinterest(url) {
    return this.visitUrl(this.checkHttp(url, 'https://www.pinterest.com/'));
  }

  public visitInstagram(url) {
    return this.visitUrl(this.checkHttp(url, 'https://www.instagram.com/'));
  }

  public visitYoutube(url) {
    return this.visitUrl(
      this.checkHttp(url, 'https://www.youtube.com/results?search_query=')
    );
  }

  public visitLinkedIn(url) {
    return this.visitUrl(this.checkHttp(url, 'https://www.linkedin.com/in/'));
  }

  public visitUrl(url) {
    window.open(url, '_system', 'location=yes');
    return false;
  }

  public chat() {
    this.navCtrl.navigateRoot('messages');
  }

  private checkHttp(url, prepend) {
    if (url.indexOf('http') === -1) {
      return prepend + url;
    }
    return url;
  }

  public dropAdvisor() {
    this.drop.emit(true);
  }
}
