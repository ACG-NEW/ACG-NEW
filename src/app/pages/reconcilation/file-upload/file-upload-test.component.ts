import { Component, ElementRef, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import * as xlsx from 'xlsx';
import { ViewChild } from '@angular/core';
type AOA = any[][];
import { PspFilemanagementService } from '../../../services/psp-filemanagement.service';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { ReconcilationService } from '@services/reconcilation.service';
import { HttpEventType } from '@angular/common/http';
@Component({
  selector: 'app-file-upload-test',
  templateUrl: './file-upload-test.component.html',
  styleUrls: ['./file-upload-test.component.scss']
})
export class FileUploadTestComponent implements OnInit {
  @ViewChild('myInput') myInputVariable: ElementRef<any>;
  @ViewChild('lkpFrm') public lkpFrm!: NgForm;
  public lookupForm!: FormGroup;
  public data: AOA = [];
  public rowData = [];
  public columnDefs = [];
  public btnTmp: boolean = true;
  public arrayListFromFile = [];
  private userId: string;
  public uploadProgress: number;
  uploadProgressview: string[] = [];
  public file: any;
  myFiles: File[] = [];
  fileName1: string[] = ['', '', '', '', ''];
  numofColumns: number[] = [0, 0, 0, 0, 0];
  fileIndex: number[] = [];
  msg: string[] = ['', '', '', '', ''];
  error: boolean = false;
  constructor(private _loader: NgxUiLoaderService, private reconService: ReconcilationService,
    private fb: FormBuilder, private toastr: ToastrService, private pspService: PspFilemanagementService) {
    this.lookupForm = this.forminit();
  }
  ngOnInit(): void {
    this.msg = [];
    this.userId = sessionStorage.getItem('userId');
  }
  forminit() {
    return this.fb.group({
      name: [''],
    });
  }
  cancelFile(index: number) {
    this.msg[index] = '';
    this.uploadProgressview[index] = '';
    const fileInputs = document.getElementsByClassName('file-upload') as HTMLCollectionOf<HTMLInputElement>;
    fileInputs[index].value = ''
    this.fileIndex.splice(index, 1);
    this.myFiles.splice(index, 1);
    if (this.myFiles.length > 0 && this.hasErrorMessages()) {
      this.btnTmp = false;
    } else {
      this.btnTmp = true;
    }
  }
  onFileChange(evt: any, msgIndex: number) {
    this.btnTmp = false;
    this.fileIndex.push(msgIndex);
    const files = evt.target.files;
    const fileName = files[0].name;
    this.msg[msgIndex] = '';
    const fileExtension = fileName.substring(fileName.lastIndexOf('.') + 1).toLowerCase();
    if (fileExtension === 'csv' && fileName.endsWith('.CSV')) {
      alert('CSV files with uppercase file extension are not allowed.');
      this.cancel();
      return;
    } else if (fileExtension === 'xlsx' && fileName.endsWith('.XLSX')) {
      alert('XLSX files with uppercase file extension are not allowed.');
      this.cancel();
      return;
    } else if (!(fileExtension === 'csv' || fileExtension === 'xlsx')) {
      alert('Only csv and xlsx files are allowed.');
      this.cancel();
      return;
    }
    try {
      const reader = new FileReader();
      reader.onload = async (event) => {
        const data = event.target.result;
        const workBook = xlsx.read(data, { type: 'binary' });
        const sheet = workBook.Sheets[workBook.SheetNames[0]];
        const columnRange = xlsx.utils.decode_range(sheet['!ref']);
        const numColumns = columnRange.e.c + 1;
        if (numColumns <= 1) {
          // this.toastr.error('Could not validate file', 'ERROR');
          this.msg[msgIndex] = 'Could not validate file';
          return;
        }
        try {
          this._loader.start();
          const body = {
            fileName: fileName
          };
          const resp = await this.pspService.getFileColumnsCount(numColumns, body).toPromise();
          if (resp['colCount'][1].value !== "SUCCESS") {
            this.msg[msgIndex] = resp['colCount'][1].value;
            this.btnTmp = this.hasErrorMessages();
            return;
          }
          else {
            this.btnTmp = this.hasErrorMessages(); // Enable the Upload button
            this.myFiles[msgIndex] = files[0];
          }
        } catch (ex) {
          this.toastr.error(ex, 'ERROR');
          this.btnTmp = this.hasErrorMessages();
        } finally {
          this._loader.stop();
        }
      };
      const blob = evt.target.files[0].slice(0, 1024 * 1024);
      reader.readAsBinaryString(blob);
    } catch (e) {
      this.toastr.error(e, 'ERROR');
    }
  }
  hasErrorMessages(): boolean {
    return this.msg.some(msg => msg !== '');
  }


  uploadFile() {
    this.btnTmp = true;
    let completedFileUploads = 0;
    const totalFiles = this.myFiles.length;
    // Define a recursive function to upload files one by one
    const uploadFileRecursive = (index: number) => {
      if (index === totalFiles) {
        // All files uploaded, stop the loader
        this._loader.stop();
        return;
      }
      const formData: FormData = new FormData();
      const currentIndex = this.fileIndex[index];
      this.msg[currentIndex] = '';
      formData.append('file', this.myFiles[index]);
      this.uploadProgress = 0;
      try {
        this._loader.start();
        this.reconService.fileUpload(this.userId, formData).subscribe((event: any) => {
          if (event.type === HttpEventType.UploadProgress) {
            // Update progress in larger intervals or when a certain threshold is reached
            if (event.loaded % 1024 === 0 || event.loaded === event.total) {
              this.uploadProgress = Math.round(100 * event.loaded / event.total);
              this.uploadProgressview[currentIndex] = `Upload progress: ${this.uploadProgress}%`;
            }
          } else if (event.type === HttpEventType.Response) {
            completedFileUploads++;
            if (event.body.error !== undefined && event.body.error !== null) {
              this.uploadProgressview[currentIndex] = "";
              this.msg[currentIndex] = event.body.error;
              this.error = true;
            } else {
              this.msg[currentIndex] = `Uploaded successfully!`;
              this.uploadProgressview[currentIndex] = "";
              this.error = false;

            }
            // Call the next file upload recursively
            uploadFileRecursive(index + 1);
          }
        });
      } catch (ex) {
        this.toastr.error(ex, 'ERROR');
      }
    };
    // Start the recursive file upload process with the first file
    uploadFileRecursive(0);
  }


  cancel() {
    this.btnTmp = true;
    this.rowData = [];
    this.columnDefs = [];
    this.msg = [];
    this.lkpFrm.resetForm();
    this.myFiles = [];
    this.uploadProgressview = [];
    this.fileIndex = [];
    const fileInputs = document.getElementsByClassName('file-upload') as HTMLCollectionOf<HTMLInputElement>;
    for (let i = 0; i < fileInputs.length; i++) {
      fileInputs[i].value = '';
    }
  }
}
