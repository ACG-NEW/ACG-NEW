import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ManageJobsRoutingModule } from './manage-jobs-routing.module';
import { DefineJobComponent } from './define-job/define-job.component';
import { SubmitJobComponent } from './submit-job/submit-job.component';
import { ViewJobComponent } from './view-job/view-job.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GeneralModule } from '@modules/general/general.module';
import { AgGridModule } from 'ag-grid-angular';
import { MaterialModule } from '@/material_ui/material/material.module';
import { ManageJobsService } from '@services/manageJobs.service';


@NgModule({
  declarations: [
    DefineJobComponent,
    SubmitJobComponent,
    ViewJobComponent
  ],
  imports: [
    CommonModule,
    ManageJobsRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    GeneralModule,
    AgGridModule,
    MaterialModule
  ],
  providers:[ManageJobsService]
})
export class ManageJobsModule { }
