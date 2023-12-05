import { Component, ElementRef, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import * as XLSX from 'xlsx';
import { ViewChild } from '@angular/core';
type AOA = any[][];
import { PspFilemanagementService } from '../../../services/psp-filemanagement.service';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { ReconcilationService } from '@services/reconcilation.service';
import { ColumnApi, GridApi } from 'ag-grid-community';

@Component({
  selector: 'app-sample-upload-test',
  templateUrl: './sample-upload-test.component.html',
  styleUrls: ['./sample-upload-test.component.scss']
})
export class SampleUploadTestComponent implements OnInit {
  @ViewChild('myInput') myInputVariable: ElementRef<any>;
  @ViewChild('lkpFrm') public lkpFrm!: NgForm;
  public lookupForm!: FormGroup;
  public data: AOA = [];
  public rowData = [];
  public columnDefs = [];
  public btnTmp: boolean = true;
  public msg: string;
  private fileFormatId: string;
  public fileName: string;
  public arrayListFromFile = [];
  private userId: string;
  public file: any;
  myFiles: any = [];
  pageSizes = [25, 50, 100];
  selectedRows = [];
  pageSize = 25;
  private gridApi: GridApi;
  private columnApi: ColumnApi;
  constructor(private _loader: NgxUiLoaderService, private reconService: ReconcilationService,
    private fb: FormBuilder, private toastr: ToastrService, private pspService: PspFilemanagementService) {
    this.lookupForm = this.forminit();
  }
  // 'LIFECYCLE ID'
  ngOnInit(): void {
    this.msg = '';
    this.userId = sessionStorage.getItem('userId');
    //console.log(this.userId);

  }
  onPageSizeChanged() {
    // this.gridApi.paginationSetPageSize(this.pageSize);
    if (this.gridApi) {
      this.gridApi.paginationSetPageSize(this.pageSize);
    }
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
  }
  forminit() {
    return this.fb.group({
      name: [''],
    });
  }
  onFileChange(evt: any) {
    // this.myFiles = [];
    const file = evt.target.files[0];

    //console.log(evt.target.files)
    //console.log(file)
    this.myFiles = file;
    try {
      this.msg = "";
      this.rowData = [];
      this.columnDefs = [];
      this.fileName = evt.target.files[0].name;
      //console.log(this.fileName);
      if (this.fileName) {

        var fileNamefilterd = this.fileName.split('~')[0];
        //console.log(fileNamefilterd.trim());
        const bodystr =
        {
          fileCode: "",
          fileFormatName: fileNamefilterd.trim(),
          fileName: ""
        }
        try {
          this._loader.start();
          this.pspService.fileNamesSearch(bodystr).subscribe((res: any) => {
            //console.log(res);
            if (res.files.length > 0) {
              this.fileFormatId = res.files[0].fileFormatId;
              var hvalue = this.fileFormatId + ':' + this.fileFormatId;
              const body = {
                hiddenValue: hvalue,
                // fileFormatName: 'safecharge_cl'
              }
              //console.log(body);
              this.pspService.displayFileData(body).subscribe((res: any) => {
                this._loader.stop();
                console.log(res.fileItems.length);
                if (res.fileItems.length != this.arrayListFromFile.length) {
                  this.msg = 'Upload file structure differs from File Definition.please check the File';
                  this.toastr.error(this.msg);
                }
                else {
                  this.btnTmp = false;
                  this._loader.stop();
                }
              });
            } else {
              this.toastr.error('File Definition Not Exist', 'ERROR');
              this.cancel();
              this._loader.stop();
            }
          })
        } catch (ex) {
          this.toastr.error(ex, 'ERROR');
        }
      }
      import('xlsx').then(xlsx => {
        let workBook = null;
        let jsonData = null;
        const reader = new FileReader();
        reader.onload = (event) => {
          const data = reader.result;
          workBook = xlsx.read(data, { type: 'binary' });
          jsonData = workBook.SheetNames.reduce((initial, name) => {
            const sheet = workBook.Sheets[name];
            initial[name] = xlsx.utils.sheet_to_json(sheet);
            return initial;
          }, {});
          this.data = jsonData[Object.keys(jsonData)[0]];
          //console.log(this.data);
          this.rowData = this.data;
          if (this.rowData) {
            this.columnDefs = this.generateColumns(this.rowData);
          }
        };
        reader.readAsBinaryString(evt.target.files[0]);
      });
    } catch (e) {
      //console.log('error', e);
    }
  }
  generateColumns(data: any[]) {
    let columnDefinitions = [];
    this.arrayListFromFile = [];
    data.map(object => {
      Object
        .keys(object)
        .map(key => {
          let mappedColumn = {
            headerName: key.toUpperCase(),
            sortable: true,
            filter: true,
            resizable: true,
            field: key
          }
          columnDefinitions.push(mappedColumn);
        })
    })
    //Remove duplicate columns
    columnDefinitions = columnDefinitions.filter((column, index, self) =>
      index === self.findIndex((colAtIndex) => (
        colAtIndex.field === column.field
      ))
    )

    for (let i = 0; i < columnDefinitions.length; i++) {
      this.arrayListFromFile.push(columnDefinitions[i].headerName);
    }
    //console.log(this.arrayListFromFile);
    return columnDefinitions;
  }
  uploadFile() {
    const formData: FormData = new FormData();
    formData.append('file', this.myFiles);
    try {
      this._loader.start();
      this.reconService.fileUpload(this.userId, formData).subscribe((res: any) => {
        this._loader.stop();
        //console.log(res);
        if (res.status == 200) {
          this.toastr.success('File uplaoded Successfully', 'Success');
          this.cancel();
        }
      });
    } catch (ex) {
      this.toastr.error(ex, 'ERROR');
    }

  }
  cancel() {
    this.btnTmp = true;
    this.rowData = [];
    this.columnDefs = [];
    this.msg = '';
    // this.ngOnInit();
    this.fileName = '';
    this.lkpFrm.resetForm();
    this.myFiles = [];
    // //console.log(this.myInputVariable.nativeElement.files);
    // this.myInput.nativeElement.value = "";
  }
}
