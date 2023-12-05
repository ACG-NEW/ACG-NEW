import { Component, OnInit, ViewChild } from '@angular/core';
import { status } from '@/enums/enum';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ManageJobsService } from '@services/manageJobs.service';
import { ColumnApi, GridApi, GridOptions } from 'ag-grid-community';
import { AccessSettings } from '@/utils/access-settings';
@Component({
  selector: 'app-define-job',
  templateUrl: './define-job.component.html',
  styleUrls: ['./define-job.component.scss']
})
export class DefineJobComponent implements OnInit {
  public dialogHeaderText: string;
  public dialogDisplay: boolean;
  public jobCondition: string;
  public jobName: string;
  public jobNameError: string;
  public isjobNameError: boolean;
  defineJobForm: FormGroup;
  errors: any[];
  validationErrors: any[];
  public errorMsg: string;
  public isErrorMsg: boolean;
  public list: any[];
  public tmp: boolean;
  public tmp1: boolean;
  public frameworkComponents;
  public gridOptions: GridOptions;
  private gridApi: GridApi;
  private columnApi: ColumnApi;
  pageSizes = [25, 50, 100, 250, 500];
  pageSize = 25;
  columnDefs = [
    { headerName: 'ProgramName', field: 'program_name', cellRenderer: 'agLnkRenderer' },
    { headerName: 'ProgramId', field: 'program_id' },
    { headerName: 'LastRunDate', field: 'last_update', cellRenderer: 'agDateFormatRenderer' },
  ];
  rowData = [];

  constructor(private manageJobsService: ManageJobsService,private fb: FormBuilder,) {
    this.dialogHeaderText = 'Enter Program';
    this.dialogDisplay = false;
    this.initForm();
  }

  ngOnInit() {

  }
  search() {
    this.resetValidations();

    if (this.jobName == null || this.jobName === undefined || this.jobName.trim() === '' ||
      this.jobCondition == null || this.jobCondition === '--Select--') {
      this.jobNameError = 'Required !';
      this.isjobNameError = true;
      this.errors.push(this.jobNameError);
    }

    if (this.jobName != null) {
      if (/^[a-zA-Z0-9-,_ ]*$/.test(this.jobName) == false) {
        this.jobNameError = ' Please provide a valid value ! ';
        this.isjobNameError = true;
        this.errors.push(this.jobNameError);
      }
    }
    // tslint:disable-next-line: align
    if (this.jobCondition === 'In' && this.jobName != null) {
      if (/^[a-zA-Z0-9-,_ ]*$/.test(this.jobName) === false) {
        this.jobNameError = 'Please provide valid comma seperated values!';
        this.isjobNameError = true;
        this.errors.push(this.jobNameError);
      }
    }

    if (this.errors.length === 0) {
      // this.spinnerService.notify('show');
      this.manageJobsService.getPrograms(this.jobName, this.jobCondition).subscribe(
        response => {
          // this.spinnerService.notify('hide');
          if (response['status'] === AccessSettings.SUCCESS) {
            this.rowData = response['programs'];
            // console.log(response['programs']);
          } else {
            this.errorMsg = response['errormsg'];
          }
        },
        error => {
          // this.spinnerService.notify('hide');
          console.log('search porgrams', error);
        }
      );
    }
  }
  addProgramClick() {
    this.dialogDisplay = true;
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
  }
  onLnkClicked(cell) {
    this.dialogDisplay = true;
    // this.addProgram.refresh(cell.data.program_id);

  }
  onRowSelected(event) {
    const row = event.data;
    console.log(row);
    // this.pspcheck(row, event.rowIndex);
  }
  onSelectionChanged(event) {
    const row = event.data;
    console.log(row);
  }
  addJobClick() {

  }
  cancel() {
    this.jobCondition = '--Select--';
    this.jobName = '';
    this.resetValidations();
  }

  resetValidations() {
    this.isjobNameError = false;
    this.jobNameError = '';
    this.errors = [];
  }

  formInit() {
    this.dialogDisplay = false;
    this.isErrorMsg = false;
    this.errorMsg = '';

  }
  onPageSizeChanged() {
    if (this.gridApi) {
      this.gridApi.paginationSetPageSize(this.pageSize);
    }
  }

  initForm() {
    this.defineJobForm = this.fb.group({
      jobCondition: [''],
      jobName: ['', Validators.required],
    });
  }

}
