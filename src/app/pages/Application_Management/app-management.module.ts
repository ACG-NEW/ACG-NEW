import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AppManagementRoutingModule } from './app-management-routing.module';
import { FunctionsComponent } from './functions/functions.component';
import { MenusComponent } from './menus/menus.component';
import { LicenseComponent } from './license/license.component';
import { ExecuteScriptComponent } from './execute-script/execute-script.component';
import { HomePageComponent } from './home-page/home-page.component';


@NgModule({
  declarations: [
    FunctionsComponent,
    MenusComponent,
    LicenseComponent,
    ExecuteScriptComponent,
    HomePageComponent
  ],
  imports: [
    CommonModule,
    AppManagementRoutingModule
  ]
})
export class AppManagementModule { }
