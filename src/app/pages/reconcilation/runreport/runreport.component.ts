import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { ReconcilationService } from '../../../services/reconcilation.service';
import { RunReportClass } from '../../../modules/modal/runReport.modal';
import { DatePipe } from '@angular/common';
import { GridApi, ColumnApi, GridOptions } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { FccPopupComponent } from '../fcc-popup/fcc-popup.component';
import { MatDialog } from '@angular/material/dialog';
import { SrvRecord } from 'dns';

interface params {
  execMethod: string
  execType: string
  objectGroupCode: string
  objectGroupName: string
  objectId: string
  objectName: string
  objectReportURL: string
  objectType: string
}
@Component({
  selector: 'app-runreport',
  templateUrl: './runreport.component.html',
  styleUrls: ['./runreport.component.scss']
})
export class RunreportComponent implements OnInit {
  private gridApi: GridApi;
  private columnApi: ColumnApi;
  public gridOptions: GridOptions;
  private formattedArray: any = [];
  // private runCls: RunReportClass;
  @ViewChild('runReportFrm') public runReportFrm!: NgForm;
  public runReportForm: FormGroup;
  filteredOptionslist: any[];
  public dataSource: any = [];
  public objectList: any = [];
  public objectName: string = "";
  public objectType: string = "";
  public excelName: string = "";
  private runCls: RunReportClass;
  public rowData = [];
  public columnDefs = [];
  public exportTmp: boolean = true;
  public tblTmp: boolean = true;
  public result: string = "";
  panel1Expanded = true;
  panel2Expanded = true;
  pageSizes = [25, 50, 100, 250, 500];
  pageSize = 25;
  selectedRows = [];
  isError: boolean = false;
  psp_sub_id: string;
  fromDate: string;
  toDate: string;
  @ViewChild('table') table: MatTable<Element>;
  displayedColumns = [
    'S.No',
    'parameterName',
    'parametervalues'
  ];
  filteredOptions: Observable<params[]>;
  constructor(private fb: FormBuilder, private _loader: NgxUiLoaderService, private matDialog: MatDialog,
    private datepipe: DatePipe, private _toaster: ToastrService,
    private subSink: SubSink, private recService: ReconcilationService) {
    this.runReportForm = this.formInit();
    this.runCls = new RunReportClass();
    this.gridOptions = {
      enableCellTextSelection: true,
      suppressAutoSize: true,
    };
  }
  onExportBtnClick() {
    if (this.gridApi) {
      this.gridApi.exportDataAsCsv({ fileName: this.excelName + '.csv' });
    }
  }
  onPageSizeChanged() {
    // this.gridApi.paginationSetPageSize(this.pageSize);
    if (this.gridApi) {
      this.gridApi.paginationSetPageSize(this.pageSize);
    }
  }


