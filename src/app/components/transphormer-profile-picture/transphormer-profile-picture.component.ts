import { AlertController } from '@ionic/angular';
import { Component, Inject, Input } from '@angular/core';
import { Crop } from '@ionic-native/crop/ngx';
import { ImagePicker } from '@ionic-native/image-picker/ngx';
import { File } from '@ionic-native/file/ngx';
import { ProfileService } from '../../services/profile/profile.service';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ToastService } from '../../services/toast-service/toast-service.service';
import { RollbarService } from '../../rollbar';
import * as Rollbar from 'rollbar';

@Component({
  selector: 'transphormer-profile-picture',
  templateUrl: './transphormer-profile-picture.component.html',
  styleUrls: ['./transphormer-profile-picture.component.scss'],
})
export class TransphormerProfilePictureComponent {

  @Input()
  public profileImageUrl: string;

  isLoading = false;

  constructor(
    private crop: Crop,
    private imagePicker: ImagePicker,
    private file: File,
    private profileService: ProfileService,
    private toastService: ToastService,
    private camera: Camera,
    @Inject(RollbarService) private rollbar: Rollbar,
    private alertController: AlertController
  ) {
  }

  async pickImageSourceTypeForPhotoUpload() {
    const alert = await this.alertController.create({
      subHeader: 'Choose how you want to upload the profile picture',
      buttons: [
        {
          text: 'Camera',
          cssClass: 'upload-button',
          handler: () => {
            this.pickImage(this.camera.PictureSourceType.CAMERA);
          }
        }, {
          text: 'Photo Library',
          cssClass: 'upload-button',
          handler: () => {
            this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY);
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            alert.dismiss();
          }
        },
      ]
    });

    await alert.present();
  }

  pickImage(sourceType: number) {

    const options: CameraOptions = {
      quality: 50,
      sourceType: sourceType,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE,
      cameraDirection: this.camera.Direction.FRONT,
      targetWidth: 1000,
    };

    this.camera.getPicture(options)
      .then((imageData) => {
        return this.cropImage(imageData);
      })
      .catch((err) => {
        if (err !== 'No Image Selected') {
          this.rollbar.error(err);
        }
      });
  }

  /**
   * Returns a promise indicating if the app has the rights to read for images
   */
  hasReadPermission(): Promise<boolean> {
    return this.imagePicker.hasReadPermission();
  }

  /**
   * Requests the read image permission to the phone
   */
  requestReadPermission() {
    this.imagePicker.requestReadPermission();
  }

  /**
   * Crops an image given its path
   * @param imgPath the image uri
   */
  cropImage(imgPath: string) {
    return this.crop.crop(imgPath,
      {
        quality: 50,
        targetWidth: 256,
        targetHeight: 256
      })
      .then(newPath => {
        return this.showCroppedImage(newPath.split('?')[0]);
      });
  }

  /**
   * Shows on screen the cropped image
   * @param imagePath the cropped image path
   */
  async showCroppedImage(imagePath: string) {
    this.isLoading = true;
    const splitPath = imagePath.split('/');
    const imageName = splitPath[splitPath.length - 1];
    const filePath = imagePath.split(imageName)[0];

    this.file.readAsDataURL(filePath, imageName).then(imageAsBase64 => {
      this.profileService.uploadProfilePicture(imageAsBase64)
        .then(({profile_picture_url}) => {
          this.isLoading = false;
          this.profileImageUrl = profile_picture_url;
          this.toastService.flash('The profile picture has been saved.');
        })
        .catch((error) => {
          this.isLoading = false;
          this.toastService.flash('Your profile picture could not be uploaded. Try again a bit later.');
        });
    });
  }

}
