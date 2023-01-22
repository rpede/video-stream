import { HttpClient, HttpEventType } from '@angular/common/http';
import { Component, Input } from '@angular/core';
import { finalize, Subscription } from 'rxjs';

@Component({
  selector: 'video-stream-upload',
  templateUrl: './upload.component.html'
})
export class UploadComponent {
  @Input()
  requiredFileType: string | undefined;

  fileName = '';
  uploadProgress?: number;
  uploadSub?: Subscription;

  constructor(private http: HttpClient) {}

  onFileSelected(event: Event) {
    const file: File = (event.target as any).files[0];

    if (file) {
      this.fileName = file.name;
      const formData = new FormData();
      formData.append('thumbnail', file);

      const upload$ = this.http
        .post('/api/upload', formData, {
          reportProgress: true,
          observe: 'events',
        })
        .pipe(finalize(() => this.reset()));

      this.uploadSub = upload$.subscribe((event) => {
        if (event.type == HttpEventType.UploadProgress) {
          this.uploadProgress = Math.round(
            100 * (event.loaded / (event.total ?? 0))
          );
        }
      });
    }
  }

  cancelUpload() {
    this.uploadSub?.unsubscribe();
    this.reset();
  }

  reset() {
    this.uploadProgress = undefined;
    this.uploadSub = undefined;
  }
}
