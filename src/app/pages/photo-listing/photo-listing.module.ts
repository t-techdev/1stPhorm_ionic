import { ZoomImgComponent } from '../../components/zoom-img/zoom-img.component';
import { ZoomImgModule } from '../../components/zoom-img/zoom-img.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { PhotoListingPage } from './photo-listing.page';

const routes: Routes = [
  {
    path: '',
    component: PhotoListingPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes),
    ZoomImgModule
  ],
  declarations: [PhotoListingPage],
  entryComponents: [ZoomImgComponent]
})
export class PhotoListingPageModule {
}
