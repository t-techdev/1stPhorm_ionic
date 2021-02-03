import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BottomMenuService {
  public visible$ = new BehaviorSubject(true);

  constructor() { }

  hide() {
    this.visible$.next(false);
  }

  show() {
    this.visible$.next(true);
  }

  get isVisible() {
    return this.visible$.getValue();
  }
}
