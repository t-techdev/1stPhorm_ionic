import { Action, Selector, State, StateContext, StateToken } from '@ngxs/store';

import { LoggedIn, LoggedOut, LoggingIn, LoggingOut } from '../app.actions';
import { Injectable } from '@angular/core';

export const APP_STATE_TOKEN = new StateToken<AppStateModel>('app');

export enum LoggedInState {
  Unknown,
  Yes,
  No
}

export interface AppStateModel {
  loggingIn: boolean;
  loggedIn: LoggedInState;
  loggingOut: boolean;
}

@State<AppStateModel>({
  name: APP_STATE_TOKEN,
  defaults: {
    loggingIn: false,
    loggedIn: LoggedInState.Unknown,
    loggingOut: false,
  }
})
@Injectable({
  providedIn: 'root'
})
export class AppState {
  @Selector()
  static isLoggedIn(state: AppStateModel) {
    return state.loggedIn;
  }

  @Action(LoggedIn)
  loggedIn(ctx: StateContext<AppStateModel>) {
    ctx.setState({
      loggedIn: LoggedInState.Yes,
      loggingIn: false,
      loggingOut: false,
    });
  }

  @Action(LoggingIn)
  loggingIn(ctx: StateContext<AppStateModel>) {
    ctx.setState({
      loggedIn: LoggedInState.No,
      loggingIn: true,
      loggingOut: false,
    });
  }

  @Action(LoggedOut)
  loggedOut(ctx: StateContext<AppStateModel>) {
    ctx.setState({
      loggedIn: LoggedInState.No,
      loggingIn: false,
      loggingOut: false,
    });
  }

  @Action(LoggingOut)
  loggingOut(ctx: StateContext<AppStateModel>) {
    ctx.setState({
      loggedIn: LoggedInState.Yes,
      loggingIn: false,
      loggingOut: true,
    });
  }
}
