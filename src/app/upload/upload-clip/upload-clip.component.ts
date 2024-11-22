import { Component, computed, Signal, signal, WritableSignal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { catchError, of, switchMap, tap } from 'rxjs';
import { UploadService } from '../upload.service';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { HttpEventType } from '@angular/common/http';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-upload-clip',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    DecimalPipe
  ],
  templateUrl: './upload-clip.component.html',
  styleUrl: './upload-clip.component.scss'
})
export class UploadClipComponent {
  fileToUpload: WritableSignal<File | null> = signal(null);
  fileSizeInBytes: Signal<number> = computed(() => this.fileToUpload()?.size ?? 0);
  fileName: Signal<string> = computed(() => this.fileToUpload()?.name ?? '');

  preview: any;
  isUploading: boolean = false;
  uploadProgress = signal(0);

  constructor(private uploadService: UploadService) { }

  handleFileInput(event: Event) {
    let fileList: FileList | null = (event.currentTarget as HTMLInputElement).files;
    if (fileList && fileList.length > 0) {
      this.fileToUpload.set(fileList[0]);

      let reader: FileReader = new FileReader();

      reader.onloadend = (e) => {
        this.preview = reader.result as string;
      };

      reader.readAsDataURL(this.fileToUpload()!);
    }
  }

  uploadFile() {
    if (this.fileToUpload() == null) {
      console.error('No file selected.')
      return;
    }

    this.isUploading = true;
    this.uploadProgress.set(0);

    this.uploadService.callApiGateway({ fileName: this.fileToUpload()!.name })
      .pipe(
        switchMap((uploadUrl) => this.uploadService.uploadFile(uploadUrl, this.fileToUpload()!)),
        tap(event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.uploadProgress.set((event.loaded / event.total!) * 100);
          }
          if (event.type === HttpEventType.Response) {
            this.isUploading = false;
          }
        }),
        catchError(err => {
          console.error(err);
          this.isUploading = false;
          return of();
        })
      )
      .subscribe();
  }
}
