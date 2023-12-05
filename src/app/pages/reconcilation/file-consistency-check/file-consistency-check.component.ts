import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { RunReportClass } from '@modules/modal/runReport.modal';
import { ReconcilationService } from '@services/reconcilation.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SubSink } from 'subsink';
import * as XLSX from 'xlsx';
import { FccPopupComponent } from '../fcc-popup/fcc-popup.component';
import { fccClass } from '../../../modules/modal/fcc.modal';
@Component({
  selector: 'app-file-consistency-check',
  templateUrl: './file-consistency-check.component.html',
  styleUrls: ['./file-consistency-check.component.scss']
})
export class FileConsistencyCheckComponent implements OnInit {
  @ViewChild('filefrm') public filefrm!: NgForm;
  public RowData: Array<any> = [];
  public dataSource: any = [];
  private userId: string;
  public data: any[];
  public fileList: any[];
  public deleteFCCLines = [];
  public modifiedFCCLines = [];
  private object: any = [{
    fcc_duplicate: "FCC_Duplicate_Records",
    fcc_saStatus: "FCC_File_Stats",
    fcc_file_format: "FCC_Format_Records",
    fcc_psp_details: "FCC_PSP_Details",
    fcc_log_folder: "FCC_VIEW_LOG_FILE"
  }];
  private runCls: RunReportClass;
  private duplicateArr = [];
  private name: string;
  private fccCls: fccClass;
  @ViewChild('table') table: MatTable<Element>
  displayedColumns: string[] = [
    'serialNo',
    'psp',
    'pspSubAc',
    'fileName',
    'txnDate',
    'txnType',
    'currency',
    'noofTxns',
    'totalAmount',
    'fees',
    'duplicateRecords',
    'noOfRejectedRecords',
    'viewlog',
    'fileStatus',
    'saStatus',
    'formatConversionStatus',
    'process',
    'delete'
  ];
  constructor(private matDialog: MatDialog, private reconService: ReconcilationService,
    private _loader: NgxUiLoaderService, private _toaster: ToastrService,
    private subSink: SubSink) {
    this.runCls = new RunReportClass();
    this.fccCls = new fccClass();
  }

  ngOnInit(): void {
    // this.refresh()
    this.runCls.dataMap = [];
    this._loader.start();
    this.laodData();

  }
  laodData() {
    this.userId = sessionStorage.getItem('userId');
    if (this.userId) {
      this.getdata(this.userId);
    }
  }
  exportToExcel() {
    const worksheet = XLSX.utils.json_to_sheet(this.dataSource);
    const headers = Object.keys(this.dataSource[0]);
    XLSX.utils.sheet_add_aoa(worksheet, [headers], { origin: 'A1' });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    XLSX.writeFile(workbook, 'FCC.xlsx');
  }
  refresh() {
    if (this.userId) {
      this.ngOnInit();
    }
  }
  open(row: any, i: number, cName: string): void {
    const userId = sessionStorage.getItem('userId');
    if (cName === 'pspSubAc') {
      // console.log(this.object[0].fcc_psp_details);
      this.name = this.object[0].fcc_psp_details;
      this.getPopupData(row, userId, this.name);
    } else if (cName === 'duplicateRecords') {
      this.name = this.object[0].fcc_duplicate;
      this.getPopupData(row, userId, this.name);
    } else if (cName === 'formatConversionStatus') {
      // console.log(this.object[0].fcc_file_format);
      this.name = this.object[0].fcc_file_format;
      this.getPopupData(row, userId, this.name);
    }
    else if (cName === 'saStatus') {
      // console.log(this.object[0].fcc_saStatus);
      this.name = this.object[0].fcc_saStatus;
      this.getPopupData(row, userId, this.name);
    }
    else if (cName === 'viewlog') {
      this.name = this.object[0].fcc_log_folder;
      row.filePath = row.viewLog;
      this.getPopupData(row, userId, this.name);
    }
  }

  getPopupData(row: any, userId: string, fccname: string): void {
    switch (fccname.trim()) {
      case 'FCC_VIEW_LOG_FILE':
        this.duplicateArr = ['pi_file_name'];
        break;
      case 'FCC_Duplicate_Records':
        this.duplicateArr = ['file_name', 'psp_sub_id'];
        break;
      case 'FCC_PSP_Details':
      case 'FCC_Format_Records':
      case 'FCC_File_Stats':
        this.duplicateArr = ['file_name'];
        break;
      default:
        return;
    }
    this.runCls.dataMap = this.getDataMap(row);
    const body = {
      "objectName": fccname
    }
    this.reconService.getFccProcedure(body)
      .toPromise()
      .then((res: any) => {
        this.runCls.objectName = res.objectRegistrationForm.execProcedure;
        if (!this.runCls.objectName) {
          return;
        } else {
          this._loader.start();
          this.subSink.sink = this.reconService.runReport(this.runCls)
            .subscribe((res: any) => {
              this._loader.stop();
              // console.log(res);
              if (res.report) {
                const dialogRef = this.matDialog.open(FccPopupComponent, {
                  width: '11500px',
                  disableClose: true,
                  position: { left: '280px' },
                  data: { data: res.report }
                });
              }
              if (res) {
                if (res.error === '') {
                  this._toaster.info('No data found.', 'Info');
                } if (res.error != '' && res.error != undefined) {
                  this._toaster.error(res.error, 'Error');
                }
              }
            });
        }
      })
      .catch((error) => {
        this._toaster.error(error, 'Error');
      });
  }

