import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '@services/user.service';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { RoleComponent } from '../role.component';
import { Role, RoleMenu } from '@pages/User_Management/user.modal';
import { DatePipe } from '@angular/common';
import { GridOptions } from 'ag-grid-community';
import { AccessSettings } from '@/utils/access-settings';
import { status } from '@/enums/enum'
@Component({
  selector: 'app-add-role',
  templateUrl: './add-role.component.html',
  styleUrls: ['./add-role.component.scss']
})
export class AddRoleComponent implements OnInit {
  public headerText: string;
  public roleForm: FormGroup;
  public role: Role;
  public roleId;
  public gridoptions: any = {} as GridOptions;
  public gridApi;
  public columnApi;
  public defaultColDef;
  public datePipe = new DatePipe(navigator.language);
  public errorMsg: string;
  public roleMenuData: any;
  public allMenuData: any;
  public roleMenuDataSelected: any;
  public allMenuDataSelected: any;
  public submitted: boolean;
  public selectedMenu: RoleMenu;
  public isErrorMsg: boolean;
  public rowsEditied = [];
  public rowsEditiedValues = [];
  public rowClassRules;
  public context;
  public list: any[];
  public tmp: boolean;
  public tmp1: boolean;
  public roleaddId: number;
  public roleMenuColumnDefs = [
    /*{ headerName: 'Select', checkboxSelection: true, suppressSorting: true, headerCheckboxSelection: true,
    headerCheckboxSelectionFilteredOnly: true, suppressMenu: true, pinned: true, width: 50},*/
    { headerName: 'Menu ID', field: 'menu_id', width: 120 },
    { headerName: 'Menu Name', field: 'menu_code', width: 120 },
    { headerName: 'Description', field: 'menu_desc', width: 180 },
    { headerName: 'Start Date', field: 'start_date', width: 130, editable: false },
    {
      headerName: 'End Date', field: 'end_date', width: 120, editable: true,
      // cellRendererFramework: DateFormatRendererComponent,
      // cellEditorFramework: DateRendererComponent,
    },
    { headerName: 'Include/Exclude', field: 'active_flag', width: 140, editable: true }
  ];

  public allMenuColumnDefs = [
    { headerName: 'Role Name', field: 'role_code', width: 120, editable: true },
    { headerName: 'Description', field: 'role_desc', editable: true },
    { headerName: 'Start Date', field: 'start_date', width: 120, editable: true },
    { headerName: 'End Date', field: 'end_date', width: 120, editable: true }
  ];

  // rowClassRules: { 'row-modified': (params: any) => any; };
  constructor(private formBuilder: FormBuilder, private loader: NgxUiLoaderService, private toaster: ToastrService,
    private userService: UserService, @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<RoleComponent>) {
    this.context = { componentParent: this };
    this.submitted = false;
    this.role = new Role();
    this.errorMsg = '';
    this.roleMenuData = [];
    this.allMenuData = [];
    this.roleMenuDataSelected = [];
    this.allMenuDataSelected = [];

    this.defaultColDef = { sortable: true, resizable: true, filter: true };
  }
  ngOnInit(): void {
    this.rowClassRules = {
      'row-modified': function (params) {
        //console.log('params', params);
        return params.context.componentParent.rowsEditied.includes(params.rowIndex);
      }
    };
    this.headerText = this.data.headertxt;
    if (this.data.userId) {
      // this.refresh(this.data.userId);
    }
  }
  isDisabled() {
    if (this.roleId !== undefined && this.roleId !== null && this.roleId.length > 0) {
      return false;
    } else {
      return true;
    }
  }

  refresh(roleID: string) {
    console.log('refresh', roleID);
    this.formInit();
    this.roleId = roleID;
    this.role.role_id = +roleID;
    if (roleID !== null) {
      this.getRoledetails();
      this.getRoleMenus();
      this.getAllMenusData();
    }
    this.list = JSON.parse(sessionStorage.getItem('user'));
    console.log(this.list);
    console.log(this.roleId);
    for (let i = 0; i <= this.list.length; i++) {
      var fun_id = this.list[i].functionId;
      console.log(fun_id);
      if (fun_id === status.USR_MGMT_DEF_ROLE_ADD && this.roleId === null) {
        this.tmp = true;
        this.tmp1 = false;
        console.log(this.tmp);
      }
      if (fun_id === status.USR_MGMT_DEF_ROLE_UPDATE && this.roleId != null) {
        this.tmp1 = true;
        this.tmp = false;
        console.log(this.tmp1);
      }
    }
  }

