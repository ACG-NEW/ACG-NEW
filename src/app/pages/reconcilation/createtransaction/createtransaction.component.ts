import { Component, EventEmitter, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTable } from '@angular/material/table';
import { transctionClass } from '@modules/modal/transaction.modal';
import { ReconcilationService } from '@services/reconcilation.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { map, startWith } from 'rxjs/operators';
import { SubSink } from 'subsink';
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
export interface batch {
  batchId: string;
  headerId: string;
}
@Component({
  selector: 'app-createtransaction',
  templateUrl: './createtransaction.component.html',
  styleUrls: ['./createtransaction.component.scss']
})
export class CreatetransactionComponent implements OnInit {
  public createTransactionForm: FormGroup;
  @Output() dataSaved = new EventEmitter<any>();
  @ViewChild('table') table: MatTable<Element>
  public dataSource: any = [];
  public rowData: Array<any> = [];
  private subAcId: string;
  public batchId: string;
  public pspId: string;
  public role: string;
  public userId: string;
  public headerId: string;
  public pspSubAccId: string;
  filteredPSPNames: any;
  filteredbatchId: any;
  filteredSubAccts: any;
  public batchIdList: any = [];
  pspNamesWithSubAccts: PSPName[] = [];
  public sourceSideList: any;
  public transactionTypeList: any;
  public soureNamesList: any;
  public nameTmp: boolean = false;
  public countryNamesList: any;
  public productNamesList: any;
  public transactionAccountingList: any;
  public chargeCreationNamesList: any;
  public accountChargeNamesList: any;
  public accountreservesNamesList: any;
  private transcls: transctionClass;
  displayedColumns = [
    'serialNo',
    'clear',
    'rejc',
    'aprv',
    'transType',
    'sourceSide',
    'sourceRef',
    'ref',
    'currency',
    'transDate',
    'accountingDate',
    'amount',
    'baseAmount',
    'baseCurrency',
    'baseAmountEur',
    'accountAmount',
    'accountCurrency',
    'settlementAmount',
    'settlementCurrency',
    'country',
    'product',
    'transactionAccounting',
    'ac',
    'chargeReserveCreation',
    'accountingForCharges',
    'accountingForReserves',
    'insertIntoSource',
    'remarks',
    'pspReference',
    'ezeReference',
    'status',
    'delete'
  ];
  constructor(private fb: FormBuilder, private _loader: NgxUiLoaderService, private dialog: MatDialog, private _toaster: ToastrService,
    private subSink: SubSink, private reconService: ReconcilationService) {
    this.createTransactionForm = this.forminit();
    this.transcls = new transctionClass();

  }

  ngOnInit(): void {
    this.getPSPList();

  }

