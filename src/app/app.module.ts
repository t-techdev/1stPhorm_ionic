import { AdvisorService } from './services/advisor/advisor.service';
import { CUSTOM_ELEMENTS_SCHEMA, ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule, HAMMER_GESTURE_CONFIG } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { NgxsModule } from '@ngxs/store';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

import { LogoModule } from './components/logo/logo.module';
import { FilterModule } from './components/filter/filter.module';
import { FirebaseX } from '@ionic-native/firebase-x/ngx';
import { BranchIo } from '@ionic-native/branch-io/ngx';
import { CachingInterceptorService } from './services/interceptors/caching/caching-interceptor.service';
import { Clipboard } from '@ionic-native/clipboard/ngx';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RollbarErrorHandler, rollbarFactory, RollbarService } from './rollbar';
import { BarcodeScanner } from '@ionic-native/barcode-scanner/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { RefreshTokenInterceptor } from './services/interceptors/refresh-token/refresh-token.interceptor';
import { ApiDeprecationInterceptor } from './services/interceptors/api-deprication/api-deprecation.interceptor';
import { InAppPurchase2 } from 'third-party/in-app-purchase-2/ngx';
import { IonicGestureConfig } from './gesture/ionic-gesture-config';
import { NavMenuModule } from './components/nav-menu/nav-menu.module';
import { Crop } from '@ionic-native/crop/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { File } from '@ionic-native/file/ngx';
import { Camera } from '@ionic-native/camera/ngx';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { AuthTokenInterceptor } from './services/interceptors/auth-token-interceptor/auth-token.interceptor';
import { AppInfoService } from './services/app-info/app-info.service';
import { Device } from '@ionic-native/device/ngx';
import { IonicStorageModule } from '@ionic/storage';
import { MediaCapture } from '@ionic-native/media-capture/ngx';

import { environment } from '../environments/environment';
import { InAppPurchaseService } from './services/in-app-purchase/in-app-purchase.service';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
import { NgxsSelectSnapshotModule } from '@ngxs-labs/select-snapshot';
import { AppState, NutritionState } from './store/app.store';
import { SubscriptionState } from './store/states/subscription.state';
import { SupplementsState } from './store/states/supplements.state';
import { PostSubscriptionPopupModule } from './components/post-subscription-popup/post-subscription-popup.module';

const customProviders: any[] = [
  { provide: HTTP_INTERCEPTORS, useClass: CachingInterceptorService, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: RefreshTokenInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ApiDeprecationInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: AuthTokenInterceptor, multi: true },
  { provide: RollbarService, useFactory: rollbarFactory }
];

const customImports: any[] = [];

if (!environment.production) {
  customImports.push(NgxsLoggerPluginModule.forRoot());
} else {
  customImports.push(NgxsLoggerPluginModule.forRoot());
}

if (environment.production) {
  customProviders.push({ provide: ErrorHandler, useClass: RollbarErrorHandler });
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    FilterModule,
    NoopAnimationsModule,
    NavMenuModule,
    PostSubscriptionPopupModule,
    NgxsModule.forRoot([
      AppState,
      NutritionState,
      SubscriptionState,
      SupplementsState,
    ], {developmentMode: !environment.production}),
    NgxsSelectSnapshotModule.forRoot(),
    IonicStorageModule.forRoot(),
    customImports
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Device,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    HttpClientModule,
    LogoModule,
    FirebaseX,
    BranchIo,
    Clipboard,
    Crop,
    ImagePicker,
    File,
    Camera,
    Keyboard,
    ...customProviders,
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: IonicGestureConfig
    },
    BarcodeScanner,
    AppVersion,
    InAppPurchase2,
    AdvisorService,
    AppInfoService,
    InAppPurchaseService,
    MediaCapture,
  ],
  bootstrap: [AppComponent],
  exports: [HttpClientModule, LogoModule, FilterModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {
}
