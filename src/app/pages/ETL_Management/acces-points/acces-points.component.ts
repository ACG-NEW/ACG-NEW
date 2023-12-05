import { AccessSettings } from '@/utils/access-settings';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AccessService } from '@services/access.service';
import { ColumnApi, GridApi, GridOptions } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-acces-points',
  templateUrl: './acces-points.component.html',
  styleUrls: ['./acces-points.component.scss']
})
export class AccesPointsComponent implements OnInit {
  searchForm: FormGroup;
  applicationNames: any[]; // Make sure to replace any with the actual type of applicationNames
  accessPointCondition: any; // Replace any with the actual type
  public applicationName: string;
  public dataSource: any = [];
  public accessPoint: string;
  public errorMsg: string;
  public tableName = 'Access Points';
  public isAppNameError: boolean;
  public appNameError: string;
  public isAccPntError: boolean;
  public accPntError: string;
  public gridOptions: GridOptions;
  private gridApi: GridApi;
  private columnApi: ColumnApi;

  // public accessPointCondition: string;
  public rowSelection: 'single' | 'multiple' = 'multiple';
  errors: any[];
  validationErrors: any[];

  columnDefs = [
    { headerName: 'Access Code', field: 'access_point_code',sortable: true, filter: true, resizable: true },
    { headerName: 'Access Description', field: 'access_point_desc',sortable: true, filter: true, resizable: true },
    { headerName: 'Type', field: 'application_id',sortable: true, filter: true, resizable: true },
    { headerName: 'Start Date', field: 'start_date',sortable: true, filter: true, resizable: true },
    { headerName: 'End Date', field: 'last_update',sortable: true, filter: true, resizable: true },
    { headerName: 'Enabled', field: 'active_flag',sortable: true, filter: true, resizable: true },
    { headerName: 'POINT_TYPE', field: 'point_type',sortable: true, filter: true, resizable: true },
    { headerName: 'ACCESS_TYPE', field: 'access_type',sortable: true, filter: true, resizable: true }
  ];
  rowData = [
    {
      access_point_code: 'Toyota',
      access_point_desc: 'Celica',
      application_id: 35000,
      start_date: '20/10/2019',
      last_update: '20/10/2019',
      active_flag: 'Yes'
    },
    {
      access_point_code: 'Toyota',
      access_point_desc: 'Celica',
      application_id: 35000,
      start_date: '20/10/2019',
      last_update: '20/10/2019',
      active_flag: 'Yes'
    },
    {
      access_point_code: 'Toyota',
      access_point_desc: 'Celica',
      application_id: 35000,
      start_date: '20/10/2019',
      last_update: '20/10/2019',
      active_flag: 'Yes'
    },
    {
      access_point_code: 'Toyota',
      access_point_desc: 'Celica',
      application_id: 35000,
      start_date: '20/10/2019',
      last_update: '20/10/2019',
      active_flag: 'Yes'
    },
    {
      access_point_code: 'Toyota',
      access_point_desc: 'Celica',
      application_id: 35000,
      start_date: '20/10/2019',
      last_update: '20/10/2019',
      active_flag: 'Yes'
    },
    {
      access_point_code: 'Toyota',
      access_point_desc: 'Celica',
      application_id: 35000,
      start_date: '20/10/2019',
      last_update: '20/10/2019',
      active_flag: 'Yes'
    },
    {
      access_point_code: 'Toyota',
      access_point_desc: 'Celica',
      application_id: 35000,
      start_date: '20/10/2019',
      last_update: '20/10/2019',
      active_flag: 'Yes'
    },
    {
      access_point_code: 'Toyota',
      access_point_desc: 'Celica',
      application_id: 35000,
      start_date: '20/10/2019',
      last_update: '20/10/2019',
      active_flag: 'Yes'
    },
    {
      access_point_code: 'Toyota',
      access_point_desc: 'Celica',
      application_id: 35000,
      start_date: '20/10/2019',
      last_update: '20/10/2019',
      active_flag: 'Yes'
    },
    {
      access_point_code: 'Toyota',
      access_point_desc: 'Celica',
      application_id: 35000,
      start_date: '20/10/2019',
      last_update: '20/10/2019',
      active_flag: 'Yes'
    }
  ];

  constructor(private fb: FormBuilder, private accesService: AccessService, private toaster: ToastrService) { }

  ngOnInit(): void {
    this.initForm();
    this.accesService.getAppNames().subscribe(
      response => {
        console.log(response);
        this.applicationName = '-1';
        if (response['status'] === AccessSettings.SUCCESS) {
          this.applicationNames = response['listOfMapData'];
        }
        else {
          this.errorMsg = response['errormsg'];
          console.log(this.errorMsg);
          this.toaster.error("From Application names service "+this.errorMsg, "ERROR");
        }
      },
      error => {
        this.applicationName = '-1';
        console.log('appnames', error);
        this.toaster.error(error, "ERROR")

      }
    );
  }

  initForm(): void {
    this.searchForm = this.fb.group({
      applicationName: [-1, Validators.required], // Assuming -1 is the default value
      accessPoint: ['', Validators.required],
    });
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
  search(): void {
    // Add your search logic here
    console.log('Search Clicked');
  }

  cancel(): void {
    // Add your cancel logic here
    console.log('Cancel Clicked');
  }


}