  ngOnInit(): void {
    this.loadData();
  }
  loadData() {
    try {
      var userId = sessionStorage.getItem('userId');
      var name = "";
      this._loader.start();
      this.subSink.sink = this.recService.getObjectsList(userId, name).subscribe((res: any) => {
        this._loader.stop();
        this.objectList = res.objectList.slice();
        this.filteredOptions = this.runReportForm.get('objectName').valueChanges.pipe(
          startWith(''),
          map(value => {
            const name = typeof value === 'string' ? value : value?.name;
            return name ? this._filter(name as string) : this.objectList.slice();
          }),
        );
      })
    }
    catch (ex) {
      this.isError = true;
      this.result = ex;
      this._toaster.error(ex, 'ERROR')
    }
  }
  displayFn(name: params): string {
    return name && name.objectName ? name.objectName : '';
  }
  private _filter(name: string): params[] {
    const filterValue = name.toLowerCase();
    return this.objectList.filter(option => option.objectName.toLowerCase().includes(filterValue));
  }
  formInit() {
    return this.fb.group({
      objectName: ['', Validators.required],
      //  datecontrol:['', Validators.required]
    })
  }
  objname(event) {
    try {
      this.dataSource = [];
      this.runCls.dataMap = [];
      this.rowData = [];
      this.columnDefs = [];
      this.result = '';
      this.excelName = event.option.value.objectName;
      this.objectName = event.option.value.execMethod;
      this.objectType = event.option.value.objectType;
      this._loader.start();
      const body = {
        objectId: event.option.value.objectId
      };
      this.subSink.sink = this.recService.fetchObjectDetails(body).subscribe((res: any) => {
        this._loader.stop();
        const resp = res.paramList;
        this.dataSource = resp;
        this.dataSource = resp.map((row) => {
          if (row.lov === true && row.lovStr) {
            row.filteredOptions = row.lovStr;
            if (row.filteredOptions && row.filteredOptions.length > 0) {
              if (!row.paramValue) {
                row.paramValue = row.filteredOptions[0];
              }
            } else {
              if (row.paramValue === undefined || row.paramValue === null) { // Update this condition
                row.paramValue = ""; // Set row.paramValue to null
              }
            }
          }
          if (!row.paramValue && row.defaultValue) {
            row.paramValue = row.defaultValue;
          }
          return row;
        });


      });
    } catch (ex) {
      this.isError = true;
      this.result = ex;
      this._toaster.error(ex, 'ERROR');
    }
  }


