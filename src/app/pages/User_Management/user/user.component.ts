import { AccessSettings } from '@/utils/access-settings';
import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '@services/user.service';
import { ColumnApi, GridApi, GridOptions } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { SubSink } from 'subsink';
import { AddUserComponent } from './add-user/add-user.component';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { HyperlinkRendererComponent } from '@modules/general/hyeprlink/hyeprlink.component';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  @ViewChild('addUser') addUser: AddUserComponent;
  userForm: FormGroup;
  public userName: string;
  public userNameCondition: string;
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
    { headerName: 'User Name', field: 'user_name', sortable: true, filter: true, resizable: true, cellRenderer: 'agLnkRenderer' },
    { headerName: 'First name', field: 'user_firstname', sortable: true, filter: true, resizable: true },
    { headerName: 'Last Name', field: 'user_lastname', sortable: true, filter: true, resizable: true },
    { headerName: 'Start Date', field: 'start_date', sortable: true, filter: true, resizable: true },
    { headerName: 'End Date', field: 'end_date', sortable: true, filter: true, resizable: true },
    { headerName: 'Email', field: 'user_email', sortable: true, filter: true, resizable: true },
    { headerName: 'Enabled', field: 'active_flag', sortable: true, filter: true, resizable: true },
    { headerName: 'UseId', field: 'user_id', hide: true, sortable: true, filter: true, resizable: true }
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
    const userName = params.data.user_name;
    return `<a href="#" (click)="onUserNameClicked('${userName}')">${userName}</a>`;
  }
  onUserNameClicked(userName) {
    // Add your logic for what should happen when the username is clicked
    console.log('Username clicked:', userName);
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
      userNameCondition: [''],
      userName: ['', Validators.required],
    });
  }
  onLnkClicked(cell) {
    this.headertxt = 'Edit User';
    this.userId = cell.data.user_id;
    this.display = true;
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: '1000px',
      height: 'auto',
      data: { userId: cell.data.user_id, headertxt: 'Edit User' },
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
      this.userName == null || this.userName === undefined || this.userName.trim() == "" ||
      this.userNameCondition == null || this.userNameCondition === '--Select--') {
      this.unameError = ' Required !';
      this.isUnameError = true;
      this.errors.push(this.unameError);
    }
    if (this.userName != null) {
      if (/^[a-zA-Z0-9-,_ ]*$/.test(this.userName) === false) {
        this.unameError = ' Please provide a valid value !';
        this.isUnameError = true;
        this.errors.push(this.unameError);
      }
    }

    if (this.userNameCondition === 'In' && this.userName != null) {
      if (/^[a-zA-Z0-9-,_ ]*$/.test(this.userName) === false) {
        this.unameError = 'Please provide valid comma seperated values!';
        this.isUnameError = true;
        this.errors.push(this.unameError);
      }
    }
    if (this.errors.length === 0) {
      this._loader.start();
      this.userService.getUsersList(this.userName, this.userNameCondition).subscribe(
        response => {
          this._loader.stop();
          if (response['status'] === AccessSettings.SUCCESS) {
            this.rowData = response['user'];
          } else {
            this.errorMsg = response['errormsg']
          }
        },
        error => {
          this._loader.stop();
          console.log('getUser', error);
        }
      );
    }
  }
  addUserClick() {

    this.userId = null;
    this.userService.switchTab = "firstTab";
    this.display = true;
    const dialogRef = this.dialog.open(AddUserComponent, {
      width: '1000px',
      height: 'auto',
      data: { headertxt: 'Add User' },
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
    if (this.addUser.rowsEditied.length > 0) {
      // this.modalRef = this.modalService.show(template, { class: 'modal-sm' });
    } else {
      this.display = false;
    }
  }
  onNoClick() {
    // this.dialogRef.close();
  }
}

