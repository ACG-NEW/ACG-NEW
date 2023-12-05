import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ETLmanagemnetRoutingModule } from './etlmanagemnet-routing.module';
import { AccesPointsComponent } from './acces-points/acces-points.component';
import { AccesGroupsComponent } from './acces-groups/acces-groups.component';
import { BusinessEntityComponent } from './business-entity/business-entity.component';
import { EtlEngineComponent } from './etl-engine/etl-engine.component';
import { RoleAccessGroupMappingComponent } from './role-access-group-mapping/role-access-group-mapping.component';
import { RoleBusinessEntityMappingComponent } from './role-business-entity-mapping/role-business-entity-mapping.component';
import { SourceAppRolesComponent } from './source-app-roles/source-app-roles.component';
import { SourceAppUsersComponent } from './source-app-users/source-app-users.component';
import { UserRoleMappingComponent } from './user-role-mapping/user-role-mapping.component';
import { MaterialModule } from '@/material_ui/material/material.module';
import { ETLAuthGuard } from './_guards/etl.auth.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccessService } from '@services/access.service';
import { AgGridModule } from 'ag-grid-angular';
import { GeneralModule } from '../../modules/general/general.module';


@NgModule({
  declarations: [
    AccesPointsComponent,
    AccesGroupsComponent,
    BusinessEntityComponent,
    EtlEngineComponent,
    RoleAccessGroupMappingComponent,
    RoleBusinessEntityMappingComponent,
    SourceAppRolesComponent,
    SourceAppUsersComponent,
    UserRoleMappingComponent,

  ],
  imports: [
    CommonModule,
    ETLmanagemnetRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    GeneralModule,
    AgGridModule
  ],
  providers:[AccessService]
})
export class ETLmanagemnetModule { }
