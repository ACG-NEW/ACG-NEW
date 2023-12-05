import { AppState } from '@/store/state';
import { ToggleSidebarMenu } from '@/store/ui/actions';
import { UiState } from '@/store/ui/state';
import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, NgForm } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AuthService } from '@services/auth.service';
import { Observable } from 'rxjs';
import { Router } from "@angular/router";
import { map, startWith,tap } from 'rxjs/operators';
import { LoginService } from '@services/login.service';
const BASE_CLASSES = 'main-header navbar navbar-expand';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  // name = new FormControl('');
  @ViewChild('frmObject') public objectFrm!: NgForm;
  @HostBinding('class') classes: string = BASE_CLASSES;
  public ui: Observable<UiState>;
  public searchForm: FormGroup;
  public sourceData: any = [];
  public filterSourceData: any = [];
  toatalUrls: any = [];
  public user;
  showAlertMessage = false;
  filteredOptions: Observable<string[]>;
  public appConfigList: [] = [];
  public pspFileList: any = [];
  public userMngList: any = [];
  public reconList: any = [];
  constructor(private router: Router, private fb: FormBuilder, private loginService: LoginService, private dialog: MatDialog,
    private authService: AuthService,
    private store: Store<AppState>
  ) {
    this.searchForm = this.formInit();
  }

  formInit() {
    return this.fb.group({
      name: ['']
    })
  }

  onSelFunc(evt) {
    if (evt.option.value.route) {
      this.router.navigateByUrl(evt.option.value.route);
      this.searchForm.controls['name'].setValue('');
    }
  }
  displayFn(user: any): string {
    return user && user.name ? user.name : '';
  }
  private _filter(name: string) {
    const filterValue = name.toLowerCase();
    return this.toatalUrls.filter(option => option.name.toLowerCase().includes(filterValue));
  }
  ngOnInit() {
    this.user = sessionStorage.getItem('user');
    this.ui = this.store.select('ui');
    this.ui.subscribe((state: UiState) => {
      this.classes = `${BASE_CLASSES}`;
    });

  }


  // logout1() {
  //   sessionStorage.clear();
  //   this.authService.logout();
  // }
  logout(): void {
    const dialogRef = this.dialog.open(LogoutConfirmationDialogComponent, {
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {

      if (result) {
        sessionStorage.clear();
        this.authService.logout();
      }
    });
  }
  onToggleMenuSidebar() {
    this.store.dispatch(new ToggleSidebarMenu());
  }
  // confirmLogout() {
  //   // Perform logout action
  // }

  // cancelLogout() {
  //   this.showAlertMessage = false;
  // }

}


import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-logout-confirmation-dialog',
  template: `
    <h2 mat-dialog-title>Confirm Logout</h2>
    <mat-dialog-content>
      Are you sure you want to log out?
    </mat-dialog-content>
    <mat-dialog-actions>
    <button mat-raised-button type="button" style="line-height: 20px !important;
  font-size: 12px !important; background-color: #c004fc !important;color:white;
  margin: 3px !important;"   (click)="confirmLogout()">Yes</button>
    <button mat-raised-button mat-dialog-close style="line-height: 20px !important;
  font-size: 12px !important;
  margin: 3px !important;" type="button">No</button>
    </mat-dialog-actions>
  `,
})
export class LogoutConfirmationDialogComponent {
  constructor(private dialogRef: MatDialogRef<LogoutConfirmationDialogComponent>) { }

  confirmLogout(): void {
    this.dialogRef.close(true);
  }
}
