import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { VideosService } from '../../services/videos/videos.service';
import { Video } from '../../interfaces/videos';

@Component({
  selector: 'app-dashboard-video',
  templateUrl: './dashboard-video.component.html',
  styleUrls: ['./dashboard-video.component.scss'],
})
export class DashboardVideoComponent implements OnInit {
  @Input() public readonly = true;
  public latestVideo: Video;
  @Output() public viewVideo = new EventEmitter();

  constructor(
    private videosService: VideosService,
  ) { }

  ngOnInit() {
    this.fetchLiveVideos();
  }

  private fetchLiveVideos() {
    this.videosService.getLatestVideo()
      .then((result: Video) => {
        this.latestVideo = result;
      });
  }

  videoClick() {
    this.viewVideo.emit();
  }
}