  formInit() {
    this.submitted = false;
    this.errorMsg = '';
    this.roleMenuData = [];
    this.allMenuData = [];
    this.roleMenuDataSelected = [];
    this.allMenuDataSelected = [];

    this.formReset();
    this.roleForm = this.formBuilder.group({
      roleName: ['', Validators.required],
      roleDesc: ['', Validators.required],
      startDate: [null, Validators.required],
      endDate: [null],
      isInActive: ['', '']
    });
  }
  onGridReady(params: any) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
  }
  // convenience getter for easy access to form fields
  get f() { return this.roleForm.controls; }
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.roleForm.invalid) {
      return;
    }
    this.role.role_code = this.roleForm.value.roleName;
    this.role.role_desc = this.roleForm.value.roleDesc;
    this.role.start_date = this.roleForm.value.startDate;
    this.role.end_date = this.roleForm.value.endDate;

    if (this.roleForm.value.isInActive) {
      this.role.status = 'Y';
    } else {
      this.role.status = 'N';
    }
    console.log("role" + JSON.stringify(this.role));

    var res = this.compareDates(this.role.start_date, this.role.end_date);
    if (res != '') {
      this.errorMsg = res;
      // this.notificationService.notify('error', 'ERROR', this.errorMsg);
      return;
    }

    if (this.roleId === null) {
      this.userService.createRole(this.role).subscribe(response => {
        console.log(response);
        if (response['status'] === AccessSettings.SUCCESS) {
          this.errorMsg = response['errormsg'];
          this.roleId = response['singleRole'].role_id;
          // this.notificationService.notify('success', 'SUCCESS', this.errorMsg);
        } else {
          this.errorMsg = response['errormsg'];
          // this.notificationService.notify('error', 'ERROR', this.errorMsg);
        }
      },
        error => {
          console.log('createRole', error);
          // this.notificationService.notify('error', 'ERROR', this.errorMsg);
        });
    } else {
      this.userService.updateRole(this.role).subscribe(response => {
        console.log(response);
        if (response['status'] === AccessSettings.SUCCESS) {
          this.errorMsg = response['errormsg'];
          // this.notificationService.notify('success', 'SUCCESS', this.errorMsg);
        } else {
          this.errorMsg = response['errormsg']
          // this.notificationService.notify('error', 'ERROR', this.errorMsg);
        }
      },
        error => {
          console.log('updateRole', error);
          // this.notificationService.notify('error', 'ERROR', this.errorMsg);
        });
    }
  }

  formReset() {
    if (this.roleForm != null) {
      this.roleForm.reset();
    }
  }
  getRoledetails() {
    this.userService.getRole(this.roleId).subscribe(
      response => {
        console.log(response);
        if (response['status'] === AccessSettings.SUCCESS) {
          this.roleForm.get('roleName').setValue(response['role'][0].role_code);
          this.roleForm.get('roleDesc').setValue(response['role'][0].role_desc);
          if (response['role'][0].start_date != null &&
            response['role'][0].start_date != 'undefined' && response['role'][0].start_date != '') {
            this.roleForm.get('startDate').setValue(new Date(response['role'][0].start_date));
          }
          if (response['role'][0].end_date != null && response['role'][0].end_date != 'undefined' && response['role'][0].end_date != '') {
            this.roleForm.get('endDate').setValue(new Date(response['role'][0].end_date));
          }
          this.roleForm.get('isInActive').setValue(response['role'][0].status === 'N' ? true : false);
          //this.notificationService.notify('success', 'SUCCESS',  this.errorMsg );
        } else {
          this.errorMsg = response['errormsg'];
          // this.notificationService.notify('error', 'ERROR', this.errorMsg);
        }
      },
      error => {
        console.log('getRoledetails', error);
        // this.notificationService.notify('error', 'ERROR', this.errorMsg);
      }
    );
  }
  getRoleMenus() {
    this.userService.getRoleMenu(this.roleId).subscribe(response => {
      console.log(response);
      if (response['status'] === AccessSettings.SUCCESS) {
        this.errorMsg = response['errormsg'];
        this.roleMenuData = response['rolemenumap'];
        //this.notificationService.notify('success', 'SUCCESS',  this.errorMsg );
      } else {
        this.errorMsg = response['errormsg']
        // this.notificationService.notify('error', 'ERROR', this.errorMsg);
      }
    },
      error => {
        console.log('getRoleMenus', error);
        // this.notificationService.notify('error', 'ERROR', this.errorMsg);
      });
  }

  deleteMenu() {
    this.role.roleMenus = this.roleMenuDataSelected;
    console.log('role', this.role);
  }
  onRoleMenuSelected(event) {
    console.log('onRoleMenuSelected', event);
    event.forEach(element => {
      this.roleMenuDataSelected.push(element);
    });
  }
  update() {
    this.gridApi.stopEditing();
    this.rowsEditiedValues.forEach(element => {
      const rolemenu: RoleMenu = new RoleMenu();
      rolemenu.menu_id = element.menu_id;
      rolemenu.menu_code = element.menu_code;
      rolemenu.menu_desc = element.menu_desc;
      rolemenu.start_date = element.start_date;
      if (element.end_date != null && element.end_date != '' && element.end_date != 'undefined') {
        rolemenu.end_date = new Date(element.end_date);
      }
      rolemenu.active_flag = element.active_flag;
      this.role.roleMenus.push(rolemenu);
    });
    console.log('this.role', this.role);
    this.userService.updateRoleMenu(this.role).subscribe(response => {
      console.log(response);
      if (response['status'] === AccessSettings.SUCCESS) {
        this.errorMsg = response['errormsg'];
        this.roleMenuData = response['rolemenumap'];
        // this.notificationService.notify('success', 'SUCCESS', this.errorMsg);
      } else {
        this.errorMsg = response['errormsg'];
        // this.notificationService.notify('error', 'ERROR', this.errorMsg);
      }
    },
      error => {
        console.log('updateRoleMenu', error);
        // this.notificationService.notify('error', 'ERROR', this.errorMsg);
      });
  }
  onAllMenuSelected(event) {
    console.log('onAllMenuSelected', event);
    event.forEach(element => {
      this.allMenuDataSelected.push(element);
    });
  }
  assignMenu() {
    this.role.roleMenus = [];
    console.log('selectedMenu', this.selectedMenu);
    if (this.selectedMenu == null || this.selectedMenu.menu_code == null || this.selectedMenu.menu_code.trim() == "") {

      this.errorMsg = 'Please select a menu to assign';
    } else {
      this.role.roleMenus.push(this.selectedMenu);
      this.role.role_id = this.roleId;
      console.log('role', this.role);
      this.userService.addRoleMenu(this.role).subscribe(response => {
        console.log(response);
        if (response['status'] === AccessSettings.SUCCESS) {
          this.errorMsg = response['errormsg'];
          this.roleMenuData = response['rolemenumap'];
          this.isErrorMsg = true;
          // this.notificationService.notify('success', 'SUCCESS', this.errorMsg);
        } else {
          this.errorMsg = response['errormsg'];
          this.isErrorMsg = true;
          // this.notificationService.notify('error', 'ERROR', this.errorMsg);
        }
      },
        error => {
          console.log('assignMenu', error);
          // this.notificationService.notify('error', 'ERROR', this.errorMsg);
        });
    }
  }
  getAllMenusData() {
    this.userService.getAllMenus().subscribe(respone => {
      console.log('getAllMenus', respone);
      this.allMenuData = respone['menus'];
    });
  }
  compareDates(sDate, eDate) {

    if ((eDate != null && eDate != 'undefined' && eDate != '') && (sDate != null && sDate != 'undefined' && sDate != '')) {
      //console.log("sDate: ",sDate);
      //console.log("eDate: ",eDate)
      if (eDate < sDate) return "End Date cannot be less than Start Date";
    }
    return "";
  }

  onCellValueChanged(event) {
    this.gridApi.stopEditing();
    this.rowsEditied.push(event.rowIndex);
    this.rowsEditiedValues.push(event.data);
    this.gridApi.redrawRows();
  }

  clearGridData() {
    this.gridApi.setRowData([]);
  }
  openDpOnClick(elem) {
    elem.click();
  }

}
