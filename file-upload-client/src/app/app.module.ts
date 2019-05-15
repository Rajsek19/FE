import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';

import { AppComponent } from './app.component';
import { UploadModule } from './upload/upload.module';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FlexLayoutModule, UploadModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
