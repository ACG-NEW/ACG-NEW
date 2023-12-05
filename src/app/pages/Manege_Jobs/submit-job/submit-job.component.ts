import { AccessSettings } from '@/utils/access-settings';
import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { ManageJobsService } from '@services/manageJobs.service';
import { ColumnApi, GridApi, GridOptions } from 'ag-grid-community';
import { Subject, Observable } from 'rxjs';
import { JobSchedule } from '../manage-jobs.modal';
@Component({
  selector: 'app-submit-job',
  templateUrl: './submit-job.component.html',
  styleUrls: ['./submit-job.component.scss']
})
export class SubmitJobComponent implements OnInit {
  defineJobForm: FormGroup;
  public dialogHeaderText: string;
  public dialogDisplay: boolean;
  public jobCondition: string;
  public jobName: string;
  public jobNames: string;
  public jobNameError: string;
  public isjobNameError: boolean;
  errors: any[];
  public submitted: boolean;
  public errorMsg: string;
  public progId;
  // public jobParams:progpramMap;
  public jobParams: any[];
  public paramterArray: any;
  public scheduleForm: FormGroup;
  public animationState = 'out';
  public selectedSchedule: any = '';
  public scheduleError: string;
  public isScheduleError: boolean;
  public formSubmitted: boolean = false;
  public list: any[];
  public tmp: boolean;
  public tmp1: boolean;
  public frameworkComponents;
  public gridOptions: GridOptions;
  private gridApi: GridApi;
  private columnApi: ColumnApi;
  pageSizes = [25, 50, 100, 250, 500];
  pageSize = 25;
  public paramConditions = [
    'Contains',
    'In',
    'Equals To',
    'Starts With',
    'Ends With'
  ];
  public weekdaysArray = [
    { id: 'Sun', value: 'Sunday', checked: false },
    { id: 'Mon', value: 'Monday', checked: false },
    { id: 'Tue', value: 'Tuesday', checked: false },
    { id: 'Wed', value: 'Wednesday', checked: false },
    { id: 'Thu', value: 'Thursday', checked: false },
    { id: 'Fri', value: 'Friday', checked: false },
    { id: 'Sat', value: 'Saturday', checked: false },
  ];
  public frequencyArray = [
    { id: '1', value: 'Daily' },
    { id: '2', value: 'Weekdays' },
    { id: '3', value: 'Specific Days' },
    { id: '4', value: 'Others' }
  ];
  public checkedWeekdaysList = [];
  public checkedSpecificDaysList = [];
  public checkedOthersList = [];
  public autoCompleteData: Observable<any[]>;
  private searchTerms = new Subject<string>();
  columnDefs = [
    { headerName: 'ProgramName', field: 'program_name' },
    { headerName: 'ProgramId', field: 'program_id' },
    {
      headerName: 'LastRunDate',
      field: 'last_update',
      cellRenderer: 'agDateFormatRenderer'
    },
    {
      headerName: 'Submit',
      buttonName: 'Submit',
      cellRenderer: 'agBtnRenderer'
    }
  ];
  rowData = [];
  constructor(
    private manageJobsService: ManageJobsService,
    private formBuilder: FormBuilder
  ) {
    this.dialogHeaderText = 'Parameters';
    this.dialogDisplay = false;
    // this.jobParams=new SubmitParams;
  }
  ngOnInit() {
    this.formReset();
    this.formInit();
  }

  openDialog() {
    this.dialogDisplay = true;
  }
  formInit() {
    this.scheduleForm = this.formBuilder.group({
      frequency: new FormControl('Daily', null),
      time: [new Date(), [Validators.required]],
      otherDays: ['', ''],
      validFrom: [null, [Validators.required]],
      validTo: [null, [Validators.required]],
    });
    this.scheduleForm.get('frequency').setValue('Daily', { onlySelf: true });
    this.paramterArray.numberValue = null;
  }

