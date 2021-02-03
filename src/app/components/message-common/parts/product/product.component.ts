import { Component, Input, OnInit } from '@angular/core';
import { MessagePartComponent, UrlPart } from '../../../../interfaces/messages';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-message-part-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss'],
})
export class ProductComponent implements MessagePartComponent, OnInit {

  @Input() part: UrlPart;

  constructor(
    private iab: InAppBrowser
  ) {
  }

  ngOnInit() {
  }

  openProductUrl(url: string) {
    this.iab.create(url, '_system', {location: 'yes'});
  }
}
