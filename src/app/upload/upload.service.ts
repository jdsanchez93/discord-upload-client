import { HttpClient, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { }

  public callApiGateway(uploadData: UploadData): Observable<string> {
    return this.http.put<string>('api/upload', uploadData);
  }

  public uploadFile(uploadUrl: string, file: File): Observable<HttpEvent<any>> {
    return this.http.put(uploadUrl, file, {
      reportProgress: true,
      observe: "events"
    });
  }
}

interface UploadData {
  fileName: string;
}
