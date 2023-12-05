import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ManageJobAuthGuard } from './_guards/managejob.auth.guards';
import { SubmitJobComponent } from './submit-job/submit-job.component';
import { ViewJobComponent } from './view-job/view-job.component';
import { DefineJobComponent } from './define-job/define-job.component';

const routes: Routes = [
{
  path: 'manageJobs', pathMatch: 'prefix',
  children: [
    {
      path: '',
      component: SubmitJobComponent,
      canActivate: [ManageJobAuthGuard]
    },
    {
      path: 'viewJobStatus',
      component: ViewJobComponent,
      canActivate: [ManageJobAuthGuard]
    },
    {
      path: 'submitJob',
      component: SubmitJobComponent,
      canActivate: [ManageJobAuthGuard]
    },
    {
      path: 'defineJob',
      component: DefineJobComponent,
      canActivate: [ManageJobAuthGuard]
    }
  ]

}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManageJobsRoutingModule { }
