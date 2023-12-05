import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { map, startWith } from 'rxjs/operators';
import { SubSink } from 'subsink';
import { RandomMatchingComponent } from '../random-matching/random-matching.component';
import { RandomQuery } from '../../../modules/modal/randomQuery.modal';
import { ReconcilationService } from '@services/reconcilation.service';
import { UnReconcileComponent } from '../un-reconcile/un-reconcile.component';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { CommentsComponent } from '../comments/comments.component';
import { ColumnApi, GridApi, GridOptions, ICellRendererParams, IHeaderParams } from 'ag-grid-community';
import { CreatetransactionComponent } from '../createtransaction/createtransaction.component';
import { AllpspDialogComponent } from '../allpsp-dialog/allpsp-dialog.component';
export interface SubAcct {
  type: string;
  label: string;
  value: string;
  desc: string;
}
export interface PSPName {
  pspName: string;
  subAccts: SubAcct[];
}
interface PspResult {
  sequence: string;
  condition: string;
  columnName: string;
  dataType: string;
  operand: string;
  Value: string;
  query: string;
}

interface Body {
  pspResult: PspResult[];
}
interface TransactionData {
  F_TRANSACTION_CURRENCY: string;
  F_REMARKS: string;
  F_EZECASH_PROCESSING_AGENT_ID: string;
  f_update_side: string;
  F_EZECASH_PLAYER_ID: string;
  F_PRODUCT: string;
  F_PLAYER_REGISTRATION_BRAND: string;
  F_RECORD_ID: string;
  F_EZECASH_REFERENCE: string;
  F_PSP_TRANSACTION_STATUS_2: string;
  F_SETTLEMENT_AMOUNT: string;
  F_PSP_TRANSACTION_STATUS_1: string;
  F_EZECASH_PROCESSOR_CATEGORY: string;
  F_EZECASH_TRANSACTION_STATUS: string;
  F_RECONCILIATION_TYPE: string;
  F_PLAYER_SECOND_NAME: string;
  F_VALUE_DATE: string;
  F_RECONCILIATION_STATUS: string;
  F_COUNTRY: string;
  F_TRANSACTION_AMOUNT: string;
  F_ACTION_TYPE: string;
  F_EZECASH_DEPOSIT_REFERENCE_ID: string;
  F_ROLE: string;
  F_EZECASH_PAYMENT_MODE: string;
  F_FRONT_END: string;
  f_sequence_id: string;
  F_PSP_REFERENCE: string;
  F_RECON_TYPE: string;
  f_reconciliation_flag: string;
  F_ACCOUNT_CURRENCY: string;
  F_POINT_IN_RECON_DATE: string;
  F_EZECASH_TRANSACTION_CATEGORY: string;
  F_PLAYER_FIRST_NAME: string;
  F_RECON_DATE: string;
  F_NARRATIVE: string;
  F_SETTLEMENT_CURRENCY: string;
  F_TRANSACTION_DATE: string;
  F_ACCOUNT_AMOUNT: string;
  F_BASE_AMOUNT: string;
  F_ISSUE: string;
  F_RECONCILIATION_METHOD: string;
  f_file_name: string;
  F_PLAYER_INFORMATION_2: string;
  F_PLAYER_INFORMATION_1: string;
  F_BASE_CURRENCY: string;
}
@Component({
  selector: 'app-reconcilation',
  templateUrl: './reconcilation.component.html',
  styleUrls: ['./reconcilation.component.scss']
})
export class ReconcilationComponent implements OnInit, OnDestroy {
  @ViewChild('reconfrm') public reconfrm!: NgForm;
  public ReconcilationForm: FormGroup;
  matDialogRef: MatDialogRef<RandomMatchingComponent>;
  matDialogRef1: MatDialogRef<CreatetransactionComponent>;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  @ViewChild('table') table: MatTable<Element>;
  @ViewChild('tables') tables: MatTable<Element>;
  // let gridApi: GridApi;
  // dataSource = new MatTableDataSource<MyData>(MY_DATA);
  filteredPSPNames: any;
  filteredSubAccts: any;
  originalArray: PSPName[] = [];
  pspNamesWithSubAccts: PSPName[] = [];
  public pspDataSource: any = [];
  public cashDataSource: any = [];
  private randomClass: RandomQuery;
  private subAcId: string;
  public ezeCheckeData: any = [];
  public pspCheckeData: any = [];
  pageSizes = [25, 50, 100, 250, 500];
  pageSize = 25;
  psppageSizes = [25, 50, 100, 250, 500];
  psppageSize = 25;
  public ezeCheckeAmnt: any = [];
  public pspCheckeAmnt: any = [];
  public gridOptions: GridOptions;
  public gridOptions1: GridOptions;
  pspselectAllChecked = false;
  ezeselectAllChecked = false;
  isLoading = false;
  ezecount: number = 0;
  ezesum: number = 0;
  pspcount: number = 0;
  pspsum: number = 0;
  private subAcRole: string;
  private gridApi: GridApi;
  private prfValue: number;
  private columnApi: ColumnApi;
  private gridApi1: GridApi;
  private columnApi1: ColumnApi;
  private pspTotal = 0;
  private ezeTotal = 0;
  private pspIndexes = [];
  private ezeIndexes = [];
  public rowSelection: 'single' | 'multiple' = 'multiple';