  pspChange(r, event, i) {
    const name = r.paramName;
    r.paramValue = event;
    if (name.includes('pi_psp_id') || name.includes('pi_psp_name') || name.includes('p_psp_id')) {
      if (event === '0') {
        const nextRowIndex = i + 1;
        if (this.dataSource[nextRowIndex].paramName.includes('pi_sub_psp_id') || this.dataSource[nextRowIndex].paramName.includes('pi_sub_psp_name') || this.dataSource[nextRowIndex].paramName.includes('p_sub_psp_id')) {
          const subAccountList = [];
          subAccountList.unshift({
            "label": '0',
            "value": null
          });
          if (nextRowIndex < this.dataSource.length) {
            const nextRow = this.dataSource[nextRowIndex];
            nextRow.paramValue = '0';
            nextRow.lovStr = [];
            nextRow.lovStr = subAccountList;
            nextRow.filteredOptions = subAccountList;
          }
        }
      } else {
        const body = {
          pspId: event,
          pspSubGroupId: "0",
          pspSubAcctId: "0"
        }
        this._loader.start();
        this.recService.getSubaccounts(body).subscribe((res: any) => {
          this._loader.stop();
          const nextRowIndex = i + 1;
          if (this.dataSource[nextRowIndex] !== undefined) {
            if (this.dataSource[nextRowIndex].paramName.includes('pi_sub_psp_id') || this.dataSource[nextRowIndex].paramName.includes('pi_sub_psp_name') || this.dataSource[nextRowIndex].paramName.includes('p_sub_psp_id')) {
              const subAccountList = res.pspList.map(item => {
                return {
                  "label": item.pspSubAcctId,
                  "value": item.pspSubAcctName
                };
              });
              subAccountList.unshift({
                "label": '0',
                "value": null
              });
              if (nextRowIndex < this.dataSource.length) {
                const nextRow = this.dataSource[nextRowIndex];
                nextRow.paramValue = '0';
                nextRow.lovStr = [];
                nextRow.lovStr = subAccountList;
                nextRow.filteredOptions = subAccountList;
              }
            }
            if (this.dataSource[nextRowIndex].paramName.includes('pi_sub_acc_group_id')) {
              const subAccountGroupList = res.pspList.map(item => {
                return {
                  "label": item.pspSubGroupId,
                  "value": item.pspSubGroupName
                };
              });
              if (nextRowIndex < this.dataSource.length) {
                const nextRow = this.dataSource[nextRowIndex];
                nextRow.paramValue = '0';
                nextRow.lovStr = [];
                nextRow.lovStr = subAccountGroupList;
                nextRow.filteredOptions = subAccountGroupList;
              }
            }
            const afterRowIndex = nextRowIndex + 1;
            if (this.dataSource[afterRowIndex] !== undefined) {
              if (this.dataSource[afterRowIndex].paramName.includes('pi_sub_psp_id') || this.dataSource[nextRowIndex].paramName.includes('pi_sub_psp_name') || this.dataSource[nextRowIndex].paramName.includes('p_sub_psp_id')) {
                const subAccountList = res.pspList.map(item => {
                  return {
                    "label": item.pspSubAcctId,
                    "value": item.pspSubAcctName
                  };
                });
                if (afterRowIndex < this.dataSource.length) {
                  const nextRow = this.dataSource[afterRowIndex];
                  nextRow.paramValue = '0';
                  nextRow.lovStr = [];
                  nextRow.lovStr = subAccountList;
                  nextRow.filteredOptions = subAccountList;
                }
              }
            }
          }
        });
      }

    }
  }
  execute() {
    try {
      if (this.runReportForm.invalid) {
        return;
      }
      else {
        this.rowData = [];
        this.runCls.dataMap = [];
        this.runCls.objectName = this.objectName;
        this.runCls.objectType = this.objectType;
        this.formattedArray = [];
        if (this.dataSource) {
          this.formattedArray = this.dataSource.map(obj => {
            const formattedObj = { ...obj };
            if (obj.paramType === 'DATE') {
              formattedObj.paramValue = this.datepipe.transform(obj.paramValue, 'dd/MM/yyyy');
              formattedObj.defaultValue = this.datepipe.transform(obj.defaultValue, 'dd/MM/yyyy');
            }
            return formattedObj;
          });
          const hasMandatoryEmptyFields = this.formattedArray.some(obj => {
            return ((obj.paramValue === null || obj.paramValue === undefined || obj.paramValue === '') &&
              (obj.defaultValue === null || obj.defaultValue === undefined || obj.defaultValue === '') &&
              obj.mandatory === true);
          });
          if (hasMandatoryEmptyFields) {
            alert('Please Enter All Mandatory Fields');
            return;
          }
        }
        for (let j = 0; j < this.formattedArray.length; j++) {
          let paramValue = this.formattedArray[j].paramValue;
          let value = typeof paramValue === "object" && paramValue !== null ? paramValue.label : paramValue;
          value = value ?? "";
          this.runCls.dataMap.push({
            key: this.formattedArray[j].paramName,
            value: value,
          });
        }
        if (this.runCls.objectName === "p_status_summary_report") {
          const datePipe = new DatePipe('en-US');
          const pi_sub_psp_item = this.runCls.dataMap.find(item => item.key === "pi_sub_psp_id");
          const sub_ac_id = pi_sub_psp_item?.value;
          const pi_date_from_item = this.runCls.dataMap.find(item => item.key === "pi_date_from");
          const from_date = pi_date_from_item ? datePipe.transform(pi_date_from_item.value, 'dd/MM/yyyy') : undefined;
          const pi_date_to_item = this.runCls.dataMap.find(item => item.key === "pi_date_to");
          const to_date = pi_date_to_item ? datePipe.transform(pi_date_to_item.value, 'dd/MM/yyyy') : undefined;
          if (sub_ac_id === undefined || from_date === undefined || to_date === undefined) {

          } else {
            this.psp_sub_id = sub_ac_id;
            this.fromDate = from_date;
            this.toDate = to_date;
          }
        }
        this._loader.start();
        this.subSink.sink = this.recService.runReport(this.runCls).subscribe((res: any) => {
          this._loader.stop();
          if (res.report.error != undefined && res.report.error != null) {
            this.isError = true;
            this.result = res.report.error;
            this._toaster.error(this.result, 'Error');
          }
          else if (res.report && Object.keys(res.report).length === 0 && this.objectType === 'FUNCTION') {
            this.isError = false;
            this.result = "Function executed successfully";
            this._toaster.success(this.result, 'Success');
          }
          else if (res.report) {
            this.rowData = this.generateRowData(res.report);
            this.exportTmp = false;
            this.isError = false;
            this.result = "Report executed successfully";
            this._toaster.success(this.result, 'Success');
          } if (res) {
            if (res.error === '') {
              this.isError = true;
              this.result = "Error executing " + this.objectType;
              this._toaster.error(this.result, 'Error');
            } if (res.error != '' && res.error != undefined) {
              this.result = res.error;
              this._toaster.error(this.result, 'Error');
            }
          }
        });
      }
    }
    catch (ex) {
      this.isError = true;
      this.result = ex;
      this._toaster.error(ex, 'ERROR')
    }
  }
  onPaste(event: ClipboardEvent) {
    event.preventDefault(); // Prevent default paste behavior
    const inputEl: HTMLInputElement = event.target as HTMLInputElement;
    const pastedValue = event.clipboardData?.getData('text') || window['clipboardData'].getData('text'); // Get pasted value
    inputEl.value = ''; // Reset input field value
    inputEl.dispatchEvent(new Event('input')); // Trigger input event to update ngModel
  }
  // generateRowData(data: any) {
  //   if (this.runCls.objectName === "p_status_summary_report") {
  //     this.columnDefs = this.generateColumnDefs(data);
  //   } else {
  //     this.columnDefs = this.noramalgenerateColumnDefs(data);
  //   }
  //   const columnNames = Object.keys(data);
  //   const rowData = [];
  //   const numRows = data[columnNames[0]].length;
  //   for (let i = 0; i < numRows; i++) {
  //     const row = { "S.NO": i + 1 };
  //     columnNames.forEach((columnName) => {
  //       row[columnName] = data[columnName][i];
  //     });
  //     rowData.push(row);
  //   }
  //   return rowData;
  // }