  formReset() {
    if (this.scheduleForm != null) {
      this.scheduleForm.reset();
      this.scheduleForm.get('time').setValue(new Date(), { onlySelf: true });
      this.scheduleForm.get('frequency').setValue('Daily', { onlySelf: true });
      this.selectedSchedule = 'Daily';
    }
  }

  search() {
    this.resetValidations();
    if (
      this.jobName == null ||
      this.jobName == undefined ||
      this.jobName.trim() == '' ||
      this.jobCondition == null ||
      this.jobCondition == '--Select--'
    ) {
      this.jobNameError = ' Required !';
      this.isjobNameError = true;
      this.errors.push(this.jobNameError);
    }

    if (this.jobName != null) {
      if (/^[a-zA-Z0-9-,_ ]*$/.test(this.jobName) == false) {
        this.jobNameError = ' Please provide a valid value !';
        this.isjobNameError = true;
        this.errors.push(this.jobNameError);
      }
    }

    if (this.jobCondition == 'In' && this.jobName != null) {
      if (/^[a-zA-Z0-9-,_ ]*$/.test(this.jobName) == false) {
        this.jobNameError = ' Please provide valid comma seperated values!';
        this.isjobNameError = true;
        this.errors.push(this.jobNameError);
      }
    }

    if (this.errors.length === 0) {
      // this.spinnerService.notify('show');
      this.manageJobsService
        .getPrograms(this.jobName, this.jobCondition)
        .subscribe(
          response => {
            // this.spinnerService.notify('hide');
            if (response['status'] === AccessSettings.SUCCESS) {
              this.rowData = response['programs'];
              console.log(response['programs']);
            } else {
              this.errorMsg = response['errormsg'];
            }
          },
          error => {
            // this.spinnerService.notify('hide');
            console.log('porgrams', error);
          }
        );
    }
  }

  getProgramParameters() {
    console.log('progId', this.progId);
    // this.spinnerService.notify('show');
    this.manageJobsService.getProgramParametersForSubmit(this.progId).subscribe(
      response => {
        if (response['status'] === AccessSettings.SUCCESS) {
          this.errorMsg = response['errormsg'];
          console.log(response);
          this.paramterArray = response['progpramMap'];
          for (var i = 0; i < this.paramterArray.length; i++) {
            if (this.paramterArray[i].sqlData != null) {
              var value: String = (Object.keys(this.paramterArray[i].sqlData[0]))[0];
              var key: String = (Object.keys(this.paramterArray[i].sqlData[1]))[1];
              console.log(key);
              this.paramterArray[i].KEY = key;
              this.paramterArray[i].VALUE = value;
            }
          }
          console.log("parameterArray: ", this.paramterArray);
          if (!(this.paramterArray === null)) {
            this.dialogDisplay = true;
          } else {
            alert('No parameters defined for the program');
          }
        } else {
          this.errorMsg = response['errormsg'];
          // this.notificationService.notify('error', 'ERROR', this.errorMsg);
        }
        // this.spinnerService.notify('hide');
      },
      error => {
        console.log('getProgramParametersForSubmit', error);
        // this.spinnerService.notify('hide');
        // this.notificationService.notify('error', 'ERROR', this.errorMsg);
      }
    );
  }

