import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ETLAuthGuard } from './_guards/etl.auth.guard';
import { AccesPointsComponent } from './acces-points/acces-points.component';
import { AccesGroupsComponent } from './acces-groups/acces-groups.component';
import { SourceAppUsersComponent } from './source-app-users/source-app-users.component';
import { SourceAppRolesComponent } from './source-app-roles/source-app-roles.component';
import { RoleAccessGroupMappingComponent } from './role-access-group-mapping/role-access-group-mapping.component';
import { RoleBusinessEntityMappingComponent } from './role-business-entity-mapping/role-business-entity-mapping.component';
import { UserRoleMappingComponent } from './user-role-mapping/user-role-mapping.component';
import { BusinessEntityComponent } from './business-entity/business-entity.component';
import { EtlEngineComponent } from './etl-engine/etl-engine.component';

const routes: Routes = [
  {
    path: 'etlManagment',
    children: [
      {
        path: '',
        component: AccesPointsComponent,
        canActivate: [ETLAuthGuard]
      },
      {
        path: 'accesspoints',
        component: AccesPointsComponent,
        canActivate: [ETLAuthGuard]
      },
      {
        path: 'accessGroups',
        component: AccesGroupsComponent,
        canActivate: [ETLAuthGuard]
      },
      {
        path: 'SourceAppUsers',
        component: SourceAppUsersComponent,
        canActivate: [ETLAuthGuard]
      },
      {
        path: 'SourceAppRoles',
        component: SourceAppRolesComponent,
        canActivate: [ETLAuthGuard]
      },
      {
        path: 'RoleAccessGroupMapping',
        component: RoleAccessGroupMappingComponent,
        canActivate: [ETLAuthGuard]
      },
      {
        path: 'RoleBusinessEntityMapping',
        component: RoleBusinessEntityMappingComponent,
        canActivate: [ETLAuthGuard]
      },
      {
        path: 'UserRoleMapping',
        component: UserRoleMappingComponent,
        canActivate: [ETLAuthGuard],
        // resolve: {
        //   access: RouteResolver
        // }
      },
      {
        path: 'BusinessEntity',
        component: BusinessEntityComponent,
        canActivate: [ETLAuthGuard]
      },
      {
        path: 'ETLEngine',
        component: EtlEngineComponent,
        canActivate: [ETLAuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ETLmanagemnetRoutingModule { }
