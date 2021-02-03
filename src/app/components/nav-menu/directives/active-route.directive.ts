import { Directive, HostBinding, Input } from '@angular/core';
import { Router } from '@angular/router';

@Directive({
  selector: '[appActiveRoute]'
})
export class ActiveRouteDirective {

  @Input()
  public matchRoute = '';

  @Input()
  public matchMulti: string[] = [];

  constructor(
    public activeRoute: Router
  ) {
  }

  @HostBinding('class.active')
  public get active() {
    if (this.matchRoute === '') {
      return false;
    }
    const regEx = new RegExp(this.matchRoute);

    return regEx.test(this.activeRoute.url);
  }

  @HostBinding('class.multi-active')
  public get multiActive() {
    for (const match of this.matchMulti) {
      const exp = new RegExp(match);
      if (exp.test(this.activeRoute.url)) {
        return true;
      }
    }

    return false;
  }
}