  TransactionList() {
    try {
      this.userId = sessionStorage.getItem('userId');
      this.headerId = this.headerId;
      this.role = this.role;
      this.pspId = this.pspId;
      this._loader.start();
      this.subSink.sink = this.reconService.getTransactionList(this.pspId, this.role, this.userId, this.headerId).subscribe((res: any) => {
        this._loader.stop();
        // console.log(res);
      })
    }
    catch (ex) {
      this._toaster.error(ex, 'ERROR')
    }
  }
  onbatchId(event) {
    try {
      // console.log(event.option.value);
      this.batchId = event.option.value.batchId;
      this.headerId = event.option.value.headerId;
      this.userId = sessionStorage.getItem('userId');
      this._loader.start();
      this.subSink.sink = this.reconService.getTransaction(this.subAcId, this.role, this.userId, this.headerId).subscribe((res: any) => {
        this._loader.stop();
        // console.log(res);
        this.transactionTypeList = res.transactionType;
        this.soureNamesList = res.sources;
        this.countryNamesList = res.country;
        this.productNamesList = res.product;
        this.transactionAccountingList = res.transactionAccounting;
        this.chargeCreationNamesList = res.chargeCreation;
        this.accountChargeNamesList = res.accountingForCharges;
        this.accountreservesNamesList = res.accountingForReserves;
        // console.log(res.transactionList);
        if (res.transactionList) {
          for (let i = 0; i < res.transactionList.length; i++) {
            if (res.transactionList[i].transDate != "") {
              var tranDate = this.stringToDate(res.transactionList[i].transDate);
              var accDate = this.stringToDate(res.transactionList[i].accountingDate);
              res.transactionList[i].transDate = tranDate;
              res.transactionList[i].accountingDate = accDate;
            }
          }
          this.dataSource = res.transactionList;
          this.table.renderRows();
        }
        this.sourceSideList = res.sourceSide;

      })
    }
    catch (ex) {
      this._toaster.error(ex, 'ERROR')
    }
  }
  stringToDate(dateString: string): Date {
    if (!dateString) {
      return null; // or throw an error, depending on your use case
    }
    const parts = dateString.split('/');
    return new Date(+parts[2], +parts[1] - 1, +parts[0]);
  }
  onSubAcctSelected(event) {
    try {
      // console.log(event.option.value.value);
      this.subAcId = event.option.value.value;
      this.batchId = '';
      this._loader.start();
      this.subSink.sink = this.reconService.getBatchId(this.subAcId, this.batchId).subscribe((res: any) => {
        this._loader.stop();
        // console.log(res);
        this.batchIdList = res.batchId_list;
        this.filteredbatchId = this.createTransactionForm.get('batchNo').valueChanges.pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value.toLowerCase() : value),
          map(name => name ? this.filterbatch(name) : this.batchIdList.slice())
        );
      });
    }
    catch (ex) {
      this._toaster.error(ex, 'ERROR')
    }
  }
  filterbatch(label: string) {
    return this.batchIdList.filter(name => name.batchId.toLowerCase().indexOf(label) === 0);
  }
  displayBatch(bID: batch): string {
    return bID ? bID.batchId : '';
  }
  getPSPList() {
    var res = JSON.parse(sessionStorage.getItem('pspList'));
    // console.log(res);
    const originalArray = res;
    this.pspNamesWithSubAccts = originalArray.map(item => {
      const currencyObj = item.currency[0]; // Assuming there's only one currency object per item
      return {
        pspName: item.pspName,
        subAccts: currencyObj.subAccts
      };
    });
    this.filteredPSPNames = this.createTransactionForm.get('pspName').valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value.toLowerCase() : value),
      map(name => name ? this.filterPspNames(name) : this.pspNamesWithSubAccts.slice())
    );
  }
  filterPspNames(name: string) {
    return this.pspNamesWithSubAccts.filter(psp => psp.pspName.toLowerCase().indexOf(name) === 0);
  }

  onPspNameSelected(event: any) {
    this.createTransactionForm.controls['subAcName'].reset()
    this.filteredSubAccts = [];
    const selectedPspName = event.option.value;
    const selectedPsp = this.pspNamesWithSubAccts.find(psp => psp.pspName === selectedPspName);
    this.filteredSubAccts = this.createTransactionForm.get('pspName').valueChanges.pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value.toLowerCase() : value),
      map(label => label ? this.filterSubAccts(label, selectedPsp.subAccts) : selectedPsp.subAccts.slice())
    );
    this.nameTmp = true;

  }

  filterSubAccts(label: string, subAccts: any[]) {
    return subAccts.filter(subAcct => subAcct.label.toLowerCase().indexOf(label) === 0);
  }


  forminit() {
    return this.fb.group({
      pspName: [''],
      subAcName: ['',],
      type: ['TRANSACTION'],
      batchNo: ['',],
      transactionSide: ['',],

    });

  }
  addRow() {
    const obj = ({
      lineId: '',
      reject: '',
      approve: '',
      transactionType: '',
      sourceSide: '',
      sourceRef: '',
      currency: '',
      transDate: '',
      accountingDate: '',
      amount: '',
      baseAmount: '',
      baseAmountEur: '',
      baseAmountGbp: '',
      accountAmount: '',
      accountCurrency: '',
      settlementAmount: '',
      settlementCurrency: '',
      country: '',
      product: '',
      transactionAccounting: '',
      chargeCreation: '',
      accountingCharges: '',
      accountingReserves: '',
      insert: '',
      remarks: '',
      pspReference: '',
      ezReference: '',
      rowId: '',
      recordId: '',
      manualFileName: ''

    });
    this.dataSource.push(obj);
    this.table.renderRows();

  }
  displaySubAcct(subAcct: SubAcct): string {
    return subAcct ? subAcct.label : '';
  }



  saveDetails() {
    // if (this.subAcId) {
    //   this.transcls.pspSubAccountId = this.subAcId;
    //   this.transcls.dis = 'true';
    // } else {
    //   this.transcls.pspSubAccountId = '';
    //   this.transcls.disableMode = 'false';
    // }
    try {
      // console.log(this.createTransactionForm)
      this.transcls.pspname = this.createTransactionForm.controls['pspName'].value;
      this.transcls.pspSubAccountId = this.createTransactionForm.controls['subAcName'].value.value;
      this.transcls.type = this.createTransactionForm.controls['type'].value;
      this.transcls.deletedLineData = [];
      var userId = sessionStorage.getItem('userId');
      this.transcls.modifiedLineItems = this.dataSource;
      // console.log(this.transcls)
      this._loader.start();
      this.subSink.sink = this.reconService.saveTransaction(this.transcls, userId).subscribe((res: any) => {
        this._loader.stop();
        // console.log(res);
      });
    }
    catch (ex) {
      this._toaster.error(ex, 'ERROR')
    }
  }
  Cancel() {
    this.dataSource = [];
    this.createTransactionForm = this.forminit();
    var dialogRef: MatDialogRef<any>
    // dialogRef.close();
    this.dialog.closeAll();
    // this.CloseDialog();

  }
  clearRow(row, i) {

  }
  Delete(i) {
    this.dataSource.splice(i, 1);
    this.table.renderRows();
  }
  Refresh() {

  }
}