  generateRowData(data: any) {
    const columnNames = Object.keys(data);
    const rowData = [];
    const numRows = data[columnNames[0]].length;
    for (let i = 0; i < numRows; i++) {
      const row = { "S.NO": i + 1 };
      columnNames.forEach((columnName) => {
        row[columnName] = data[columnName][i];

        // if (columnName.includes("FILE_UPLOAD_DATE") && data[columnName][i].includes("Total")) {
        //   // Customize the background color or any other styling for the column "File_upload_date" containing "total"
        //   row[columnName] = + row[columnName];
        // }
      });
      rowData.push(row);
    }

    if (this.runCls.objectName === "p_status_summary_report") {
      this.columnDefs = this.generateColumnDefs(data);
    } else {
      this.columnDefs = this.noramalgenerateColumnDefs(data);
    }

    return rowData;
  }

  onInputBlur(row: any, i: number): void {
    row.filteredOptions.forEach(option => {
      if (!(option.value === row.paramValue.toString())) {
        row.paramValue = '';
      }
    });
  }
  onOptionSelected(row: any, selectedValue: string) {
    row.paramValue = selectedValue;
  }

  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.columnApi.autoSizeAllColumns();
  }
  onResizeColumnsClick() {
    this.gridApi.collapseAll();
  }

  generateColumnDefs(data: any) {
    const dataColumnDefs = Object.keys(data)
      .filter(columnName => columnName !== 'S.NO')
      .map(columnName => ({
        headerName: columnName,
        field: columnName,
        sortable: true,
        filter: true,
        resizable: true,
        width: columnName.includes('ACCOUNT_IDENTIFIER') ? '3000px' : columnName.includes('FILE_NAME') ? '500px' : (columnName === 'RECORD_IDENTIFIER' ? '1500px' : '250px'),
        cellRenderer: (params) => {
          if (columnName === 'F_TOTAL_AMOUNT') {
            const link = document.createElement('a');
            link.href = '#'; // replace with your URL or route
            link.style.color = "blue"; // change link color
            link.innerText = params.value;
            link.style.textDecoration = "underline";
            link.addEventListener('click', (event) => {
              event.preventDefault(); // prevent the link from navigating
              this.handleLinkClick(params.data); // call the separate event handler
            });
            const cell = document.createElement('div');
            cell.appendChild(link);
            cell.style.cursor = "pointer";

            return cell;
          } else {
            return params.value;
          }
        }
      }));

    return [
      {
        headerName: 'S.No',
        field: 'sno',
        valueGetter: params => params.node.rowIndex + 1,
        sortable: false,
        filter: false,
        resizable: false,
        width: 80
      },
      ...dataColumnDefs
    ];
  }
  noramalgenerateColumnDefs(data: any) {
    const dataColumnDefs = Object.keys(data)
      .filter(columnName => columnName !== 'S.NO')
      .map(columnName => ({
        headerName: columnName,
        field: columnName,
        sortable: true,
        filter: true,
        resizable: true,
        width: columnName.includes('ACCOUNT_IDENTIFIER') ? '3000px' : columnName.includes('FILE_NAME') ? '500px' : (columnName === 'RECORD_IDENTIFIER' ? '1500px' : '250px'),
      }));
    return [
      {
        headerName: 'S.No',
        field: 'sno',
        valueGetter: params => params.node.rowIndex + 1,
        sortable: false,
        filter: false,
        resizable: false,
        width: 80
      },
      ...dataColumnDefs
    ];
  }
  handleLinkClick(rowData: any) {
    if (rowData.F_FILE_UPLOAD_DATE === "Total") {
      rowData.F_SUB_PSP_ID = this.psp_sub_id;
      rowData.F_FROM_DATE = this.fromDate;
      rowData.F_TO_DATE = this.toDate;
      rowData.F_FILE_NAME = "";
      rowData.F_PSP_ID = "";
      rowData.F_CURRENCY = "";
      this.runCls.dataMap = this.getDataMap(rowData);
    } else {
      this.runCls.dataMap = this.getDataMap(rowData);
    }
    this.runCls.objectName = "p_dtl_status_summary_report";
    this._loader.start();
    this.subSink.sink = this.recService.runReport(this.runCls)
      .subscribe((res: any) => {
        this._loader.stop();
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

  getDataMap(row: any): any[] {
    const getKeyValues = (obj: any) => {
      const wantedKeys = ["F_SIDE", "F_FILE_NAME", "F_PSP_ID", "F_SUB_PSP_ID", "F_DATE", "F_CURRENCY"];
      const datePipe = new DatePipe('en-US');
      const dateValue = obj['F_DATE'];
      if (dateValue !== null) {
        const formattedDate = datePipe.transform(dateValue, 'dd/MM/yyyy');
        const fromValue = formattedDate;
        const toValue = formattedDate;
        return wantedKeys
          .filter(key => obj.hasOwnProperty(key))
          .map(key => {
            if (key === "F_DATE") {
              return [
                { key: "F_FROM_DATE", value: fromValue },
                { key: "F_TO_DATE", value: toValue },
              ];
            } else {
              return { key, value: obj[key] };
            }
          })
          .flat();
      } else {
        return wantedKeys
          .filter(key => obj.hasOwnProperty(key))
          .map(key => {
            if (key === "F_DATE") {
              return [
                { key: "F_FROM_DATE", value: this.fromDate },
                { key: "F_TO_DATE", value: this.toDate },
              ];
            } else {
              return { key, value: obj[key] };
            }
          })
          .flat();
      }
    };

    const keyValues = getKeyValues(row);
    return keyValues;
  }

  Cancel() {
    this.tblTmp = true;
    this.exportTmp = true;
    this.dataSource = [];
    this.rowData = [];
    this.columnDefs = [];
    this.runReportFrm.resetForm();
    this.runReportForm = this.formInit();
    this.runCls.dataMap = [];
    this.formattedArray = [];
    this.objectType = '';
    this.result = '';
    this.isError = false;
    this.loadData();
  }

}

