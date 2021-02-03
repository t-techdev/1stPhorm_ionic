import { Component, Input, OnInit } from '@angular/core';
import { VideoPart } from '../../../../interfaces';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-message-part-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements OnInit {

  @Input() part: VideoPart;
  loading = true;
  public source = null;

  constructor(
    private http: HttpClient
  ) { }

  ngOnInit() {
    this.http.get(this.part.src, {responseType: 'blob'})
      .subscribe((blob) => {
        this.source = URL.createObjectURL(blob);
        this.loading = false;
      });
  }

}
