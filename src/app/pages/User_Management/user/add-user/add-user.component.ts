import { AccessSettings } from '@/utils/access-settings';
import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User, UserRole } from '@pages/User_Management/user.modal';
import { UserService } from '@services/user.service';
import { ColumnApi, GridApi, GridOptions } from 'ag-grid-community';
import { status } from '@/enums/enum'
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  userForm: FormGroup;
  submitted = false;
  public userId;
  public gridoptions: any = {} as GridOptions;
  public context;
  public defaultColDef;
  public rowClassRules;
  public rowsEditied = [];
  public datePipe = new DatePipe(navigator.language);
  public errorMsg: string;
  public isErrorMsg: boolean;
  public userRoleData: any;
  public allRowData: any;
  public userRoleDataSelected: any;
  public allRoleDataSelected: any;
  public user: User;
  public selectedRole: UserRole;
  public swtchTab: any;
  public list: any[];
  public tmp: boolean;
  public tmp1: boolean;
  public rowsEditiedValues = [];
  public userRolecolumnDefs = [
    /*{ headerName: 'Select', checkboxSelection: true, suppressSorting: true, headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true, suppressMenu: true, pinned: true, width: 50},*/
    { headerName: 'Role ID', field: 'role_id', width: 120 },
    { headerName: 'Role Name', field: 'role_code', width: 120 },
    { headerName: 'Description', field: 'role_desc', width: 180 },
    { headerName: 'Start Date', field: 'start_date', width: 120, editable: false },
    {
      headerName: 'End Date', field: 'end_date', width: 120, editable: true
    },
    { headerName: 'Include/Exclude', field: 'inlcude_exclude_flag', width: 140, editable: true }
  ];


  public allRolesColumnDefs = [
    {
      headerName: 'Select', checkboxSelection: true, suppressSorting: true, headerCheckboxSelection: true,
      headerCheckboxSelectionFilteredOnly: true, suppressMenu: true, pinned: true, width: 50
    },
    { headerName: 'Role Name', field: 'role_code' },
    { headerName: 'Description', field: 'role_desc', width: 200 },
    { headerName: 'Start Date', field: 'start_date', width: 100, },
    { headerName: 'End Date', field: 'end_date', width: 100 }
  ];
  tabIndex: any;
  dataSaved: any;
  public gridOptions: GridOptions;
  pageSizes = [25, 50, 100, 250, 500];
  pageSize = 25;
  private gridApi: GridApi;
  private columnApi: ColumnApi;
  public headerText: string;
  // public accessPointCondition: string;
  public rowSelection: 'single' | 'multiple' = 'multiple';
  columnDefs = [
    { headerName: 'Role Code', field: 'role_code', sortable: true, filter: true, resizable: true },
    { headerName: 'Role Desc', field: 'role_desc', sortable: true, filter: true, resizable: true },
    { headerName: 'Start Date', field: 'start_date', sortable: true, filter: true, resizable: true },
    { headerName: 'End Date', field: 'end_date', sortable: true, filter: true, resizable: true },
    { headerName: 'Enabled', field: 'status', sortable: true, filter: true, resizable: true },
    { headerName: 'UseId', field: 'role_id', hide: true, sortable: true, filter: true, resizable: true }
  ];
  public rowData = [];

  constructor(private formBuilder: FormBuilder, private loader: NgxUiLoaderService, private toaster: ToastrService,
    private userService: UserService, @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AddUserComponent>) {
    this.context = { componentParent: this };
    this.submitted = false;
    this.user = new User();
    this.errorMsg = '';
    this.isErrorMsg = false;
    this.userRoleData = [];
    this.allRowData = [];
    this.userRoleDataSelected = [];
    this.allRoleDataSelected = [];

    this.defaultColDef = { sortable: true, resizable: true, filter: true };
    // this.gridoptions.rowStyle = {background: 'LightCyan' };
    this.gridoptions.singleClickEdit = true;
    this.swtchTab = this.userService.switchTab;
    this.userForm = this.formInit();
  }

  ngOnInit(): void {
    // this.formInit();
    this.rowClassRules = {
      'row-modified': function (params) {
        //console.log('params', params);
        return params.context.componentParent.rowsEditied.includes(params.rowIndex);
      }
    };
    this.headerText = this.data.headertxt;
    if (this.data.userId) {
      this.refresh(this.data.userId);
    }
  }
  onPageSizeChanged() {
    if (this.gridApi) {
      this.gridApi.paginationSetPageSize(this.pageSize);
    }
  }
  get f() {
    return this.userForm.controls;
  }
  formReset() {
    if (this.userForm != null) {
      this.userForm.reset();
    }
  }
  refresh(userID: string) {
    this.formInit();
    this.rowsEditied = [];
    this.userId = userID;
    this.user.user_id = +userID;
    if (userID !== null) {
      this.getUserdetails();
      this.getUserRoles();
      this.getAllRowsData();
    }
    this.list = JSON.parse(sessionStorage.getItem('user'));
    console.log(this.list);
    console.log(this.userId);
    for (let i = 0; i <= this.list.length; i++) {
      var fun_id = this.list[i].functionId;
      console.log(fun_id);
      if (fun_id === status.USR_MGMT_DEF_USER_ADD && this.userId === null) {
        this.tmp = true;
        this.tmp1 = false;
        console.log(this.tmp);
      }
      if (fun_id === status.USR_MGMT_DEF_USER_UPDATE && this.userId != null) {
        this.tmp1 = true;
        this.tmp = false;
        console.log(this.tmp1);
      }
    }
  }

  clearGridData() {
    this.gridApi.setRowData([]);
  }
  update() {

  }
  formInit() {
    this.submitted = false;
    this.isErrorMsg = false;
    this.errorMsg = '';
    this.userRoleData = [];
    this.allRowData = [];
    this.userRoleDataSelected = [];
    this.allRoleDataSelected = [];
    this.formReset();
    return this.formBuilder.group({
      loginName: ['', Validators.required],
      fullName: ['', Validators.required],
      middleName: ['', ''],
      lastName: ['', Validators.required],
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

  }
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
    this.gridApi.sizeColumnsToFit();
  }
  onSubmit() {
    this.submitted = true;
    //this.gridApi.stopEditing();
    this.user.userRoles = [];
    // stop here if form is invalid
    if (this.userForm.invalid) {
      return;
    }
    this.user.user_name = this.userForm.value.loginName;
    this.user.user_firstname = this.userForm.value.fullName;
    this.user.user_middlename = this.userForm.value.middleName;
    this.user.user_lastname = this.userForm.value.lastName;
    this.user.user_firstname = this.userForm.value.fullName;
    this.user.start_date = this.userForm.value.startDate;
    this.user.end_date = this.userForm.value.endDate;
    this.user.user_email = this.userForm.value.email;
    this.user.password = this.userForm.value.password;
    console.log('user', this.user);

    var res = this.compareDates(this.user.start_date, this.user.end_date);
    if (res != '') {
      this.errorMsg = res;
      // this.notificationService.notify('error', 'ERROR',  this.errorMsg );
      return;
    }
    debugger;
    if (this.userId === null || this.userId === undefined) {
      this.loader.start();
      this.userService.addUser(this.user).subscribe(response => {
        console.log(response);
        if (response['status'] === AccessSettings.SUCCESS) {
          this.loader.stop();
          this.errorMsg = response['errormsg'];
          this.userId = response['singleUser'].user_id;
          console.log(" this.userId after adding " + response['singleUser']);
          this.isErrorMsg = true;
          this.toaster.success(this.errorMsg, 'SUCCESS');
          // this.notificationService.notify('success', 'SUCCESS',  );
        } else {
          this.loader.stop();
          this.errorMsg = response['errormsg'];
          this.isErrorMsg = true;
          this.toaster.error(this.errorMsg, 'ERROR');
          // this.notificationService.notify('error', 'ERROR',  this.errorMsg );
        }
      },
        error => {
          this.loader.stop();
          // console.log('addUser', error);
          this.toaster.error(this.errorMsg, 'ERROR');
          // this.notificationService.notify('error', 'ERROR',  error );
        });

    } else {
      this.userService.updateUser(this.user).subscribe(response => {
        console.log(response);
        if (response['status'] === AccessSettings.SUCCESS) {
          this.errorMsg = response['errormsg'];
          this.isErrorMsg = true;
          this.toaster.success(this.errorMsg, 'SUCCESS');
          this.loader.stop();

          // this.notificationService.notify('success', 'SUCCESS',  this.errorMsg );
        } else {
          this.errorMsg = response['errormsg']
          this.isErrorMsg = true;
          this.toaster.error(this.errorMsg, 'ERROR');
          this.loader.stop();

          // this.notificationService.notify('error', 'ERROR',  this.errorMsg );
        }
      },
        error => {
          // console.log('updateUser', error);
          this.toaster.error(error, 'updateUser');
          this.loader.stop();

          // this.notificationService.notify('error', 'ERROR',  error );
        });

    }
  }

  assignRole() {
    this.user.userRoles = [];
    debugger;
    console.log('selectedRole', this.selectedRole);
    if (this.selectedRole == null || this.selectedRole.role_code == null || this.selectedRole.role_code == undefined || this.selectedRole.role_code.trim() == "") {
      this.errorMsg = 'Please select a role to assign';
      this.toaster.error(this.errorMsg,"ERROR");
    } else {
      this.user.userRoles.push(this.selectedRole);
      this.user.user_id = this.userId;
      // console.log('user', this.user);
      this.loader.start();
      this.userService.addUserRole(this.user).subscribe(response => {
        this.loader.stop();
        // console.log(response);
        if (response['status'] === AccessSettings.SUCCESS) {
          this.errorMsg = response['errormsg'];
          this.userRoleData = response['usrrolemap'];
          this.isErrorMsg = true;
          this.toaster.success(this.errorMsg,"SUCCESS");

          // this.notificationService.notify('success', 'SUCCESS',  this.errorMsg );
        } else {
          this.errorMsg = response['errormsg'];
          this.isErrorMsg = true;
          this.toaster.error(this.errorMsg,"ERROR");
          // this.notificationService.notify('error', 'ERROR',  this.errorMsg );
        }
      },
        error => {
          console.log('addUserRole', error);
          this.toaster.error(this.errorMsg,"ERROR");
          // this.notificationService.notify('error', 'ERROR',  error );
        });
    }
  }

  deleteRole() {
    this.user.userRoles = this.userRoleDataSelected;
  }

  onUserRoleSelected(event) {
    event.forEach(element => {
      this.userRoleDataSelected.push(element);
    });
  }


  getUserdetails() {
    // this.spinnerService.notify('show');
    this.userService.getUser(this.userId).subscribe(
      response => {
        // this.spinnerService.notify('hide');
        if (response['status'] === AccessSettings.SUCCESS) {
          this.userForm.get('loginName').setValue(response['user'][0].user_name);
          this.userForm.get('fullName').setValue(response['user'][0].user_firstname);
          this.userForm.get('middleName').setValue(response['user'][0].user_middlename);
          this.userForm.get('lastName').setValue(response['user'][0].user_lastname);
          if (response['user'][0].start_date != null && response['user'][0].start_date != 'undefined' && response['user'][0].start_date != '') {
            this.userForm.get('startDate').setValue(new Date(response['user'][0].start_date));
          }
          if (response['user'][0].end_date != null && response['user'][0].end_date != 'undefined' && response['user'][0].end_date != '') {
            this.userForm.get('endDate').setValue(new Date(response['user'][0].end_date));
          }
          this.userForm.get('email').setValue(response['user'][0].user_email);
        } else {
          this.errorMsg = response['errormsg']
          this.isErrorMsg = true;
          // this.notificationService.notify('error', 'ERROR',  this.errorMsg );
        }
      },
      error => {
        // this.spinnerService.notify('hide');
        // this.notificationService.notify('error', 'ERROR',  error );
        console.log('getUserdetails', error);
      }
    );
  }

  getUserRoles() {
    // this.spinnerService.notify('show');
    this.userService.getUserRole(this.userId).subscribe(response => {
      // this.spinnerService.notify('hide');
      console.log(response);
      if (response['status'] === AccessSettings.SUCCESS) {
        this.errorMsg = response['errormsg'];
        this.userRoleData = response['usrrolemap'];
      } else {
        this.errorMsg = response['errormsg']
        // this.notificationService.notify('error', 'ERROR',  this.errorMsg );
      }
    },
      error => {
        // this.spinnerService.notify('hide');
        // this.notificationService.notify('error', 'ERROR',  error );
        console.log('getUserRoles', error);
      });
  }
  getAllRowsData() {
    this.userService.getAllRoles().subscribe(respone => {
      console.log('getAllRoles', respone);
      this.allRowData = respone['role'];
    });
  }

  compareDates(sDate, eDate) {
    if ((eDate != null && eDate != 'undefined' && eDate != '') && (sDate != null && sDate != 'undefined' && sDate != '')) {
      if (eDate < sDate) return "End Date cannot be less than Start Date";
    }
    return "";
  }
  openDpOnClick(elem) {
    elem.click();
  }
}
