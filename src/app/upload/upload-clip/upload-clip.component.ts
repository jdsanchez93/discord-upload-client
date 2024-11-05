import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { switchMap, tap } from 'rxjs';
import { UploadService } from '../upload.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HttpEventType } from '@angular/common/http';

@Component({
  selector: 'app-upload-clip',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule
  ],
  templateUrl: './upload-clip.component.html',
  styleUrl: './upload-clip.component.scss'
})
export class UploadClipComponent {
  fileToUpload: File | null = null;
  preview: any;
  isUploading: boolean = false;
  uploadProgress: number = 0;

  constructor(private uploadService: UploadService) { }

  handleFileInput(event: Event) {
    let fileList: FileList | null = (event.currentTarget as HTMLInputElement).files;
    if (fileList && fileList.length > 0) {
      this.fileToUpload = fileList[0];

      let reader: FileReader = new FileReader();

      reader.onloadend = (e) => {
        this.preview = reader.result as string;
      };

      reader.readAsDataURL(this.fileToUpload);
    }
  }

  uploadFile() {
    if (this.fileToUpload == null) {
      return;
    }

    this.uploadService.callApiGateway({ fileName: this.fileToUpload.name })
      .pipe(
        tap(() => this.isUploading = true),
        switchMap((uploadUrl) => this.uploadService.uploadFile(uploadUrl, this.fileToUpload!))
      )
      .subscribe(event => {

        if (event.type === HttpEventType.UploadProgress) {
          this.uploadProgress = (event.loaded / event.total!) * 100
          console.log("UploadProgressUploadProgress", event);
        }
        if (event.type === HttpEventType.Response) {
          console.log("completed", event);
          this.isUploading = false;
        }
      });
  }
}
