import { Inject, Injectable } from '@angular/core';
import { ActionSheetController, Platform } from '@ionic/angular';
import { Camera, CameraOptions, MediaType } from '@ionic-native/camera/ngx';
import { RollbarService } from '../../rollbar';
import * as Rollbar from 'rollbar';
import { MediaCapture, CaptureVideoOptions } from '@ionic-native/media-capture/ngx';
import { UrlHandlerCallback } from '../../interfaces';

@Injectable({
  providedIn: 'root'
})
export class MediaAdderService {

  constructor(
    @Inject(RollbarService) private rollbar: Rollbar,
    private camera: Camera,
    private mediaCapture: MediaCapture,
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform,
  ) {
  }

  private pickFromGallery(mediaType: MediaType) {
    const options: CameraOptions = {
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
      mediaType: mediaType,
      targetWidth: 1000,
    };

    return this.pickImage(options);
  }

  private takePicture() {
    const options: CameraOptions = {
      quality: 50,
      sourceType: this.camera.PictureSourceType.CAMERA,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      cameraDirection: this.camera.Direction.FRONT,
      targetWidth: 1000,
    };

    return this.pickImage(options);
  }

  private async pickImage(options: CameraOptions) {
    try {
      return await this.camera.getPicture(options);
    } catch (err) {
      if (err !== 'No Image Selected') {
        this.rollbar.error(err);
      }
      return null;
    }
  }

  showActionSheet(urlHandler: UrlHandlerCallback) {
    return this.actionSheetCtrl.create({
      header: 'Send picture or video',
      buttons: [
        {
          text: 'Select image from Gallery',
          handler: () => {
            this.pickFromGallery(MediaType.PICTURE)
              .then(media => urlHandler(media))
              .catch(err => this.rollbar.error(err));
          },
        },
        {
          text: 'Select video from Gallery',
          handler: () => {
            this.pickFromGallery(MediaType.VIDEO)
              .then(media => {
                urlHandler(media);
              })
              .catch(err => this.rollbar.error(err));
          },
        },
        {
          text: 'Take Picture',
          handler: () => {
            this.takePicture()
              .then(media => urlHandler(media))
              .catch(err => this.rollbar.error(err));
          },
        },
        {
          text: 'Record Video',
          handler: () => {
            this.recordVideo()
              .then(media => urlHandler(media))
              .catch(err => this.rollbar.error(err));
          },
        },
        {
          text: 'Cancel',
          role: 'cancel'
        },
      ],
    });
  }

  private async recordVideo() {
    const options: CaptureVideoOptions = {
      limit: 1,
      duration: 300,
    };

    try {
      const media = await this.mediaCapture.captureVideo(options);
      if (Array.isArray(media) && media.length) {
        const fullPath = media[0].fullPath;
        // Per https://github.com/apache/cordova-plugin-media-capture/issues/135#issuecomment-503806273
        // if (this.platform.is('ios')) {
        //   return 'file://' + fullPath;
        // }
        return fullPath;
      } else {
        throw media;
      }
    } catch (err) {
      this.rollbar.error(err);
    }
  }
}
