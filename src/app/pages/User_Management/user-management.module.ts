import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManagementRoutingModule } from './user-management-routing.module';
import { RoleComponent } from './role/role.component';
import { UserComponent } from './user/user.component';
import { UserDefinedGroupsComponent } from './user-defined-groups/user-defined-groups.component';
import { MaterialModule } from '@/material_ui/material/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GeneralModule } from '@modules/general/general.module';
import { AgGridModule } from 'ag-grid-angular';
import { AddUserComponent } from './user/add-user/add-user.component';
import { MatDialog } from '@angular/material/dialog';
import { AddRoleComponent } from './role/add-role/add-role.component';
@NgModule({
  declarations: [
    RoleComponent,
    UserComponent,
    UserDefinedGroupsComponent,
    AddUserComponent,
    AddRoleComponent
  ],
  // entryComponents: [AddUserComponent],
  imports: [
    CommonModule,
    UserManagementRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    GeneralModule,
    AgGridModule
  ],
  providers: [
    MatDialog
  ],
})
export class UserManagementModule { }
