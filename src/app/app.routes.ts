import { Routes } from '@angular/router';

export const routes: Routes = [
    { path: '', loadComponent: () => import('./upload/upload-clip/upload-clip.component').then(mod => mod.UploadClipComponent) },
    { path: '**', redirectTo: '' }
];
