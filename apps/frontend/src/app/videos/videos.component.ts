import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Video } from '@video-stream/interface';

@Component({
  selector: 'video-stream-videos',
  templateUrl: './videos.component.html',
})
export class VideosComponent {
  public readonly videos = this.http.get<Video[]>('/api/videos');

  constructor(private readonly http: HttpClient) {}
}