  public columnDefs1 =
    [
      {
        field: "sno", headerName: "SNO", width: 70,
        valueGetter: (params) => {
          const rowIndex = params.node.rowIndex + 1;
          return rowIndex.toString();
        },
        valueFormatter: (params) => {
          return params.value;
        },
        cellStyle: { "text-align": "right" },
      },
      {
        field: "Comments", headerName: "Cmnt", width: 80, cellRenderer: (params) => {
          const icon = document.createElement('i');
          icon.classList.add('fas', 'fa-comment');
          icon.title = "Add Comment";
          icon.addEventListener('click', (event) => {
            event.stopPropagation();
            const rowData = params.data;
            const rowIndex = params.rowIndex;
            // console.log(rowData);
            this.pspComment(rowData, rowIndex);
          });
          const cell = document.createElement('div');
          cell.appendChild(icon);
          cell.style.cursor = "pointer"; // Add this line to set the pointer cursor on hover
          return cell;
        },
        // headerComponentFramework: HeaderIconComponent
      },
      {
        field: "All", headerName: "", width: 50, headerCheckboxSelection: true,
        checkboxSelection: (params) => {
          if (params.data.f_reconciliation_flag === "Y") {
            return false;
          }
          return true; // Return true for other rows to enable checkbox selection
        },
        cellStyle: (params) => {
          if (params.data.f_reconciliation_flag === "Y") {
            return { opacity: 0.5, pointerEvents: "none" };
          }
        },
        // headerCheckboxSelectionFilteredOnly: true,
        // headerCheckboxSelectionDisableExpression: 'params.data.f_reconciliation_flag === "Y"',
      },
      {
        field: "UR",
        headerName: "UR",
        width: 60,
        cellRenderer: (params) => {
          const button = document.createElement('button');;
          button.innerText = 'U';
          button.style.fontSize = "12px";
          button.style.fontWeight = "600";
          if (params.data.f_reconciliation_flag === 'N') {
            button.disabled = true;
            button.style.color = "green";
          } else {
            button.disabled = false;
            button.style.color = "white"; // set font color to white
            button.style.backgroundColor = "red"; // set background color to red
          }
          button.addEventListener('click', (event) => {
            event.stopPropagation();
            const rowData = params.data;
            const rowIndex = params.rowIndex;
            this.onPspUnreconcile(rowData, rowIndex);
          });
          const cell = document.createElement('div');
          cell.appendChild(button);
          cell.style.cursor = "pointer";
          return cell;
        },
        editable: false
      },
      {
        field: "ME", headerName: "ME", width: 60,
        cellRenderer: (params) => {
          const button = document.createElement('button');
          button.innerText = 'M';
          button.style.fontSize = "12px";
          button.style.color = "green";
          button.style.fontWeight = "600";
          // if (!button.disabled) {
          //   button.classList.add('btn-enabled');
          // }
          button.addEventListener('click', (event) => {
            event.stopPropagation();
            const rowData = params.data;
            const rowIndex = params.rowIndex;
            // console.log(rowData);
            this.onpspMEClicked(rowData, rowIndex);
          });
          const cell = document.createElement('div');
          cell.appendChild(button);
          cell.style.cursor = "pointer";
          // cell.style.width="20px";
          return cell;
        }
        // cellRendererFramework: BtnCellRenderer1,
        // onCellClicked: this.onpspMEClicked.bind(this),
      },
      { field: "F_TRANSACTION_DATE", headerName: "Transaction Date", sortable: true, filter: true, resizable: true },
      { field: "F_VALUE_DATE", headerName: "Value Date", sortable: true, filter: true, resizable: true, width: 120 },
      { field: "F_PSP_REFERENCE", headerName: "PSP Reference", sortable: true, filter: true, resizable: true },
      { field: "F_EZECASH_REFERENCE", headerName: "EzeCash Reference", sortable: true, filter: true, resizable: true },
      { field: "F_TRANSACTION_AMOUNT", headerName: "Transaction Amount", sortable: true, filter: true, resizable: true },
      { field: "F_TRANSACTION_CURRENCY", headerName: "Transaction Currency", sortable: true, filter: true, resizable: true },
      { field: "F_REMARKS", headerName: "Remarks", sortable: true, filter: true, resizable: true },
      { field: "F_ISSUE", headerName: "Issue", sortable: true, filter: true, resizable: true },
      { field: "F_ACTION_TYPE", headerName: "Action Type", sortable: true, filter: true, resizable: true },
      { field: "F_ROLE", headerName: "Role", sortable: true, filter: true, resizable: true },
      { field: "f_update_side", headerName: "Update Side", sortable: true, filter: true, resizable: true },
      { field: "F_RECONCILIATION_METHOD", headerName: "Reconciliation Method", sortable: true, filter: true, resizable: true },
      { field: "F_RECON_TYPE", headerName: "Recon Type", sortable: true, filter: true, resizable: true },
      { field: "F_RECONCILIATION_TYPE", headerName: "Reconciliation Type", sortable: true, filter: true, resizable: true },
      { field: "f_file_name", headerName: "File Name", sortable: true, filter: true, resizable: true },
      { field: "f_reconciliation_flag", headerName: "Reconciliation Flag", sortable: true, filter: true, resizable: true },
      { field: "F_RECONCILIATION_STATUS", headerName: "Reconciliation Status", sortable: true, filter: true, resizable: true },
      { field: "F_RECON_DATE", headerName: "Recon Date", sortable: true, filter: true, resizable: true },
      { field: "F_POINT_IN_RECON_DATE", headerName: "Point in Recon Date", sortable: true, filter: true, resizable: true },
      { field: "F_NARRATIVE", headerName: "Narrative", sortable: true, filter: true, resizable: true },
      { field: "F_PLAYER_FIRST_NAME", headerName: "Player First Name", sortable: true, filter: true, resizable: true },
      { field: "F_PLAYER_SECOND_NAME", headerName: "Player Second Name", sortable: true, filter: true, resizable: true },
      { field: "F_PLAYER_INFORMATION_1", headerName: "Player Information 1", sortable: true, filter: true, resizable: true },
      { field: "F_PLAYER_INFORMATION_2", headerName: "Player Information 2", sortable: true, filter: true, resizable: true },
      { field: "F_PSP_TRANSACTION_STATUS_1", headerName: "PSP Transaction Status 1", sortable: true, filter: true, resizable: true },
      { field: "F_PSP_TRANSACTION_STATUS_2", headerName: "PSP Transaction Status 2", sortable: true, filter: true, resizable: true },
      { field: "F_EZECASH_TRANSACTION_STATUS", headerName: "EzeCash Transaction Status", sortable: true, filter: true, resizable: true },
      { field: "F_EZECASH_DEPOSIT_REFERENCE_ID", headerName: "EzeCash Deposit Reference ID", sortable: true, filter: true, resizable: true },
      { field: "F_EZECASH_PLAYER_ID", headerName: "EzeCash Player ID", sortable: true, filter: true, resizable: true },
      { field: "F_EZECASH_PROCESSING_AGENT_ID", headerName: "EzeCash Processing Agent ID", sortable: true, filter: true, resizable: true },
      { field: "F_EZECASH_PAYMENT_MODE", headerName: "EzeCash Payment Mode", sortable: true, filter: true, resizable: true },
      { field: "F_EZECASH_TRANSACTION_CATEGORY", headerName: "EzeCash Transaction Category", sortable: true, filter: true, resizable: true },
      { field: "F_EZECASH_PROCESSOR_CATEGORY", headerName: "EzeCash Processor Category", sortable: true, filter: true, resizable: true },
      { field: "F_BASE_AMOUNT", headerName: "Base Amount", sortable: true, filter: true, resizable: true },
      { field: "F_BASE_CURRENCY", headerName: "Base Currency", sortable: true, filter: true, resizable: true },
      { field: "F_ACCOUNT_AMOUNT", headerName: "Account Amount", sortable: true, filter: true, resizable: true },
      { field: "F_ACCOUNT_CURRENCY", headerName: "Account Currency", sortable: true, filter: true, resizable: true },
      { field: "F_SETTLEMENT_AMOUNT", headerName: "Settlement Amount", sortable: true, filter: true, resizable: true },
      { field: "F_SETTLEMENT_CURRENCY", headerName: "Settlement Currency", sortable: true, filter: true, resizable: true },
      { field: "F_FRONT_END", headerName: "Front End", sortable: true, filter: true, resizable: true },
      { field: "F_PRODUCT", headerName: "Product", sortable: true, filter: true, resizable: true },
      { field: "F_COUNTRY", headerName: "Country", sortable: true, filter: true, resizable: true }
    ];
  public columnDefs2 =
    [
      {
        field: "sno", headerName: "SNO", width: 70, valueGetter: (params) => {
          // Get the index of the row
          const rowIndex = params.node.rowIndex + 1;
          return rowIndex;
        },
        cellStyle: { "text-align": "right" },
      },
      {
        field: "Comments", headerName: "Cmnt", width: 70, cellRenderer: (params) => {
          const icon = document.createElement('i');
          icon.classList.add('fas', 'fa-comment');
          icon.title = "Add Comment";
          icon.addEventListener('click', (event) => {
            event.stopPropagation();
            const rowData = params.data;
            const rowIndex = params.rowIndex;
            // console.log(rowData);
            // this.ezComment(rowData, rowIndex);
          });
          const cell = document.createElement('div');
          cell.appendChild(icon);
          cell.style.cursor = "pointer";
          // cell.style.width="30px"
          return cell;
        },
        // headerComponentFramework: HeaderIconComponent
      },
      {
        field: "All", headerName: "", width: 50, headerCheckboxSelection: true,
        checkboxSelection: (params) => {
          if (params.data.f_reconciliation_flag === "Y") {
            return false;
          }
          return true; // Return true for other rows to enable checkbox selection
        },
        cellStyle: (params) => {
          if (params.data.f_reconciliation_flag === "Y") {
            return { opacity: 0.5, pointerEvents: "none" };
          }
        },
        // checkboxSelection: true,
        // cellStyle: (params) => {
        //   if (params.data.f_reconciliation_flag === "Y") {
        //     return { opacity: 0.5, pointerEvents: "none" };
        //   }
        // },
      },
      {
        field: "UR",
        headerName: "UR",
        width: 60,
        cellRenderer: (params) => {
          const button = document.createElement('button');
          button.style.fontSize = "12px";
          button.style.fontWeight = "600";
          button.innerText = 'U';
          if (params.data.f_reconciliation_flag === 'N') {
            button.disabled = true;
            button.style.color = "green";
          } else {
            button.disabled = false;
            button.style.color = "white"; // set font color to white
            button.style.backgroundColor = "red";
          };
          button.addEventListener('click', (event) => {
            event.stopPropagation();
            const rowData = params.data;
            const rowIndex = params.rowIndex;
            // console.log(rowData);
            this.unEZEReconcile(rowData, rowIndex);
          });
          const cell = document.createElement('div');
          cell.appendChild(button);
          cell.style.cursor = "pointer";
          return cell;
        },
      },
      {
        field: "ME", headerName: "ME", width: 60,
        cellRenderer: (params) => {
          const button = document.createElement('button');
          button.innerText = 'M';
          button.style.fontSize = "12px";
          button.style.fontWeight = "600";
          button.style.color = "green";
          // if (params.data.f_reconciliation_flag === 'N') {
          //   button.disabled = true;
          //   button.style.color = "green";
          // } else {
          //   button.style.color = "red";
          //   button.disabled = false;
          // };
          button.addEventListener('click', (event) => {
            event.stopPropagation();
            const rowData = params.data;
            const rowIndex = params.rowIndex;
            // console.log(rowData);
            // this.onezeMEClicked(rowData, rowIndex);
          });
          const cell = document.createElement('div');
          cell.appendChild(button);
          cell.style.cursor = "pointer";
          // cell.style.width="20px";
          return cell;
        }
        // cellRendererFramework: BtnCellRenderer1,
        // onCellClicked: this.onpspMEClicked.bind(this),
      },
      { field: "F_TRANSACTION_DATE", headerName: "Transaction Date", sortable: true, filter: true, resizable: true },
      { field: "F_VALUE_DATE", headerName: "Value Date", sortable: true, filter: true, resizable: true, width: 120 },
      { field: "F_PSP_REFERENCE", headerName: "PSP Reference", sortable: true, filter: true, resizable: true },
      { field: "F_EZECASH_REFERENCE", headerName: "EzeCash Reference", sortable: true, filter: true, resizable: true },
      { field: "F_TRANSACTION_AMOUNT", headerName: "Transaction Amount", sortable: true, filter: true, resizable: true },
      { field: "F_TRANSACTION_CURRENCY", headerName: "Transaction Currency", sortable: true, filter: true, resizable: true },
      { field: "F_REMARKS", headerName: "Remarks", sortable: true, filter: true, resizable: true },
      { field: "F_ISSUE", headerName: "Issue", sortable: true, filter: true, resizable: true },
      { field: "F_ACTION_TYPE", headerName: "Action Type", sortable: true, filter: true, resizable: true },
      { field: "F_ROLE", headerName: "Role", sortable: true, filter: true, resizable: true },
      { field: "f_update_side", headerName: "Update Side", sortable: true, filter: true, resizable: true },
      { field: "F_RECONCILIATION_METHOD", headerName: "Reconciliation Method", sortable: true, filter: true, resizable: true },
      { field: "F_RECON_TYPE", headerName: "Recon Type", sortable: true, filter: true, resizable: true },
      { field: "F_RECONCILIATION_TYPE", headerName: "Reconciliation Type", sortable: true, filter: true, resizable: true },
      { field: "f_file_name", headerName: "File Name", sortable: true, filter: true, resizable: true },
      { field: "f_reconciliation_flag", headerName: "Reconciliation Flag", sortable: true, filter: true, resizable: true },
      { field: "F_RECONCILIATION_STATUS", headerName: "Reconciliation Status", sortable: true, filter: true, resizable: true },
      { field: "F_RECON_DATE", headerName: "Recon Date", sortable: true, filter: true, resizable: true },
      { field: "F_POINT_IN_RECON_DATE", headerName: "Point in Recon Date", sortable: true, filter: true, resizable: true },
      { field: "F_NARRATIVE", headerName: "Narrative", sortable: true, filter: true, resizable: true },
      { field: "F_PLAYER_FIRST_NAME", headerName: "Player First Name", sortable: true, filter: true, resizable: true },
      { field: "F_PLAYER_SECOND_NAME", headerName: "Player Second Name", sortable: true, filter: true, resizable: true },
      { field: "F_PLAYER_INFORMATION_1", headerName: "Player Information 1", sortable: true, filter: true, resizable: true },
      { field: "F_PLAYER_INFORMATION_2", headerName: "Player Information 2", sortable: true, filter: true, resizable: true },
      { field: "F_PSP_TRANSACTION_STATUS_1", headerName: "PSP Transaction Status 1", sortable: true, filter: true, resizable: true },
      { field: "F_PSP_TRANSACTION_STATUS_2", headerName: "PSP Transaction Status 2", sortable: true, filter: true, resizable: true },
      { field: "F_EZECASH_TRANSACTION_STATUS", headerName: "EzeCash Transaction Status", sortable: true, filter: true, resizable: true },
      { field: "F_EZECASH_DEPOSIT_REFERENCE_ID", headerName: "EzeCash Deposit Reference ID", sortable: true, filter: true, resizable: true },
      { field: "F_EZECASH_PLAYER_ID", headerName: "EzeCash Player ID", sortable: true, filter: true, resizable: true },
      { field: "F_EZECASH_PROCESSING_AGENT_ID", headerName: "EzeCash Processing Agent ID", sortable: true, filter: true, resizable: true },
      { field: "F_EZECASH_PAYMENT_MODE", headerName: "EzeCash Payment Mode", sortable: true, filter: true, resizable: true },
      { field: "F_EZECASH_TRANSACTION_CATEGORY", headerName: "EzeCash Transaction Category", sortable: true, filter: true, resizable: true },
      { field: "F_EZECASH_PROCESSOR_CATEGORY", headerName: "EzeCash Processor Category", sortable: true, filter: true, resizable: true },
      { field: "F_BASE_AMOUNT", headerName: "Base Amount", sortable: true, filter: true, resizable: true },
      { field: "F_BASE_CURRENCY", headerName: "Base Currency", sortable: true, filter: true, resizable: true },
      { field: "F_ACCOUNT_AMOUNT", headerName: "Account Amount", sortable: true, filter: true, resizable: true },
      { field: "F_ACCOUNT_CURRENCY", headerName: "Account Currency", sortable: true, filter: true, resizable: true },
      { field: "F_SETTLEMENT_AMOUNT", headerName: "Settlement Amount", sortable: true, filter: true, resizable: true },
      { field: "F_SETTLEMENT_CURRENCY", headerName: "Settlement Currency", sortable: true, filter: true, resizable: true },
      { field: "F_FRONT_END", headerName: "Front End", sortable: true, filter: true, resizable: true },
      { field: "F_PRODUCT", headerName: "Product", sortable: true, filter: true, resizable: true },
      { field: "F_COUNTRY", headerName: "Country", sortable: true, filter: true, resizable: true },
      { field: "F_PLAYER_REGISTRATION_BRAND", headerName: "Brand", sortable: true, filter: true, resizable: true }
    ];
  columnDefs: { headerName: string; sortable: boolean; filter: boolean; resizable: boolean; field: string; }[];

