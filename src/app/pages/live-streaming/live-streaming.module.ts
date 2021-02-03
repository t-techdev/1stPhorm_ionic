import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule, IonRefresher } from '@ionic/angular';
import { LiveStreamingPage } from './live-streaming.page';
import { SafeUrlModule } from '../../pipes/safe-url/safe-url.module';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { LogoModule } from '../../components/logo/logo.module';
import { AppComponentsModule } from '../../components/common-components.module';

const routes: Routes = [
  {
    path: '',
    component: LiveStreamingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    SafeUrlModule,
    LogoModule,
    ReactiveFormsModule,
    AppComponentsModule
  ],
  declarations: [LiveStreamingPage],
  entryComponents: [],
  providers: [InAppBrowser, IonRefresher]
})
export class LiveStreamingPageModule {
}
