import { Component, EventEmitter, Inject, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ReconcilationService } from '@services/reconcilation.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { parse } from 'path';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-un-reconcile',
  templateUrl: './un-reconcile.component.html',
  styleUrls: ['./un-reconcile.component.scss']
})
export class UnReconcileComponent implements OnInit, OnDestroy {
  @ViewChild('reconfrm') public reconfrm!: NgForm;
  @Output() dataSaved = new EventEmitter<any>();
  public UnReconcilationForm: FormGroup;
  public pspDataSource: any = [];
  public ezeDataSource: any = [];
  public ezeCheckeData: any = [];
  public pspCheckeData: any = [];
  private subAcRole: string;
  public unMachRecon: boolean = false;
  pspselectAllChecked = false;
  ezeselectAllChecked = false;
  private pspTotal = 0;
  private ezeTotal = 0;
  isCheckedEze = {
    1: true,
    2: false,
    3: true
  };

  public body = {
    pspIds: "",
    ezeIds: "",
    userId: "",
    pspSubAccRole: ""
  }
  displayedColumns1: string[] = [
    "sno",
    "Comments",
    "All",
    "UR",
    "ME",
    'F_TRANSACTION_DATE',
    'F_VALUE_DATE',
    'F_PSP_REFERENCE',
    'F_EZECASH_REFERENCE',
    'F_TRANSACTION_AMOUNT',
    'F_TRANSACTION_CURRENCY',
    'F_REMARKS',
    'F_ISSUE',
    'F_ACTION_TYPE',
    'F_ROLE',
    'f_update_side',
    'F_RECONCILIATION_METHOD',
    'F_RECON_TYPE',
    'F_RECONCILIATION_TYPE',
    'f_file_name',
    'f_reconciliation_flag',
    'F_RECONCILIATION_STATUS',
    'F_RECON_DATE',
    'F_POINT_IN_RECON_DATE',
    'F_NARRATIVE',
    'F_PLAYER_FIRST_NAME',
    'F_PLAYER_SECOND_NAME',
    'F_PLAYER_INFORMATION_1',
    'F_PLAYER_INFORMATION_2',
    'F_PSP_TRANSACTION_STATUS_1',
    'F_PSP_TRANSACTION_STATUS_2',
    'F_EZECASH_TRANSACTION_STATUS',
    'F_EZECASH_DEPOSIT_REFERENCE_ID',
    'F_EZECASH_PLAYER_ID',
    'F_EZECASH_PROCESSING_AGENT_ID',
    'F_EZECASH_PAYMENT_MODE',
    'F_EZECASH_TRANSACTION_CATEGORY',
    'F_EZECASH_PROCESSOR_CATEGORY',
    'F_BASE_AMOUNT',
    'F_BASE_CURRENCY',
    'F_ACCOUNT_AMOUNT',
    'F_ACCOUNT_CURRENCY',
    'F_SETTLEMENT_AMOUNT',
    'F_SETTLEMENT_CURRENCY',
    'F_FRONT_END',
    'F_PRODUCT',
    'F_COUNTRY',
  ]

  displayedColumns2 = [
    "sno",
    "Comments",
    "All",
    "UR",
    "ME",
    'F_TRANSACTION_DATE',
    'F_VALUE_DATE',
    'F_PSP_REFERENCE',
    'F_EZECASH_REFERENCE',
    'F_TRANSACTION_AMOUNT',
    'F_TRANSACTION_CURRENCY',
    'F_REMARKS',
    'F_ISSUE',
    'F_ACTION_TYPE',
    'F_ROLE',
    'f_update_side',
    'F_RECONCILIATION_METHOD',
    'F_RECON_TYPE',
    'F_RECONCILIATION_TYPE',
    'f_file_name',
    'f_reconciliation_flag',
    'F_RECONCILIATION_STATUS',
    'F_RECON_DATE',
    'F_POINT_IN_RECON_DATE',
    'F_NARRATIVE',
    'F_PLAYER_FIRST_NAME',
    'F_PLAYER_SECOND_NAME',
    'F_PLAYER_INFORMATION_1',
    'F_PLAYER_INFORMATION_2',
    'F_PSP_TRANSACTION_STATUS_1',
    'F_PSP_TRANSACTION_STATUS_2',
    'F_EZECASH_TRANSACTION_STATUS',
    'F_EZECASH_DEPOSIT_REFERENCE_ID',
    'F_EZECASH_PLAYER_ID',
    'F_EZECASH_PROCESSING_AGENT_ID',
    'F_EZECASH_PAYMENT_MODE',
    'F_EZECASH_TRANSACTION_CATEGORY',
    'F_EZECASH_PROCESSOR_CATEGORY',
    'F_BASE_AMOUNT',
    'F_BASE_CURRENCY',
    'F_ACCOUNT_AMOUNT',
    'F_ACCOUNT_CURRENCY',
    'F_SETTLEMENT_AMOUNT',
    'F_SETTLEMENT_CURRENCY',
    'F_FRONT_END',
    'F_PRODUCT',
    'F_COUNTRY',

  ]
  pspselectChecked: boolean = false;
  ezeselectChecked: boolean = false;
  constructor(private fb: FormBuilder, private matDialog: MatDialog,
    private subSink: SubSink, private _loader: NgxUiLoaderService, private _toaster: ToastrService,
    private reconService: ReconcilationService, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.UnReconcilationForm = this.forminit();

  }

