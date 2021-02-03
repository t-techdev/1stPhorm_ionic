import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Directive({
  selector: '[appExternalLink]'
})
export class ExternalLinkDirective implements OnInit {

  @Input() href: string;

  constructor(
    private iab: InAppBrowser,
    public element: ElementRef
  ) {
    const link = <HTMLLinkElement>this.element.nativeElement;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.iab.create(this.href, '_system', {location: 'yes'});
    });
  }

  ngOnInit() {
    this.element.nativeElement.innerHTML = `${this.element.nativeElement.innerHTML} <ion-icon name="exit"></ion-icon>`;
  }

}
