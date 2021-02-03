import { Component, Input, OnInit } from '@angular/core';
import { CameraPhotos } from '../../../interfaces';

@Component({
  selector: 'app-photo-preview',
  templateUrl: './photo-preview.component.html',
  styleUrls: ['./photo-preview.component.scss'],
})
export class PhotoPreviewComponent implements OnInit {

  @Input()
  public photo: CameraPhotos;

  constructor() {
  }

  ngOnInit() {
  }

}