  submitJob(paramterArray) {
    console.log('paramterArray at submit', paramterArray);
    console.log('progId in submitJob: ', this.jobNames);
    this.jobParams = paramterArray;
    for (var i = 0; i < paramterArray.length; i++) {
      if (this.paramterArray[i].numberValue != null) {
        this.paramterArray[i].numberValue = this.paramterArray[i].numberValue;
      }
      if (this.paramterArray[i].sqlDataValue != null) {
        var key = this.paramterArray[i].KEY
        this.paramterArray[i].sqlDataValue = this.paramterArray[i].sqlDataValue[key];
      }
      this.paramterArray[i].jobName = this.jobNames;
    }
    //this.paramterArray.push({jobName:this.jobNames});
    //   this.jobParams[i].param_name=paramterArray[i].param_name;
    //   this.jobParams[i].param_desc=paramterArray[i].param_desc;
    //   this.jobParams[i].program_id=paramterArray[i].program_id;
    //   this.jobParams[i].param_type=paramterArray[i].param_type;

    //   //this.jobParams[0].param_name=paramterArray[i].param_name;
    //  }
    console.log("jobparams" + this.jobParams);
    console.log(paramterArray);
    // this.spinnerService.notify('show');
    this.manageJobsService.submitJob(paramterArray).subscribe(
      response => {
        console.log(response);
        if (response['status'] === AccessSettings.SUCCESS) {
          this.errorMsg = response['errormsg'];
          // this.notificationService.notify('success', 'SUCCESS', this.errorMsg);
        } else {
          // this.notificationService.notify('error', 'ERROR', this.errorMsg);
        }
        // this.spinnerService.notify('hide');
      },
      error => {
        //  console.log('submitJob', error);
        // this.spinnerService.notify('hide');
        // this.notificationService.notify('error', 'ERROR', this.errorMsg);
      }
    );
  }


  cancel() {
    this.jobCondition = '--Select--';
    this.jobName = '';
    this.resetValidations();
    this.rowData = [];
  }
  onBtnClicked(cell) {
    this.progId = cell.data.program_id;
    this.getProgramParameters();
    // this.list = JSON.parse(sessionStorage.getItem('aut'))
  }

  resetValidations() {
    this.isjobNameError = false;
    this.jobNameError = '';
    this.isScheduleError = false;
    this.scheduleError = '';
    this.errors = [];
  }

  getAutocompleteData(term: string) {
    this.searchTerms.next(term);
  }
  toggleShowDiv(divName: string) {

    if (divName === 'divA') {
      this.animationState = this.animationState === 'out' ? 'in' : 'out';
    }

    if (divName === 'divB') {
      this.animationState = this.animationState === 'out' ? 'in' : 'out';
    }
  }
  counter(i: number) {
    return new Array(i);
  }
  openDpOnClick(elem) {
    elem.click();
  }
  onChangeScheduler(event: Event) {
    console.log(event.target);
    this.selectedSchedule = (<HTMLInputElement>event.target).value;
  }
  // convenience getter for easy access to form fields
  get f() { return this.scheduleForm.controls; }

  onCheckboxChange_WeekDays(option, event) {
    if (event.target.checked) {
      this.checkedWeekdaysList.push(option.value);
    } else {
      for (var i = 0; i < this.weekdaysArray.length; i++) {
        if (this.checkedWeekdaysList[i] == option.value) {
          this.checkedWeekdaysList.splice(i, 1);
        }
      }
    }
    console.log(this.checkedWeekdaysList);
  }

  onCheckboxChange_SpecificDays(event) {
    if (event.target.checked) {
      this.checkedSpecificDaysList.push(event.target.value);
    } else {
      for (var i = 0; i < this.checkedSpecificDaysList.length; i++) {
        if (this.checkedSpecificDaysList[i] == event.target.value) {
          this.checkedSpecificDaysList.splice(i, 1);
        }
      }
    }
    console.log(this.checkedSpecificDaysList);
  }


  onCheckboxChange_OtherDays(event) {
    if (event.target.checked) {
      this.checkedOthersList.push(event.target.value);
    } else {
      if (this.checkedOthersList[0] == event.target.value) {
        this.checkedOthersList.splice(0, 1);
      }
    }
    console.log(this.checkedOthersList);
  }