  constructor(private fb: FormBuilder, private matDialog: MatDialog, private subSink: SubSink, private _loader: NgxUiLoaderService,
    private reconService: ReconcilationService, private _toaster: ToastrService) {
    this.ReconcilationForm = this.forminit();
    this.randomClass = new RandomQuery();
    this.gridOptions = {
      enableCellTextSelection: true,
      enableRangeSelection: true,
    };
    this.gridOptions1 = {
      enableCellTextSelection: true,
      enableRangeSelection: true,
    };
  }
  onpspMEClicked(row, i) {
    const config = new MatDialogConfig();
    config.width = '1250px';
    config.height = '350px';
    config.disableClose = true;
    config.position = { left: '280px' };
    const dialogRef = this.matDialog.open(CreatetransactionComponent, config);
    dialogRef.componentInstance.dataSaved.subscribe((data) => {
      // console.log(data);
    });
  }
  onezeMEClicked(row, i) {
    const config = new MatDialogConfig();
    config.width = '1250px';
    config.height = '350px';
    config.disableClose = true;
    config.position = { left: '280px' };
    const dialogRef = this.matDialog.open(CreatetransactionComponent, config);
    dialogRef.componentInstance.dataSaved.subscribe((data) => {
      // console.log(data);
    });
  }

  onPspUnreconcile(row, i) {
    this.unpspReconcile(row, i);
  }
  onezeClicked(params: any) {

    this.unEZEReconcile(params.data, params.rowIndex);
  }

