import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ColumnApi, GridApi, GridOptions } from 'ag-grid-community';

@Component({
  selector: 'app-acces-groups',
  templateUrl: './acces-groups.component.html',
  styleUrls: ['./acces-groups.component.scss']
})
export class AccesGroupsComponent implements OnInit {
  public gridOptions: any;
  accessGroupForm: FormGroup;
  public applicationName: string;
  public applicationNames: any[];
  public accessGroup: string;
  public errorMsg: string;
  public dialogDisplay: boolean;
  public tableName = 'Access groups';
  public isAppNameError: boolean;
  public appNameError: string;
  public isAccGrpError: boolean;
  public accGrpError: string;
  public accessGroupCondition: string;
  errors: any[];
  validationErrors: any[];
  private gridApi: GridApi;
  private columnApi: ColumnApi;
  public rowSelection: 'single' | 'multiple' = 'multiple';

  columnDefs = [
    { headerName: 'Access Group Code', field: 'access_group_code', sortable: true, filter: true, resizable: true,width:318 },// cellRenderer: 'agLnkRenderer'},
    { headerName: 'Access Description', field: 'access_group_desc', sortable: true, filter: true, resizable: true,width:350 },
    { headerName: 'Start Date', field: 'start_date', sortable: true, filter: true, resizable: true },
    { headerName: 'End Date', field: 'end_date', sortable: true, filter: true, resizable: true },
    { headerName: 'Enabled', field: 'active_flag', sortable: true, filter: true, resizable: true }
  ];
  rowData = [
    {
      access_group_code: 'Toyota',
      access_group_desc: 'Celica',
      start_date: '20/10/2019',
      end_date: '20/10/2019',
      active_flag: 'Yes'
    },
    {
      access_group_code: 'Toyota',
      access_group_desc: 'Celica',
      start_date: '20/10/2019',
      end_date: '20/10/2019',
      active_flag: 'Yes'
    },
    {
      access_group_code: 'Toyota',
      access_group_desc: 'Celica',
      start_date: '20/10/2019',
      end_date: '20/10/2019',
      active_flag: 'Yes'
    },
    {
      access_group_code: 'Toyota',
      access_group_desc: 'Celica',
      start_date: '20/10/2019',
      end_date: '20/10/2019',
      active_flag: 'Yes'
    },
    {
      access_group_code: 'Toyota',
      access_group_desc: 'Celica',
      start_date: '20/10/2019',
      end_date: '20/10/2019',
      active_flag: 'Yes'
    },
    {
      access_group_code: 'Toyota',
      access_group_desc: 'Celica',
      start_date: '20/10/2019',
      end_date: '20/10/2019',
      active_flag: 'Yes'
    },
    {
      access_group_code: 'Toyota',
      access_group_desc: 'Celica',
      start_date: '20/10/2019',
      end_date: '20/10/2019',
      active_flag: 'Yes'
    },
    {
      access_group_code: 'Toyota',
      access_group_desc: 'Celica',
      start_date: '20/10/2019',
      end_date: '20/10/2019',
      active_flag: 'Yes'
    },
    {
      access_group_code: 'Toyota',
      access_group_desc: 'Celica',
      start_date: '20/10/2019',
      end_date: '20/10/2019',
      active_flag: 'Yes'
    },
    {
      access_group_code: 'Toyota',
      access_group_desc: 'Celica',
      start_date: '20/10/2019',
      end_date: '20/10/2019',
      active_flag: 'Yes'
    }
  ];
  fullScreen: boolean;
  constructor(private fb: FormBuilder) {
    this.accessGroupForm = this.fb.group({
      applicationName: [-1, Validators.required],
      accessGroupCondition: [null], // Adjust as needed based on your conditions
      accessGroup: ['', Validators.required],
    });
    this.gridOptions = {
      domLayout: 'autoHeight',
      enableBrowserTooltips: true,
      suppressSizeToFit: true,
      // Add other options as needed
    };
  }
  setAppName(value: string) {
    // Implement your logic here
  }
  ngOnInit(): void {
    // throw new Error('Method not implemented.');
  }
  search() {
    // Implement your search logic using this.form.value
  }

  cancel() {
    // Implement your cancel logic
  }

  onLnkClicked(event: any) {
    // Implement your link clicked logic
  }
  onGridReady(params) {
    this.gridApi = params.api;
    this.columnApi = params.columnApi;
  }

  onRowSelected(event) {
    const row = event.data;
    console.log(row);
    // this.pspcheck(row, event.rowIndex);
  }
}
