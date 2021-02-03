import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { UserService } from '../services';
import { mergeMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Unauthenticated implements CanActivate {
  constructor(
    private route: Router,
    private user: UserService,
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot) {
    return this.user.user$.pipe(
      mergeMap((user) => {
        if (user !== null) {
          return of(this.route.parseUrl('/dashboard'));
        }
        return of(true);
      }),
    );

  }
}
