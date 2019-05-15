import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadComponent } from './upload.component';
import { MatButtonModule, MatDialogModule, MatListModule, MatProgressBarModule, MatTableModule, MatInputModule, MatFormFieldModule, MatPaginatorModule, MatSortModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import { UploadService } from './upload.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule, 
    MatButtonModule, 
    MatDialogModule, 
    MatListModule, 
    FlexLayoutModule,     
    HttpClientModule, 
    BrowserAnimationsModule, 
    MatProgressBarModule,
    MatTableModule,
    MatInputModule,
    MatFormFieldModule,
    MatPaginatorModule,
    MatSortModule
  ],
  declarations: [UploadComponent],
  exports: [UploadComponent],
  providers: [UploadService]
})
export class UploadModule {}