  forminit() {
    const fb = new FormBuilder();
    const formGroup = fb.group({
      psp: [''],
    });

    formGroup.get('psp').disable(); // Disabling the 'psp' form control

    return formGroup;
  }
  ngOnInit(): void {
    //console.log(this.data);
    this.refresh(this.data);
    this.subAcRole = this.data.subAcRole;
  }
  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }
  refresh(data: any) {
    try {
      //console.log(data.sourceSide);
      this.UnReconcilationForm.controls['psp'].setValue(this.data.pspname);
      if (data.sourceSide === 'PSP') {
        this._loader.start();
        this.subSink.sink = this.reconService.getpspUnreconcileRecords(this.data).subscribe((res: any) => {
          this._loader.stop();
          // console.log(res);
          if (res.error != undefined && res.error != null && res.error != '') {
            this._toaster.error(res.error, "Error")
            return;
          }
          // console.log(res.unreconciliationInfo.PSP);
          if (res.unreconciliationInfo.PSP != undefined) {
            this.pspDataSource = res.unreconciliationInfo.PSP;
          }
          if (res.unreconciliationInfo.EZE != undefined) {
            this.ezeDataSource = res.unreconciliationInfo.EZE;
          }
          //console.log(res.unreconciliationInfo.EZE);
          if (this.pspDataSource.length > 0 && this.ezeDataSource.length > 0) {
            this.unMachRecon = false;
          } else {
            this.unMachRecon = true;
          }
        });
      } if (data.sourceSide === 'EZE') {
        this._loader.start();
        this.subSink.sink = this.reconService.getezeUnreconcileRecords(this.data).subscribe((res: any) => {
          this._loader.stop();
          // console.log(res);

          if (res.error != undefined && res.error != null && res.error != '') {
            this._toaster.error(res.error, "Error")
            return;
          }
          //console.log(res.unreconciliationInfo.PSP);
          if (res.unreconciliationInfo.PSP != undefined) {
            this.pspDataSource = res.unreconciliationInfo.PSP;
          }
          if (res.unreconciliationInfo.EZE != undefined) {
            this.ezeDataSource = res.unreconciliationInfo.EZE;
          }
          // if (res.status != undefined && res.status != null && res.status != '') {
          //   this._toaster.error(res.staus, "Error")

          // }

          if (this.pspDataSource.length > 0 && this.ezeDataSource.length > 0) {
            this.unMachRecon = false;
          } else {
            this.unMachRecon = true;
          }
        });
      }
    }
    catch (ex) {
      this._toaster.error(ex, 'ERROR')
    }
  }
  ezeselectAll() {
    this.ezeCheckeData = [];
    // if (!this.ezeselectAllChecked) {
    //   this.ezeCheckeData = this.ezeDataSource.map(row => row.F_RECORD_ID);
    // } else {
    //   this.ezeCheckeData = [];
    // }
    this.ezeselectAllChecked = !this.ezeselectAllChecked;
    for (const row of this.ezeDataSource) {
      row.isSelected = this.ezeselectAllChecked;
    }
    for (const row of this.ezeDataSource) {
      this.isCheckedEze[row.F_RECORD_ID] = this.ezeselectAllChecked;
      if (this.ezeselectAllChecked) {
        this.ezeCheckeData.push({ id: row.F_RECORD_ID }); // Add all record IDs to the array of selected data
      }
    }
    // console.log(this.ezeCheckeData);
  }
  pspselectAll() {
    // console.log('from psp select all');
    this.pspCheckeData = []; // Clear the array of selected data
    this.pspselectAllChecked = !this.pspselectAllChecked;

    // Check/uncheck all checkboxes in the rows
    for (const row of this.pspDataSource) {
      row.isSelected = this.pspselectAllChecked;
    }
    for (const row of this.pspDataSource) {
      this.isCheckedEze[row.F_RECORD_ID] = this.pspselectAllChecked;
      if (this.pspselectAllChecked) {
        this.pspCheckeData.push({ id: row.F_RECORD_ID }); // Add all record IDs to the array of selected data
      }
    }
  }
  cancel() {
    this.matDialog.closeAll();
    this.pspCheckeData = [];
    this.ezeCheckeData = [];
    this.ezeDataSource = [];
    this.pspDataSource = [];
    this.ezeselectAllChecked = false;
    this.pspselectAllChecked = false;
    this.pspselectChecked = false;
    this.ezeselectChecked = false;
  }
  // pspcheck(row: any, i: number) {
  //   const index = this.pspCheckeData.findIndex(item => item === row.F_RECORD_ID);
  //   if (index === -1 && this.isCheckedEze[row.F_RECORD_ID]) {
  //     this.pspCheckeData.push({ id: row.F_RECORD_ID, amount: row.F_TRANSACTION_AMOUNT });
  //   } else if (index !== -1 && !this.isCheckedEze[row.F_RECORD_ID]) {
  //     this.pspCheckeData.splice(index, 1);
  //   } else if (index !== -1 && this.isCheckedEze[row.F_RECORD_ID]) {
  //     this.pspCheckeData[index].amount += row.F_TRANSACTION_AMOUNT;
  //   }
  //   let total = 0;
  //   // console.log(this.pspCheckeData);
  //   this.pspCheckeData.forEach(item => {
  //     total += parseInt(item.amount);
  //   });
  //   // console.log(total);
  //   this.pspTotal = total;
  // }
  // ezecheked(row: any, i: number) {
  //   const index = this.ezeCheckeData.findIndex(item => item === row.F_RECORD_ID);
  //   if (index === -1 && this.isCheckedEze[row.F_RECORD_ID]) {
  //     this.ezeCheckeData.push({ id: row.F_RECORD_ID, amount: row.F_TRANSACTION_AMOUNT });
  //   } else if (index !== -1 && !this.isCheckedEze[row.F_RECORD_ID]) {
  //     this.ezeCheckeData.splice(index, 1);
  //   } else if (index !== -1 && this.isCheckedEze[row.F_RECORD_ID]) {
  //     this.ezeCheckeData[index].amount += row.F_TRANSACTION_AMOUNT;
  //   }
  //   let total = 0;
  //   // console.log(this.ezeCheckeData);
  //   this.ezeCheckeData.forEach(item => {
  //     total += parseInt(item.amount);
  //   });
  //   // console.log(total);
  //   this.ezeTotal = total;
  // }
  pspcheck(row: any, i: number) {
    const index = this.pspCheckeData.findIndex(item => item.id === row.F_RECORD_ID);
    this.pspselectChecked = !this.pspselectChecked;
    this.isCheckedEze[row.F_RECORD_ID] = this.pspselectChecked;
    row.isSelected = this.pspselectChecked;
    console.log("row is isCheckedEze    " + this.isCheckedEze[row.F_RECORD_ID]);
    if (row.isSelected) {
      // When checked, add to pspCheckeData or update if already present
      if (index === -1) {
        this.pspCheckeData.push({ id: row.F_RECORD_ID, amount: row.F_TRANSACTION_AMOUNT });
      } else {
        this.pspCheckeData[index].amount += row.F_TRANSACTION_AMOUNT;
      }
    } else {
      // When unchecked, remove from pspCheckeData if present
      if (index !== -1) {
        // Subtract the amount from the item, or remove it if the amount becomes zero
        this.pspCheckeData[index].amount -= row.F_TRANSACTION_AMOUNT;
        if (this.pspCheckeData[index].amount <= 0) {
          this.pspCheckeData.splice(index, 1);
        }
      }
    }
    let total = 0;
    this.pspCheckeData.forEach(item => {
      total += parseInt(item.amount);
    });
    this.pspTotal = total;
  }
  ezecheked(row: any, i: number) {
    const index = this.ezeCheckeData.findIndex(item => item.id === row.F_RECORD_ID);
    this.ezeselectChecked = !this.ezeselectChecked;
    row.isSelected = this.ezeselectChecked;
    if (row.isSelected) {
      // When checked, add to pspCheckeData or update if already present
      if (index === -1) {
        this.ezeCheckeData.push({ id: row.F_RECORD_ID, amount: row.F_TRANSACTION_AMOUNT });
      } else {
        this.ezeCheckeData[index].amount += row.F_TRANSACTION_AMOUNT;
      }
    } else {
      // When unchecked, remove from pspCheckeData if present
      if (index !== -1) {
        // Subtract the amount from the item, or remove it if the amount becomes zero
        this.ezeCheckeData[index].amount -= row.F_TRANSACTION_AMOUNT;
        if (this.ezeCheckeData[index].amount <= 0) {
          this.ezeCheckeData.splice(index, 1);
        }
      }
    }
    let total = 0;
    this.ezeCheckeData.forEach(item => {
      total += parseInt(item.amount);
    });
    this.ezeTotal = total;
  }
  unReconcile() {
    debugger;
    try {
      if (this.pspTotal != this.ezeTotal) {
        this._toaster.error("Records are not matching", 'Error');
        return;
      } else {
        var pspTransactionsList = this.pspCheckeData.map(item => item.id).join(',') + ',';
        var ezeTransactionsList = this.ezeCheckeData.map(item => item.id).join(',') + ',';
        // console.log(pspTransactionsList, ezeTransactionsList);
        this.body = {
          pspIds: pspTransactionsList,
          ezeIds: ezeTransactionsList,
          pspSubAccRole: this.subAcRole,
          userId: sessionStorage.getItem('userId')
        }
        // console.log(this.body);
        this._loader.start();
        this.subSink.sink = this.reconService.unreconcileRecords(this.body).subscribe((res: any) => {
          this._loader.stop();
          // console.log(res);
          // this.matDialog.closeAll();
          // this._toaster.success(res.unreconciliationStatus, 'Success');
          if (res.unreconciliationStatus === 'Records  Matching') {
            this._toaster.success(res.unreconciliationStatus, 'Success');
          } else {
            this._toaster.error(res.unreconciliationStatus, 'Error');
          }
        });
      }

    }
    catch (ex) {
      this._toaster.error(ex, 'ERROR')
    }
  }
  undoMatch() {
    try {
      if (this.pspDataSource.length > 0) {
        var pspTransactionsList = this.pspCheckeData.map(item => item.id).join(',') + ',';
        const body = {
          transactionIds: pspTransactionsList,
          consideredTable: "PSP",
          userId: sessionStorage.getItem('userId'),
          pspSubAccRole: this.subAcRole
        }
        //console.log(body)
        this._loader.start();
        this.subSink.sink = this.reconService.undoMatching(body).subscribe((res: any) => {
          this._loader.stop();
          // console.log(res);
          if (res.result === 'Records  Matching') {
            this._toaster.success(res.result, 'Success');
            // this.pspDataSource=[];
          } else {
            this._toaster.error(res.result, 'Error');
          }
        });
      }
      if (this.ezeDataSource.length > 0) {
        var ezeTransactionsList = this.ezeCheckeData.map(item => item.id).join(',') + ',';
        const body = {
          transactionIds: ezeTransactionsList,
          consideredTable: "EZE",
          userId: sessionStorage.getItem('userId'),
          pspSubAccRole: this.subAcRole
        }
        this._loader.start();
        this.subSink.sink = this.reconService.undoMatching(body).subscribe((res: any) => {
          this._loader.stop();
          if (res.result === 'Records  Matching') {
            this._toaster.success(res.result, 'Success');
          } else {
            this._toaster.error(res.result, 'Error');
          }
        });
      }
    }
    catch (ex) {
      this._toaster.error(ex, 'ERROR')
    }
  }
}
