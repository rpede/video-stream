import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Video } from '@video-stream/interface';

@Component({
  selector: 'video-stream-videos',
  templateUrl: './videos.component.html',
})
export class VideosComponent implements OnInit {
  public videos = this.http.get<Video[]>('/api/video');

  constructor(private readonly http: HttpClient) {
  }

  ngOnInit(): void {
    this.load();
  }

  load() {
    this.videos = this.http.get<Video[]>('/api/video');
  }
}
