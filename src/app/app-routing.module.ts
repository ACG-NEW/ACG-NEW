import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainComponent } from '@modules/main/main.component';
import { LoginComponent } from '@modules/login/login.component';
import { DashboardComponent } from '@pages/dashboard/dashboard.component';
import { ETLAuthGuard } from '@pages/ETL_Management/_guards/etl.auth.guard';
import { UserAuthGuard } from '@pages/User_Management/_guards/user.guard';
import { ManageJobAuthGuard } from '@pages/Manege_Jobs/_guards/managejob.auth.guards';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  },
  {
    path: '',
    component: MainComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: '',
        loadChildren: () => import('./pages/ETL_Management/etlmanagemnet.module').then(m => m.ETLmanagemnetModule),
        canActivate: [ETLAuthGuard]
      },
      {
        path: '',
        loadChildren: () => import('./pages/User_Management/user-management.module').then(m => m.UserManagementModule),
        canActivate: [UserAuthGuard]
      },
      {
        path: '',
        loadChildren: () => import('./pages/Manege_Jobs/manage-jobs.module').then(m => m.ManageJobsModule),
        canActivate: [ManageJobAuthGuard]
      },
      {
        path: '',
        loadChildren: () => import('./pages/Application_Management/app-management.module').then(m => m.AppManagementModule),
        canActivate: [ManageJobAuthGuard]
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      }
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule],

})
export class AppRoutingModule { }
// canActivate:[AuthGuard]