  onScheduleCancel() {
    this.formReset();
    this.resetValidations();
    this.toggleShowDiv('divA');
  }
  onSchedule() {
    console.log(' On Schedule Submit: ');
    this.formSubmitted = true;
    this.resetValidations();


    // stop here if form is invalid
    if (this.scheduleForm.invalid) {
      return;
    }

    let frequency = this.scheduleForm.get('frequency').value;
    let time = this.scheduleForm.get('time').value;
    let validFrom = this.scheduleForm.get('validFrom').value;
    let validTo = this.scheduleForm.get('validTo').value;
    let others = this.scheduleForm.get('otherDays').value;

    let schedule_time = new DatePipe(navigator.language).transform(new Date(time), 'hh:mm:ss a');
    //let hrs = time.hour; // + ':' + time.minute + ':' + time.second
    //let meridian = (hrs >= 12) ? "PM" : "AM";
    //schedule_time = schedule_time + ':' + meridian;


    console.log('progId:', this.progId);
    console.log('freq:', frequency);
    console.log('time:', schedule_time);
    console.log('weekdays:', this.checkedWeekdaysList);
    console.log('specificdays:', this.checkedSpecificDaysList);
    console.log('others:', others);
    console.log('validTo:', validTo);
    console.log('validFrom:', validFrom);

    const jobSchedule: JobSchedule = new JobSchedule();
    jobSchedule.program_id = this.progId;
    jobSchedule.frequency = frequency;
    jobSchedule.schedule_time = schedule_time;
    jobSchedule.validFrom = validFrom;
    jobSchedule.validTo = validTo;

    if (this.progId == null || this.progId === 0 || this.progId === undefined) {
      alert('No program to schedule');
      return;
    }
    if (frequency != null && !(frequency === undefined)) {
      if (frequency === 'Specific Days') {
        if (this.checkedSpecificDaysList.length == 0) {
          this.scheduleError = ' Please select atleast a day !';
          this.isScheduleError = true;
          this.errors.push(this.scheduleError);
          //alert("Please select atleast one day");
          return;
        } else {
          jobSchedule.schedule_days = this.checkedSpecificDaysList;
        }
      }
      if (frequency === 'Weekdays') {
        if (this.checkedWeekdaysList.length == 0) {
          this.scheduleError = ' Please select atleast a day !';
          this.isScheduleError = true;
          this.errors.push(this.scheduleError);
          //alert("Please select atleast one day");
          return;
        } else {
          jobSchedule.schedule_days = this.checkedWeekdaysList;
          jobSchedule.schedule_week_days = this.checkedWeekdaysList;
        }
      }
      if (frequency === 'Others') {
        if (this.scheduleForm.get('otherDays').value == null || this.scheduleForm.get('otherDays').value === undefined
          || this.scheduleForm.get('otherDays').value === '' || this.scheduleForm.get('otherDays').value === false) {
          this.scheduleError = ' Please select atleast a day !';
          this.isScheduleError = true;
          this.errors.push(this.scheduleError);
          //alert("Please select atleast one day");
          return;
        } else {
          jobSchedule.schedule_days = this.checkedOthersList;
        }
      }


      /*if(validTo == null || validTo == undefined){
            this.scheduleError = " Required !";
            this.isScheduleError = true;
            this.errors.push(this.scheduleError);
      }

      if(validFrom == null || validFrom == undefined){
        this.scheduleError = " Required !";
        this.isScheduleError = true;
        this.errors.push(this.scheduleError);
  }*/
    }

    if (this.errors.length == 0) {
      // this.spinnerService.notify('show');
      this.manageJobsService.scheduleJob(jobSchedule).subscribe(
        response => {
          if (response['status'] === AccessSettings.SUCCESS) {
            this.errorMsg = response['errormsg'];
            // this.notificationService.notify('error', 'ERROR', this.errorMsg);
          } else {
            // this.notificationService.notify('error', 'ERROR', this.errorMsg);
          }
          // this.spinnerService.notify('hide');
        },
        error => {
          console.log('scheduleJob', error);
          // this.spinnerService.notify('hide');
          // this.notificationService.notify('error', 'ERROR', this.errorMsg);
        }
      );
    }

  }
  onPageSizeChanged() {
    if (this.gridApi) {
      this.gridApi.paginationSetPageSize(this.pageSize);
    }
  }
  addJobClick() {

  }
}
