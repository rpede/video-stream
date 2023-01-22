import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { VideosComponent } from './videos/videos.component';
import { CommonModule } from '@angular/common';
import { UploadComponent } from './upload/upload.component';

@NgModule({
  declarations: [AppComponent, VideosComponent, UploadComponent],
  imports: [BrowserModule, HttpClientModule, CommonModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
