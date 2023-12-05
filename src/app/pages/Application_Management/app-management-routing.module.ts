import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExecuteScriptComponent } from './execute-script/execute-script.component';
import { LicenseComponent } from './license/license.component';
import { MenusComponent } from './menus/menus.component';
import { FunctionsComponent } from './functions/functions.component';
import { HomePageComponent } from './home-page/home-page.component';

const routes: Routes = [
  {
    path: 'applicationManagment',
    children: [
      {
        path: '',
        component: HomePageComponent,
      },
      {
        path: 'registration',
        component: HomePageComponent,
      },
      {
        path: 'functions',
        component: FunctionsComponent,
      },
      {
        path: 'menus',
        component: MenusComponent,
      },
      {
        path: 'license',
        component: LicenseComponent,
      },
      {
        path: 'executeScript',
        component: ExecuteScriptComponent,
      },
     ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AppManagementRoutingModule { }
