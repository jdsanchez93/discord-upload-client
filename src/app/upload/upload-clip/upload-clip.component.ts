import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { switchMap } from 'rxjs';
import { UploadService } from '../upload.service';

@Component({
  selector: 'app-upload-clip',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule
  ],
  templateUrl: './upload-clip.component.html',
  styleUrl: './upload-clip.component.scss'
})
export class UploadClipComponent {
  fileToUpload: File | null = null;
  preview: any;

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
        switchMap((uploadUrl) => this.uploadService.uploadFile(uploadUrl, this.fileToUpload!))
      )
      .subscribe();
  }
}