  getDataMap(row: any): any[] {
    const dataMap = [];
    for (const item of this.duplicateArr) {
      if (item === 'file_name') {
        dataMap.push({
          key: item,
          value: row.filePath
        });
      }
      if (item === 'psp_sub_id') {
        dataMap.push({
          key: item,
          value: row.pspSubAccountId
        });
      }
      if (item === 'pi_file_name') {
        dataMap.push({
          key: item,
          value: row.viewLog
        });
      }
    }
    return dataMap;
  }
  getdata(userId: string) {
    try {
      this.fccCls.deleteFCCLines = [];
      this.fccCls.modifiedFCCLines = [];
      this.deleteFCCLines = [];
      this.modifiedFCCLines = [];
      this.dataSource = [];
      this.subSink.sink = this.reconService.getFCC(userId).subscribe((res: any) => {
        this._loader.stop();
        // console.log(res.fileList);
        if (res.fileList) {
          this.dataSource = res.fileList;
          // this.changeColor(this.table);1651
        } else {
          this._toaster.warning(res.error, 'Status')
        }
      });
    }
    catch (ex) {
      this._toaster.error(ex, 'ERROR')
    }
  }
  process() {
    try {
      this.fccCls.modifiedFCCLines.forEach(obj => {
        delete obj.checked;
      });
      // console.log(this.fccCls.modifiedFCCLines);
      if (this.fccCls.modifiedFCCLines.length > 0) {
        this._loader.start();
        const modified_data = { "modifiedFCCLines": this.fccCls.modifiedFCCLines }
        // console.log(modified_data);
        this.subSink.sink = this.reconService.processFCC(sessionStorage.getItem('userId'), modified_data).subscribe((res: any) => {
          // console.log(res);
          this._loader.stop();
          if (res.error != undefined && res.error != null) {
            this._toaster.error(res.error, 'ERROR');
          }
          if (res.message != undefined) {
            this._toaster.success(res.message, 'Success');
            this.ngOnInit();
          }
        });
      }
    }
    catch (ex) {
      this._toaster.error(ex, 'ERROR')
    }
  }
  processChk(event, row: any, i: number) {
    if (event.target.checked) {
      row.processFile = true;
      row.deleteFile = false;
      const processedFileNames = new Set();
      this.dataSource.forEach((r) => {
        if (r.fileName === row.fileName && !processedFileNames.has(r.fileName)) {
          this.fccCls.modifiedFCCLines.push(row);
          this.modifiedFCCLines.push(row.fileName);
          r.checked = true;
          processedFileNames.add(r.fileName); // Add fileName to Set of processed fileNames
        }
      });
    } else {
      // row.processFile = true;
      // row.deleteFile = true;
      delete row.processFile;
      delete row.deleteFile;
      const fileName = row.fileName;
      const indexesToRemove = [];
      for (let i = 0; i < this.modifiedFCCLines.length; i++) {
        if (this.modifiedFCCLines[i] === fileName) {
          indexesToRemove.push(i);
        }
      }
      for (let i = indexesToRemove.length - 1; i >= 0; i--) {
        this.modifiedFCCLines.splice(indexesToRemove[i], 1);
        this.fccCls.modifiedFCCLines.splice(indexesToRemove[i], 1);
      }

    }
  }

  deleteChk(event, row, i: number) {
    if (event.target.checked) {
      row.processFile = false;
      row.deleteFile = true;
      const processedFileNames = new Set();
      this.dataSource.forEach((r) => {
        if (r.fileName === row.fileName && !processedFileNames.has(r.fileName)) {
          this.fccCls.modifiedFCCLines.push(row);
          this.deleteFCCLines.push(row.fileName);
          r.checked = true;
          processedFileNames.add(r.fileName); // Add fileName to Set of processed fileNames
        }
      });
    }
    else {
      delete row.processFile;
      delete row.deleteFile;
      const fileName = row.fileName;
      const indexesToRemove = [];
      for (let i = 0; i < this.deleteFCCLines.length; i++) {
        if (this.deleteFCCLines[i] === fileName) {
          indexesToRemove.push(i);
        }
      }
      for (let i = indexesToRemove.length - 1; i >= 0; i--) {
        this.deleteFCCLines.splice(indexesToRemove[i], 1);
        this.fccCls.modifiedFCCLines.splice(indexesToRemove[i], 1);
      }
    }
    // console.log(this.fccCls.modifiedFCCLines);
  }
}
