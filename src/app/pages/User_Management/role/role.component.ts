import { AccessSettings } from '@/utils/access-settings';
import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '@services/user.service';
import { ColumnApi, GridApi, GridOptions } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SubSink } from 'subsink';
// import { AddUserComponent } from './add-user/add-user.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HyperlinkRendererComponent } from '@modules/general/hyeprlink/hyeprlink.component';
import { AddRoleComponent } from './add-role/add-role.component';
@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.scss']
})
export class RoleComponent implements OnInit {
  // @ViewChild('addUser') addUser: AddUserComponent;
  userForm: FormGroup;
  public roleName: string;
  public roleNameCondition: string;
  public display: boolean;
  public errorMsg: string;
  public userId: string;
  public isUnameError: boolean;
  public unameError: string;
  public headertxt: string;
  public list: any[];
  public tmp: boolean;
  errors: any[];
  validationErrors: any[];
  public frameworkComponents;
  public gridOptions: GridOptions;
  private gridApi: GridApi;
  private columnApi: ColumnApi;
  pageSizes = [25, 50, 100, 250, 500];
  pageSize = 25;

  // public accessPointCondition: string;
  public rowSelection: 'single' | 'multiple' = 'multiple';
  columnDefs = [
    { headerName: 'Role Name', field: 'role_code',width:280, sortable: true, filter: true, resizable: true, cellRenderer: 'agLnkRenderer' },
    { headerName: 'Description', field: 'role_desc', width:390,sortable: true, filter: true, resizable: true },
    { headerName: 'Start Date', field: 'start_date',width:230, sortable: true, filter: true, resizable: true },
    { headerName: 'End Date', field: 'end_date',width:190, sortable: true, filter: true, resizable: true },
    { headerName: 'Status', field: 'status',width:180, sortable: true, filter: true, resizable: true },
    { headerName: 'RoleId', field: 'role_id', hide: true }
  ];
  public rowData = [];
  template: TemplateRef<any>;
  constructor(private fb: FormBuilder, private userService: UserService, public dialog: MatDialog,
    private subSink: SubSink, private _loader: NgxUiLoaderService, private _toaster: ToastrService) {
    this.subSink = new SubSink();
    this.frameworkComponents = {
      agLnkRenderer: HyperlinkRendererComponent,
    };
    this.gridOptions = {
      context: {
        componentParent: this, // Make sure to set it to the correct parent component
      },
    }
  }
  hyperlinkRenderer(params) {
    const roleName = params.data.user_name;
    return `<a href="#" (click)="onroleNameClicked('${roleName}')">${roleName}</a>`;
  }
  onroleNameClicked(roleName) {
    // Add your logic for what should happen when the roleName is clicked
    console.log('roleName clicked:', roleName);
  }
  ngOnInit(): void {
    this.initForm();
  }
  onPageSizeChanged() {
    if (this.gridApi) {
      this.gridApi.paginationSetPageSize(this.pageSize);
    }
  }
  initForm() {
    this.userForm = this.fb.group({
      roleNameCondition: [''],
      roleName: ['', Validators.required],
    });
  }
  onLnkClicked(cell) {
    this.headertxt = 'Edit User';
    this.userId = cell.data.user_id;
    this.display = true;
    const dialogRef = this.dialog.open(AddRoleComponent, {
      width: '1000px',
      height: 'auto',
      data: { userId: cell.data.user_id, headertxt: 'Edit Role' },
      disableClose: true,
      position: { left: '280px' }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
    // this.addUser.refresh(cell.data.user_id);
  }

  onGridCellClicked($event) {
    // debugger;
  }
  search() {
    this.resetValidations();
    // Your search logic here
    if (
      this.roleName == null || this.roleName === undefined || this.roleName.trim() == "" ||
      this.roleNameCondition == null || this.roleNameCondition === '--Select--') {
      this.unameError = ' Required !';
      this.isUnameError = true;
      this.errors.push(this.unameError);
    }
    if (this.roleName != null) {
      if (/^[a-zA-Z0-9-,_ ]*$/.test(this.roleName) === false) {
        this.unameError = ' Please provide a valid value !';
        this.isUnameError = true;
        this.errors.push(this.unameError);
      }
    }

    if (this.roleNameCondition === 'In' && this.roleName != null) {
      if (/^[a-zA-Z0-9-,_ ]*$/.test(this.roleName) === false) {
        this.unameError = 'Please provide valid comma seperated values!';
        this.isUnameError = true;
        this.errors.push(this.unameError);
      }
    }
    if (this.errors.length === 0) {
      this._loader.start();
      this.userService.getRolesList(this.roleName, this.roleNameCondition).subscribe(
        response => {
          this._loader.stop();
          if (response['status'] === AccessSettings.SUCCESS) {
            this.rowData = response['role'];
          } else {
            this.errorMsg = response['errormsg']
          }
        },
        error => {
          this._loader.stop();
          // this.spinnerService.notify('hide');
          console.log('getRole', error);
        }
      );
    }
  }
  addUserClick() {

    this.userId = null;
    this.userService.switchTab = "firstTab";
    this.display = true;
    const dialogRef = this.dialog.open(AddRoleComponent, {
      width: '1000px',
      height: 'auto',
      data: { headertxt: 'Add Role' },
      disableClose: true,
      position: { left: '280px' }
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
    // this.dialog.
    // this.addUser.refresh(null);
  }
  resetValidations() {
    this.isUnameError = false;
    this.errors = [];
  }
  onSelectionChanged(event) {
    const row = event.data;
    console.log(row);
  }
  onRowSelected(event) {
    const row = event.data;
    console.log(row);
    // this.pspcheck(row, event.rowIndex);
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
  }
  close(template: TemplateRef<any>) {
    // if (this.addUser.rowsEditied.length > 0) {
    //   // this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    // } else {
    //   this.display = false;
    // }
  }
  onNoClick() {
    // this.dialogRef.close();
  }

}
