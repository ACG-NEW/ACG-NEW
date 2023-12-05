import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppRoutingModule } from '@/app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from '@modules/main/main.component';
import { LoginComponent } from '@modules/login/login.component';
import { HeaderComponent, LogoutConfirmationDialogComponent } from '@modules/main/header/header.component';
import { FooterComponent } from '@modules/main/footer/footer.component';
import { MenuSidebarComponent } from '@modules/main/menu-sidebar/menu-sidebar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DashboardComponent } from '@pages/dashboard/dashboard.component';
import { ToastrModule } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
// import { UserComponent } from '@modules/main/header/user/user.component';
import { StoreModule } from '@ngrx/store';
import { uiReducer } from './store/ui/reducer';
import { AuthService } from '@services/auth.service';
import { TokenService } from '@services/token.service';
import { AuthInterceptor } from '@services/auth.interceptor';
import { MaterialModule } from './material_ui/material/material.module';
import { QueryBuilderModule } from 'angular2-query-builder-operator-labels';
import { NgxUiLoaderModule } from 'ngx-ui-loader';
import { SubSink } from 'subsink';
import { MomentDateModule } from '@angular/material-moment-adapter';
import { MatDialogModule } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from './pages/confirmation-dialog/confirmation-dialog.component';
import { ETLAuthGuard } from '@pages/ETL_Management/_guards/etl.auth.guard';
import { UserAuthGuard } from '@pages/User_Management/_guards/user.guard';
import { GeneralModule } from './modules/general/general.module';
import { ManageJobAuthGuard } from '@pages/Manege_Jobs/_guards/managejob.auth.guards';
@NgModule({
  declarations: [
    AppComponent,
    MainComponent,
    LoginComponent,
    HeaderComponent,
    FooterComponent,
    MenuSidebarComponent,
    DashboardComponent,
    LogoutConfirmationDialogComponent,
    ConfirmationDialogComponent,

  ],
  imports: [
    MaterialModule,
    MatDialogModule,
    MomentDateModule,
    QueryBuilderModule,
    MaterialModule,
    BrowserModule,
    StoreModule.forRoot({ ui: uiReducer }),
    HttpClientModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    NgxUiLoaderModule,
    BrowserAnimationsModule,
    GeneralModule,
    ToastrModule.forRoot({
      timeOut: 15000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      tapToDismiss: true,
      closeButton: true,
      // disableTimeOut: true
    })
    // MsalModule
  ],
  // entryComponents: [AppConditionDropdownComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [AuthService, TokenService, SubSink, DatePipe, ETLAuthGuard, UserAuthGuard,ManageJobAuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],

})
export class AppModule { }
