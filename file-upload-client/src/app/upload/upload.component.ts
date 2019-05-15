import { Component, ViewChild } from '@angular/core';
import { MatDialog, MatTableDataSource, MatPaginator } from '@angular/material';

import { UploadService } from './upload.service';
import { forkJoin } from 'rxjs/observable/forkJoin';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent {
 
  @ViewChild('file') file;

  public files: Set<File> = new Set();

  progress;
  canBeClosed = true;
  primaryButtonText = 'Upload';
  showCancelButton = true;
  uploading = false;
  uploadSuccessful = false;
  showUploadBtn = false;

  displayedColumns: string[] = ['First Name', 'Sur Name', 'Issue Count', 'Date Of Birth'];
  public issueLog: IssueLog[] = [];
  issueLogSource: any;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public uploadService: UploadService) {
    this.issueLogSource = new MatTableDataSource(this.issueLog);
  }

  ngOnInit() {
   this.issueLogSource.paginator = this.paginator;
  }

  onFilesAdded() {
    const files: { [key: string]: File } = this.file.nativeElement.files;
    for (let key in files) {
      if (!isNaN(parseInt(key))) {
        if (this.files.size === 0) {
         // this.files = new Set();
        }
        this.files.add(files[key]);
      }
    }
    this.showUploadBtn = this.files.size > 0;
  }

  addFiles() {
    this.file.nativeElement.click();
  }

  clearFiles() {
   this.files.clear();
   this.uploadSuccessful = false;
   this.showUploadBtn = this.files.size > 0;
  }

  uploadFiles() {
    // if everything was uploaded already
    if (this.uploadSuccessful) {
      return null;
    }

    // set the component state to "uploading"
    this.uploading = true;

    // start the upload and save the progress map
    this.progress = this.uploadService.upload(this.files);
    for (const key in this.progress) {
      this.progress[key].progress.subscribe(val => console.log('val >> ', val));
    }

    // convert the progress map into an array
    let allProgressObservables = [];
    for (let key in this.progress) {
      allProgressObservables.push(this.progress[key].progress);
    }

    // Adjust the state variables

    // When all progress-observables are completed...
    forkJoin(allProgressObservables).subscribe(end => {
      
      // ... the upload was successful...
      this.uploadSuccessful = true;

      // ... and the component is no longer uploading
      this.uploading = false;
      this.readUploadedFiles();
    });
  }

  isCSVFile(file: any) {
    return file.name.endsWith('.csv');
  }

  readUploadedFiles() {
    alert("readUploadedFiles");
    this.files.forEach(file => {
      if (this.isCSVFile(file)) {
        const reader = new FileReader();
        reader.readAsText(file);
        reader.onload = () => {
          let csvData = reader.result;
          console.log(csvData);
          let csvRecordsArray = (<string>csvData).split(/\r\n|\n/);
          let headersRow = this.getTableHeaders(csvRecordsArray);
          this.issueLog = this.getIssueLogInfomation(csvRecordsArray, headersRow.length);
          console.log('issueLog => ' + this.issueLog);
          this.issueLogSource = new MatTableDataSource(this.issueLog);
          this.issueLogSource.paginator = this.paginator;
        };

        reader.onerror = function () {
          alert('Unable to read ' + file);
        };
      } else {
        console.log('Please import valid .csv file.');
      }
    });   

    this.issueLogSource = new MatTableDataSource(this.issueLog);
  }

  applyFilter(filterValue: string) {
    this.issueLogSource.filter = filterValue.trim().toLowerCase();

    if (this.issueLogSource.paginator) {
      this.issueLogSource.paginator.firstPage();
    }
  }

  getTableHeaders(records: any) {
    let tableHeaders = (<string>records[0]).split(',');
    let tableHeaderArray = [];
    for (let j = 0; j < tableHeaders.length; j++) {
      tableHeaderArray.push(tableHeaders[j]);
    }
    return tableHeaderArray;
  }

  getIssueLogInfomation(csvRecordsArray: any, headerLength: any) {
    let dataArr = [];
    for (let i = 1; i < csvRecordsArray.length; i++) {
      let data = (<string>csvRecordsArray[i]).split(',');
      if (data.length == headerLength) {
        console.log('data : ', data);
        let issueLog: IssueLog = {
          firstName: data[0],
          surName: data[1],
          issueCount: data[2],
          dateOfBirth: data[3]
        };
        console.log('issueLog : ', issueLog);
        dataArr.push(issueLog);
      }
    }
    return dataArr;
  }
}

export interface IssueLog {
  firstName: any;
  surName: any;
  issueCount: any;
  dateOfBirth: any;
}