import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReconcilationRoutingModule } from './reconcilation-routing.module';
import { MaterialModule } from '@/material_ui/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RunreportComponent } from './runreport/runreport.component';
import { FileConsistencyCheckComponent } from './file-consistency-check/file-consistency-check.component';
import { CreatetransactionComponent } from './createtransaction/createtransaction.component';
import { SummarynoticeComponent } from './summarynotice/summarynotice.component';
import { CommentsComponent } from './comments/comments.component';
import { ReconcilationComponent } from './reconcilation/reconcilation.component';
import { RandomMatchingComponent } from './random-matching/random-matching.component';
import { AgGridModule } from 'ag-grid-angular';
import { FileUploadTestComponent } from './file-upload/file-upload-test.component';
import { UnReconcileComponent } from './un-reconcile/un-reconcile.component';
import { FccPopupComponent } from './fcc-popup/fcc-popup.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {FilterPipe1} from '../../services/searchfilter';
import { AllpspDialogComponent } from './allpsp-dialog/allpsp-dialog.component';
@NgModule({
  declarations: [
    RunreportComponent,
    FileConsistencyCheckComponent,
    CreatetransactionComponent,
    SummarynoticeComponent,
    CommentsComponent,
    ReconcilationComponent,
    RandomMatchingComponent,
    UnReconcileComponent,
    FccPopupComponent,
    FilterPipe1,
    AllpspDialogComponent
  ],
  imports: [
    AgGridModule,
    CommonModule,
    ReconcilationRoutingModule,
    MaterialModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  providers: [
    MatDialog,
    // other services
  ],
  exports: [
    FilterPipe1
  ]
})
export class ReconcilationModule { }
