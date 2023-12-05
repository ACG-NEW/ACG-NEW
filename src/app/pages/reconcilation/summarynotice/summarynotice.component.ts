import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-summarynotice',
  templateUrl: './summarynotice.component.html',
  styleUrls: ['./summarynotice.component.scss']
})
export class SummarynoticeComponent implements OnInit {
  //ViewChild('summaryfrm')  summaryfrm!: NgForm;
  public summaryNoticeForm: FormGroup;
  public RowData: Array<any> = [];
  public DataSource: any = [];

  @ViewChild('table') table: MatTable<Element>

  displayedColumns = [
    'sno',
    'psp',
    'pspSubAcAccount',
    'source',
    'role',
    'numberOfTransactions',
    'show',

  ];

  constructor(private fb: FormBuilder, private router: Router, private subSink: SubSink) {
    this.summaryNoticeForm = this.formInit();
  }

  ngOnInit(): void {

    const Obj = ({
      sno: '',
      psp: '',
      pspSubAcAccount: '',
      role: '',
      numberOfTransactions: '',
      txnType: '',
      show: '',
    });
    this.RowData.push(Obj);
    this.DataSource = new MatTableDataSource(this.RowData);
  }
  formInit() {
    return this.fb.group({

    })
  }
  saveDetails() {

  }
  Cancel() {

  }
  Delete(i) {

  }

}
