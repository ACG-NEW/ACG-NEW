import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { RoleComponent } from './role/role.component';
import { UserDefinedGroupsComponent } from './user-defined-groups/user-defined-groups.component';
import { UserAuthGuard } from './_guards/user.guard';

const routes: Routes = [
  {
    path: 'userManagment',
    children: [
      {
        path: '',
        component: UserComponent,
        canActivate: [UserAuthGuard]
      },
      {
        path: 'user',
        component: UserComponent,
        canActivate: [UserAuthGuard]
      },
      {
        path: 'role',
        component: RoleComponent,
        canActivate: [UserAuthGuard]
      },
      {
        path: 'groups',
        component: UserDefinedGroupsComponent,
        canActivate: [UserAuthGuard]
      }
     ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule { }
