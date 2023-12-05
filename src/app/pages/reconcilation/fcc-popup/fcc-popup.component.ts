import { Component, Input, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ColumnApi, GridApi, GridOptions } from 'ag-grid-community';
@Component({
  selector: 'app-fcc-popup',
  templateUrl: './fcc-popup.component.html',
  styleUrls: ['./fcc-popup.component.scss']
})
export class FccPopupComponent implements OnInit {
  private gridApi: GridApi;
  private columnApi: ColumnApi;
  public gridOptions: GridOptions;
  public exportTmp: boolean = true;
  pageSizes = [25, 50, 100, 250, 500];
  selectedRows = [];
  pageSize = 25;
  public rowData = [];
  public columnDefs = [];
  constructor(public dialogRef: MatDialogRef<FccPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.gridOptions = {
      enableCellTextSelection: true,
      enableRangeSelection: true,
    };
  }

  ngOnInit(): void {
    // console.log(this.data.data);
    if (this.data.data) {
      this.rowData = this.generateRowData(this.data.data);
      this.exportTmp = false;
    }
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
  }
  onPageSizeChanged() {
    // this.gridApi.paginationSetPageSize(this.pageSize);
    if (this.gridApi) {
      this.gridApi.paginationSetPageSize(this.pageSize);
    }
  }
  onExportBtnClick() {
    //console.log(this.gridApi);
    if (this.gridApi) {
      this.gridApi.exportDataAsCsv({ fileName: 'iRec_Data_Popup.csv' });
    }
  }
  generateRowData(data: any) {
    this.columnDefs = this.generateColumnDefs(data);
    const columnNames = Object.keys(data);
    const rowData = [];
    const numRows = data[columnNames[0]].length;
    for (let i = 0; i < numRows; i++) {
      const row = {};
      columnNames.forEach((columnName) => {
        row[columnName] = data[columnName][i];
      });
      rowData.push(row);
    }
    return rowData;
  }

  generateColumnDefs(data: any) {
    const columnNames = Object.keys(data);
    const snoColumnDef = {
      headerName: "S.No",
      field: "snoColumn",
      valueGetter: (params: any) => params.node.rowIndex + 1,
      sortable: true,
      filter: true,
      resizable: true,
      width: 90,
    };
    const columnDefs = columnNames.map((columnName) => {
      let headerName = columnName;
      let width = columnName.includes('FILE_NAME') ? 500 : 250;
      return {
        headerName,
        field: columnName,
        sortable: true,
        filter: true,
        resizable: true,
        width:width
        // width: columnName.includes('FILE_NAME') ? '500px':'250px'

      };
    });
    columnDefs.unshift(snoColumnDef);
    return columnDefs;

  }
}
