import { Component, ElementRef, Input, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ImagePart, MessagePartComponent } from '../../../../interfaces';
import { File } from '@ionic-native/file/ngx';
import { FileEntry, FileError } from '@ionic-native/file';
import { HttpClient } from '@angular/common/http';
import { IonImg, IonInput, Platform } from '@ionic/angular';

@Component({
  selector: 'app-message-part-image',
  templateUrl: './image.component.html',
  styleUrls: ['./image.component.scss'],
})
export class ImageComponent implements MessagePartComponent, OnInit {

  @ViewChild('img', {read: ElementRef}) public imageRef: ElementRef<IonImg>;

  @Input() part: ImagePart;

  private loading = false;

  private localUri = null;

  constructor(
    private file: File,
    private http: HttpClient,
    private platform: Platform
  ) {
  }

  async ngOnInit() {
    // I am disabling this for now since it doesn't seem to work and it is hard to test this since
    // this only works on mobile devices.
    // try {
    //   const file = await this.getLocalFile();
    //   console.log(file);
    //   if (file) {
    //     this.localUri = file.fullPath;
    //   }
    // } catch (e) {
    //   console.log(e);
    //   this.http.get(this.part.src, {responseType: 'blob', withCredentials: false}).subscribe((value) => {
    //     this.file.writeFile(this.file.dataDirectory, this.part.localPath, value)
    //       .then((fileEntry: FileEntry) => {
    //         console.log(fileEntry);
    //         this.localUri = fileEntry.nativeURL;
    //       })
    //       .catch((e) => {
    //         console.log(e);
    //         this.localUri = this.part.src;
    //       });
    //   });
    // }
  }

  private async getLocalFile(): Promise<FileEntry> {
    const mainDirectory = await this.file.resolveDirectoryUrl(this.file.dataDirectory);
    console.log(mainDirectory);
    const directory = await this.file.getDirectory(mainDirectory, this.part.directory, {create: true});
    console.log(directory);
    const file = await this.file.getFile(directory, this.part.fileName, {});
    console.log(file);
    return file;
  }

  public imageUri(): string {
    if (!this.platform.is('cordova')) {
      return this.part.src;
    } else {

    }
  }

}
