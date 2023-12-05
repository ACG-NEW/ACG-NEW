import { AppState } from '@/store/state';
import { UiState } from '@/store/ui/state';
import { Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthService } from '@services/auth.service';
import { Observable } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
const BASE_CLASSES = 'main-sidebar elevation-4';
import { environment } from '../../../../environments/environment.prod';
// import { openCloseAnimation, rotateAnimation } from '../../../components/menu-item/menu-item.animations';
@Component({
  selector: 'app-menu-sidebar',
  templateUrl: './menu-sidebar.component.html',
  styleUrls: ['./menu-sidebar.component.scss'],
})
export class MenuSidebarComponent implements OnInit {
  @HostBinding('class') classes: string = BASE_CLASSES;
  public isExpandable: boolean = false;
  // @HostBinding('class.nav-item') isNavItem: boolean = true;
  @HostBinding('class.menu-open') isMenuExtended: boolean = false;
  public isMainActive: boolean = false;
  public ui: Observable<UiState>;
  public user;
  appversion: string;
  // public menu = MENU;
  @ViewChild('sidenav') sidenav: MatSidenav;
  isExpanded = true;
  constructor(
    public authService: AuthService,
    private store: Store<AppState>
  ) { }

  ngOnInit() {
    this.appversion = environment.version;
    this.ui = this.store.select('ui');
    this.ui.subscribe((state: UiState) => {
      this.classes = `${BASE_CLASSES}`;
    });
    this.user = this.authService.user;
  }


}