  onPageSizeChanged() {
    if (this.gridApi) {
      this.gridApi.paginationSetPageSize(this.pageSize);
    }
  }
  onpspPageSizeChanged() {
    if (this.gridApi) {
      this.gridApi1.paginationSetPageSize(this.psppageSize);
    }
  }
  exportPspdata() {
    if (this.gridApi1) {
      this.gridApi1.exportDataAsCsv({ fileName: 'PSP.csv' });
    }
  }
  exportEzedata() {
    if (this.gridApi) {
      this.gridApi.exportDataAsCsv({ fileName: 'EZE.csv' });
    }
  }
  onGridReady(params) {
    this.gridApi1 = params.api;
    this.columnApi1 = params.columnApi;
  }
  onGridReady1(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
  }
  forminit() {
    return this.fb.group({
      pspName: ['', Validators.required],
      subAcName: ['', Validators.required]
    });
  }



  ngOnInit(): void {
    // this.agGrid.api.autoSizeColumns();
    this.getPSPList();
    try {
      this._loader.start();
      this.reconService.getProfileValue('NUM_OF_RECORDS_ON_RECON_SCREEN', 'Application', 'Recon').subscribe((res: any) => {
        this._loader.stop();
        console.log(res);
        this.prfValue = parseInt(res.profileValue);
      });
    } catch (ex) {
      this._toaster.error(ex, 'ERROR');
    }
    // this.pspDataSource.sort = this.sort;
  }
  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }


  onFirstDataRendered(params) {
    params.api.forEachNode((node, index) => {
      const rowIndex = params.api.getRowNode(`${node.id}`).rowIndex + 1;
      node.setDataValue('sno', rowIndex);
    });
  }
  onRowSelected(event) {
    const row = event.data;
    if (row.f_reconciliation_flag === "Y") {
      return; // Skip selection if row has f_reconciliation_flag set to "Y"
    }
    this.pspcheck(row, event.rowIndex);
  }
  pspcheck(row: any, i: number) {
    const index = this.pspCheckeData.indexOf(row.F_RECORD_ID);
    const index1 = this.pspIndexes.indexOf(i);
    // const index1 = this.pspCheckeAmnt.indexOf(row.F_TRANSACTION_AMOUNT);
    if (index === -1) {
      this.pspCheckeData.push(row.F_RECORD_ID);

    } else {
      this.pspCheckeData.splice(index, 1);
    }
    if (index1 === -1) {
      this.pspIndexes.push(i);
    }
    else {
      this.pspIndexes.splice(index1, 1);
    }
    //  console.log(this.pspCheckeData);
    // console.log(this.pspIndexes);

  }
  onEZERowSelected(event) {
    const row = event.data;
    // const row = event.data;
    if (row.f_reconciliation_flag === "Y") {
      return; // Skip selection if row has f_reconciliation_flag set to "Y"
    }
    this.ezecheked(row, event.rowIndex);
  }
  ezecheked(row: any, i: number) {
    const index = this.ezeCheckeData.indexOf(row.F_RECORD_ID);
    //console.log(i);
    const index1 = this.ezeIndexes.indexOf(i);
    // const index1 = this.ezeCheckeAmnt.indexOf(row.F_TRANSACTION_AMOUNT);
    if (index === -1) {
      this.ezeCheckeData.push(row.F_RECORD_ID);
    } else {
      this.ezeCheckeData.splice(index, 1);
    }
    if (index1 === -1) {
      this.ezeIndexes.push(i);
    }
    else {
      this.ezeIndexes.splice(index1, 1);
    }
    //  console.log(this.ezeCheckeData);
    // console.log(this.ezeIndexes);
  }

  pspselectAll() {
    if (!this.pspselectAllChecked) {
      this.pspCheckeData = this.pspDataSource.map(row => row.F_RECORD_ID);
      this.pspCheckeAmnt = this.pspDataSource.map(row => row.F_TRANSACTION_AMOUNT);
    } else {
      this.pspCheckeData = [];
      this.pspCheckeAmnt = [];
    }
    console.log(this.pspCheckeData);
    // console.log(this.pspCheckeAmnt);
  }
  ezeselectAll() {
    if (!this.ezeselectAllChecked) {
      this.ezeCheckeData = this.cashDataSource.map(row => row.F_RECORD_ID);
      this.ezeCheckeAmnt = this.cashDataSource.map(row => row.F_TRANSACTION_AMOUNT);
    } else {
      this.ezeCheckeData = [];
      this.ezeCheckeAmnt = [];
    }
    // console.log(this.ezeCheckeData);
    // console.log(this.ezeCheckeAmnt);
  }
  Reconcile() {
    var pspTransactionsList = this.pspCheckeData.join() + ",";
    var ezeTransactionsList = this.ezeCheckeData.join() + ",";
    // console.log(pspTransactionsList);
    // console.log(ezeTransactionsList);
    // if(this.pspsum === this.ezesum){

    // }
    if (this.pspCheckeData.length > 0 || this.ezeCheckeData.length > 0) {
      const body = {
        mode: this.randomClass.queryType,
        pspTransIds: pspTransactionsList,
        ezeTransIds: ezeTransactionsList,
        pspSubAccId: this.subAcId,
        userId: sessionStorage.getItem('userId'),
        pspSubAccRole: this.subAcRole
      }
      this._loader.start();
      this.subSink.sink = this.reconService.reconcileRecords(body).subscribe((res: any) => {
        this._loader.stop();
        // console.log(res);
        if (res.result === "Records  Matching") {
          this._toaster.success(res.result, 'Success');
          if (this.pspIndexes) {
            for (let i = 0; i < this.pspIndexes.length; i++) {
              this.pspDataSource[this.pspIndexes[i]].f_reconciliation_flag = 'Y';
            }
            this.gridApi1.setRowData(this.pspDataSource);
            this.gridApi1.refreshCells();
            this.pspCheckeData = [];
            this.pspIndexes = [];
          }
          if (this.ezeIndexes) {
            for (let i = 0; i < this.ezeIndexes.length; i++) {
              this.cashDataSource[this.ezeIndexes[i]].f_reconciliation_flag = 'Y';
            }
            this.gridApi.setRowData(this.cashDataSource);
            this.gridApi.refreshCells();
            this.ezeCheckeData = [];

            this.ezeIndexes = [];
          }


        } else {
          this._toaster.error(res.result, 'Error');
        }
      });
    }
  }
  getPSPList() {
    var res = JSON.parse(sessionStorage.getItem('pspList'));
    const originalArray = res;
    this.pspNamesWithSubAccts = originalArray.map(item => {
      const currencyObj = item.currency[0]; // Assuming there's only one currency object per item
      return {
        pspName: item.pspName,
        subAccts: currencyObj.subAccts
      };
    });
    this.filteredPSPNames = this.ReconcilationForm.get('pspName').valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value.toLowerCase() : value),
      map(name => name ? this.filterPspNames(name) : this.pspNamesWithSubAccts.slice())
    );
  }
  filterPspNames(name: string) {
    return this.pspNamesWithSubAccts.filter(psp => psp.pspName.toLowerCase().indexOf(name) === 0);
  }
  displaySubAcct(subAcct: SubAcct): string {
    return subAcct ? subAcct.label : '';
  }
  onPspNameSelected(event: any) {
    this.ReconcilationForm.controls['subAcName'].reset()
    this.filteredSubAccts = [];
    const selectedPspName = event.option.value;
    const selectedPsp = this.pspNamesWithSubAccts.find(psp => psp.pspName === selectedPspName);
    this.filteredSubAccts = this.ReconcilationForm.get('subAcName').valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value.toLowerCase() : value),
      map(label => label ? this.filterSubAccts(label, selectedPsp.subAccts) : selectedPsp.subAccts.slice())
    );
  }
  filterSubAccts(label: string, subAccts: any[]) {
    return subAccts.filter(subAcct => subAcct.label.toLowerCase().indexOf(label) === 0);
  }

  onSubAcctSelected(event) {
    //console.log(event.option.value);
    this.subAcRole = event.option.value.type;
    this.subAcId = event.option.value.value;

  }
  Cancel() {
    this.ReconcilationForm = this.forminit();
    this.reconfrm.resetForm();
    this.filteredPSPNames = this.ReconcilationForm.get('pspName').valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value.toLowerCase() : value),
      map(name => name ? this.filterPspNames(name) : this.pspNamesWithSubAccts.slice())
    );
    this.ezeselectAllChecked = false;
    this.pspselectAllChecked = false;
    this.pspsum = 0;
    this.ezesum = 0;
    this.ezecount = 0;
    this.pspcount = 0;
    this.pspDataSource = [];
    this.cashDataSource = [];
    this.pspCheckeData = [];
    this.ezeCheckeData = [];
    this.pspCheckeAmnt = [];
    this.ezeCheckeAmnt = [];
  }

  randomMatchig() {
    const config = new MatDialogConfig();
    config.width = '1250px';
    config.height = '350px';
    config.disableClose = true;
    config.position = { left: '280px' };
    this.pspCheckeData = [];
    this.ezeCheckeData = [];
    this.pspCheckeAmnt = [];
    this.ezeCheckeAmnt = [];
    const dialogRef = this.matDialog.open(RandomMatchingComponent, config);
    dialogRef.componentInstance.dataSaved.subscribe((data) => {
      // console.log(data);
      this.randomClass.randomList = [];
      if (data.type === "Query") {
        this.randomClass.queryType = 'RANDOM';
        this.randomClass.sortOrder = '';
        this.randomClass.pspSubAccId = this.subAcId;
        this.randomClass.rangeStart = 0;
        this.randomClass.rangeEnd = this.prfValue;
        this.randomClass.dbSessionId = '';
        this.randomClass.userId = parseInt(sessionStorage.getItem('userId'));
        for (let i = 0; i < data.dataSource.length; i++) {
          this.randomClass.randomList.push({
            sequence: "",
            condition: data.dataSource[i].condition,
            columnName: "F_" + data.dataSource[i].columnName.label,
            dataType: data.dataSource[i].dataType,
            operand: data.dataSource[i].operand,
            query: data.dataSource[i].result
          });
        }
        // console.log(this.randomClass);
        this._loader.start();
        const reconPSPTransctions$ = this.reconService.reconPSPTransctions(this.randomClass);
        const reconEZETransctions$ = this.reconService.reconEZETransctions(this.randomClass);
        // Use forkJoin to make parallel requests
        this.subSink.sink = forkJoin([reconPSPTransctions$, reconEZETransctions$]).subscribe(([res1, res2]) => {
          this._loader.stop();
          // console.log(res1);
          // console.log(res2);
          this.pspcount = res1['count'];
          this.pspsum = res1['sum'];
          this.pspDataSource = res1['pspData'];
          this.ezecount = res2['count'];
          this.ezesum = res2['sum'];
          this.cashDataSource = res2['ezeData'];
        });
      }
      else if (data.type === "AllPsp") {
        // console.log(data);
        const body: Body = {
          pspResult: []
        };
        for (let i = 0; i < data.dataSource.length; i++) {
          const dataSourceItem = data.dataSource[i];
          const bodyItem = {
            sequence: dataSourceItem.slash,
            condition: dataSourceItem.condition,
            columnName: dataSourceItem.columnName.label,
            dataType: dataSourceItem.dataType,
            operand: dataSourceItem.operand,
            Value: dataSourceItem.value,
            query: dataSourceItem.result
          };
          body.pspResult.push(bodyItem);
        }
        // console.log(body);
        this._loader.start();
        this.subSink.sink = this.reconService.getAllList(body).subscribe((res: any) => {
          this._loader.stop();
          // console.log(res.result);
          this.generateRowData1(res.result);

          // const dialogConfig: MatDialogConfig = {
          //   width: '500px',
          //   height: '500px',
          //   data: {
          //     columnDefs: this.generateColumnDefs1(data),
          //     rowData: this.generateRowData1(data),
          //   },
          // };
          // this.matDialog.open(AllpspDialogComponent, dialogConfig);
          // const dialogRef = this.matDialog.open(AllpspDialogComponent, {
          //   width: '500px',
          //   height: '500px',
          // });
        });
        // const instance = dialogRef.componentInstance as AllpspDialogComponent;
        // instance.columnDefs = this.generateColumnDefs(data);
        // instance.rowData = this.generateRowData1(data);
      }
    });
  }
  openDialogWithData(rowData: any[], columnDefs: any[]) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.width = '80%';
    dialogConfig.height = '65%';
    dialogConfig.position = { left: '290px' };
    dialogConfig.disableClose = true,
      dialogConfig.data = { rowData, columnDefs }; // Pass rowData and columnDefs as data to the dialog
    const dialogRef = this.matDialog.open(AllpspDialogComponent, dialogConfig);
  }
  generateRowData1(data: any) {
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
    // console.log(this.columnDefs);
    // console.log(rowData);
    this.openDialogWithData(rowData, this.columnDefs);
    return rowData;
  }

  generateColumnDefs1(data: any) {
    const columnNames = Object.keys(data);
    return columnNames.map((columnName) => {
      let headerName = columnName;
      // let headerName = columnName.replace(/_/g, " ").substring(1);
      // headerName = headerName[0].toUpperCase() + headerName.substr(1);
      return {
        headerName, sortable: true,
        filter: true,
        resizable: true,
        field: columnName
      };
    });
  }

  generateColumnDefs(data: any) {
    const columnNames = Object.keys(data);
    return columnNames.map((columnName) => {
      let headerName = columnName.replace(/_/g, " ").substring(1);
      // headerName = headerName[0].toUpperCase() + headerName.substr(1);
      return {
        headerName, sortable: true,
        filter: true,
        resizable: true, field: columnName
      };
    });
  }
  allTransactions() {
    this.randomClass.randomList = [];
    this.randomClass.pspSubAccId = this.subAcId;
    this.randomClass.queryType = "SEARCH";
    this.randomClass.rangeEnd = this.prfValue;
    //console.log(this.randomClass);
    this._loader.start();
    this.subSink.sink = forkJoin([this.reconService.reconPSPTransctions(this.randomClass),
    this.reconService.reconEZETransctions(this.randomClass)]).subscribe(results => {
      // console.log(results);
      this._loader.stop();

      this.pspDataSource = results[0]['pspData'];
      const numRows = this.pspDataSource.length;

      // Generate an array of objects with the "sno" property set to the row number
      const snoColumn = Array.from({ length: numRows }, (_, index) => ({ sno: index + 1 }));
      this.pspcount = results[0]['count'];
      this.pspsum = results[0]['sum'];
      this.cashDataSource = results[1]['ezeData'];
      this.ezecount = results[1]['count'];
      this.ezesum = results[1]['sum'];
    });
    this.randomClass.pspname = this.ReconcilationForm.controls['pspName'].value;
  }
  generateRowData(data: any) {
    // this.columnDefs = this.generateColumnDefs(data);
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
  ngAfterViewInit() {
    // this.agGrid.api.sizeColumnsToFit();
    // this.agGrid.api.autoSizeColumns();
    // this.pspDataSource = new MatTableDataSource(results[0]['pspData']);
    // this.pspDataSource.sort = this.sort;
    this.pspDataSource.filterPredicate = (data, filter: string) => {
      const accumulator = (currentTerm: string, key: string) => {
        return currentTerm + (data as { [key: string]: any })[key] + '◬';
      };
      const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
      const transformedFilter = filter.trim().toLowerCase();
      return dataStr.indexOf(transformedFilter) !== -1;
    };

    this.cashDataSource.filterPredicate = (data, filter: string) => {
      const accumulator = (currentTerm: string, key: string) => {
        return currentTerm + (data as { [key: string]: any })[key] + '◬';
      };
      const dataStr = Object.keys(data).reduce(accumulator, '').toLowerCase();
      const transformedFilter = filter.trim().toLowerCase();
      return dataStr.indexOf(transformedFilter) !== -1;
    };
  }
  pspMatch() {
    // console.log(this.pspCheckeData);
    var psptransactionIdslist = this.pspCheckeData.join();
    const body = {
      transactionIds: psptransactionIdslist + ",",
      consideredTable: "PSP",
      mode: this.randomClass.queryType,
      pspSubAccId: this.subAcId,
      userId: sessionStorage.getItem('userId'),
      pspSubAccRole: this.subAcRole
    }
    console.log(body);
    // console.log(this.pspCheckeAmnt);
    if (this.pspCheckeData.length >= 2) {
      this._loader.start();
      this.subSink.sink = this.reconService.matchRecords(body).subscribe((res: any) => {
        this._loader.stop();
        if (res.result === "Records  Matching") {
          this._toaster.success(res.result, 'Success');
          // this.Cancel();
          if (this.pspIndexes) {
            for (let i = 0; i < this.pspIndexes.length; i++) {
              this.pspDataSource[this.pspIndexes[i]].f_reconciliation_flag = 'Y';
            }
            this.gridApi1.setRowData(this.pspDataSource);
            // this.gridApi1.refreshCells();
            this.pspCheckeData = [];
            this.pspIndexes = [];
          }
        }
        else {
          this._toaster.error(res.result, 'Error');
          return;
        }
      });
    }
  }
  ezeMatch() {
    var transactionIdslist = this.ezeCheckeData.join();
    const body = {
      transactionIds: transactionIdslist + ",",
      consideredTable: "EZE",
      mode: this.randomClass.queryType,
      pspSubAccId: this.subAcId,
      userId: sessionStorage.getItem('userId'),
      pspSubAccRole: this.subAcRole
    }
    if (this.ezeCheckeData.length >= 2) {
      this._loader.start();
      this.subSink.sink = this.reconService.matchRecords(body).subscribe((res: any) => {
        this._loader.stop();
        console.log(res);
        if (res.result === "Records  Matching") {
          this._toaster.success(res.result, 'Success');
          if (this.ezeIndexes) {
            for (let i = 0; i < this.ezeIndexes.length; i++) {
              this.cashDataSource[this.ezeIndexes[i]].f_reconciliation_flag = 'Y';
            }
            this.gridApi.setRowData(this.cashDataSource);
            this.gridApi.refreshCells();
            this.ezeCheckeData = [];
            this.ezeIndexes = [];
          }

        } else {
          this._toaster.error(res.result, 'Error');
          return;
          // this.Cancel();
        }
      });
    }
  }
  pspComment(row, i) {
    //console.log(row)
    //console.log(this.subAcRole);
    const config = new MatDialogConfig();
    config.width = '1250px';
    config.disableClose = true;
    config.position = { left: '270px' };
    config.data = { subAcRole: this.subAcRole, pspSubAccId: this.subAcId, sourceSide: 'PSPSIDE', recordId: row.F_RECORD_ID };
    // this.subAcId
    // config.data = this.frmtId;
    // if (this.frmtId) {
    const dialogRef = this.matDialog.open(CommentsComponent, config);
    dialogRef.afterClosed().subscribe((res: any) => {

    });
  }
  ezComment(row, i) {
    const config = new MatDialogConfig();
    config.width = '1150px';
    config.disableClose = true;
    config.position = { left: '300px' };
    config.data = { subAcRole: this.subAcRole, pspSubAccId: this.subAcId, sourceSide: 'EZESIDE', recordId: row.F_RECORD_ID };
    // config.data = { subID: this.subAcId, fileFomatId: this.fileformatId };;
    // this.subAcId
    // config.data = this.frmtId;
    // if (this.frmtId) {
    const dialogRef = this.matDialog.open(CommentsComponent, config);
    dialogRef.afterClosed().subscribe((res: any) => {
      //console.log('Popup closed');
      //console.log(res);
    });
  }

  unpspReconcile(row, i) {
    // //console.log(this.pspCheckeData);
    // var pspTransactionsList = this.pspCheckeData.join() + ",";
    //console.log(row, i);
    this.randomClass.randomList = [];
    this.randomClass.pspSubAccId = this.subAcId;
    this.randomClass.sourceSide = "PSP";
    this.randomClass.recordId = row.F_RECORD_ID;
    this.randomClass.subAcRole = this.subAcRole
    // console.log(this.randomClass);
    this.randomClass.pspname = this.ReconcilationForm.controls['pspName'].value;
    const config = new MatDialogConfig();
    config.width = '1250px';
    config.height = '650px';
    config.disableClose = true;
    config.position = { left: '280px' };
    config.data = this.randomClass;
    const dialogRef = this.matDialog.open(UnReconcileComponent, config);
  }
  unEZEReconcile(row, i) {
    // //console.log(this.ezeCheckeData);
    // var ezeTransactionsList = this.ezeCheckeData.join() + ",";
    //console.log(row, i);
    this.randomClass.randomList = []
    this.randomClass.pspSubAccId = this.subAcId;
    this.randomClass.sourceSide = "EZE";
    this.randomClass.recordId = row.F_RECORD_ID;
    //console.log(this.randomClass);
    this.randomClass.pspname = this.ReconcilationForm.controls['pspName'].value;
    const config = new MatDialogConfig();
    config.width = '1250px';
    config.height = '650px';
    config.disableClose = true;
    config.position = { left: '280px' };
    config.data = this.randomClass;
    const dialogRef = this.matDialog.open(UnReconcileComponent, config);
  }
}

@Component({
  selector: 'app-header-icon',
  template: `<i class="fas fa-comment"></i>`
})
export class HeaderIconComponent {
  public params: IHeaderParams;

  agInit(params: IHeaderParams): void {
    this.params = params;
  }

  refresh(params: IHeaderParams): boolean {
    return true;
  }
}

