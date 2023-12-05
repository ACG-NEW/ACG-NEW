import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@guards/auth.guard';
import { ReconConfigGuard } from '@guards/recon-config.guard';
import { CommentsComponent } from './comments/comments.component';
import { CreatetransactionComponent } from './createtransaction/createtransaction.component';
import { FileConsistencyCheckComponent } from './file-consistency-check/file-consistency-check.component';
import { ReconcilationComponent } from './reconcilation/reconcilation.component';
import { RunreportComponent } from './runreport/runreport.component';
import { FileUploadTestComponent } from './file-upload/file-upload-test.component';
import { SummarynoticeComponent } from './summarynotice/summarynotice.component';

const routes: Routes = [
  {
    path: 'fileupload', component: FileUploadTestComponent,  canActivate: [ReconConfigGuard]
  },
  {
    path:'runreport',component:RunreportComponent, canActivate: [ReconConfigGuard]
  },
  {
    path:'fileconsistencycheck',component:FileConsistencyCheckComponent, canActivate: [ReconConfigGuard]
  },
  {
    path:'summarynotice',component:SummarynoticeComponent, canActivate: [ReconConfigGuard]
  },
  {
    path:'comments',component:CommentsComponent, canActivate: [ReconConfigGuard]
  },
  {
    path:'createtransaction',component:CreatetransactionComponent, canActivate: [ReconConfigGuard]
  },
  {
    path:'reconcile',component:ReconcilationComponent, canActivate: [ReconConfigGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReconcilationRoutingModule { }
