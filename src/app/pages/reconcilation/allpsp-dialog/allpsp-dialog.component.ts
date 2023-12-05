import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ColumnApi, GridApi, GridOptions } from 'ag-grid-community';

@Component({
  selector: 'app-allpsp-dialog',
  templateUrl: './allpsp-dialog.component.html',
  styleUrls: ['./allpsp-dialog.component.scss']
})
export class AllpspDialogComponent implements OnInit {
  columnDefs: any[];
  rowData: any[];
  private gridApi: GridApi;
  public gridOptions: GridOptions;
  private columnApi: ColumnApi;
  constructor(private dialogRef: MatDialogRef<AllpspDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.gridOptions = {
      enableCellTextSelection: true,
      enableRangeSelection: true,
    };

  }

  close(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
    // Access rowData and columnDefs from data object
    this.rowData = this.data.rowData;
    this.columnDefs = this.data.columnDefs;
  }
  onGridReady1(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
  }
  export() {
    if (this.gridApi) {
      this.gridApi.exportDataAsCsv({ fileName: 'AllPSP.csv' });
    }
  }
}


