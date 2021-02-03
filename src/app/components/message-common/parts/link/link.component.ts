import { Component, Input, OnInit } from '@angular/core';
import { LinkPart, MessagePartComponent } from '../../../../interfaces/messages';
import { NavController } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-message-part-link',
  templateUrl: './link.component.html',
  styleUrls: ['./link.component.scss'],
})
export class LinkComponent implements MessagePartComponent, OnInit {

  @Input() part: LinkPart;

  constructor(
    private nav: NavController,
    private iab: InAppBrowser,
  ) { }

  ngOnInit() {}

  public openLink(part: LinkPart, $event) {
    $event.preventDefault();
    if (part.linkType === 'app') {
      this.nav.navigateRoot(part.href);
    } else {
      this.iab.create(part.href, '_system', {location: 'yes'});
    }
  }
}
