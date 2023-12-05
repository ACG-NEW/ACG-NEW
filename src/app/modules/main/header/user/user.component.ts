import {DateTime} from 'luxon';
import { AppState } from '@/store/state';
import {  ToggleSidebarMenu } from '@/store/ui/actions';
import { UiState } from '@/store/ui/state';
import { Component, HostBinding, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from '@services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { Router } from "@angular/router";
const BASE_CLASSES = 'main-header navbar navbar-expand';
@Component({
    selector: 'app-user',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  @HostBinding('class') classes: string = BASE_CLASSES;
    public user;

    constructor(private appService: AuthService) {}

    ngOnInit(): void {
        this.user = sessionStorage.getItem('user');
    }

    logout() {
        this.appService.logout();
    }

    // formatDate(date) {
    //     return DateTime.fromISO(date).toFormat('dd LLL yyyy');
    // }
}
