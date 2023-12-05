import {
  Component,
  OnInit,
  OnDestroy,
  Renderer2,
  HostBinding,
  ViewChild
} from '@angular/core';
import { Validators, FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '@services/auth.service';
import { Router } from '@angular/router';
import { LoginService } from "../../services/login.service";
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { loginClass } from './login.modal';
import { SubSink } from 'subsink'
import { AuthenticationResult } from '@azure/msal-browser';
// import { ConfiConfigServiceService } from '../../services/confi-config-service.service';
import { environment } from '../../../environments/environment.prod';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'login-box';
  @ViewChild('lgForm') lgForm !: NgForm;
  public isAuthLoading = false;
  email: string = '';
  public showPassword: boolean = false;
  password: string = '';
  public isEmailError: boolean = false;
  public emailError: string = '';
  public isPasswordError: boolean = false;
  public passWordError: string = '';
  errors: any[] = [];
  validationErrors: any[] = [];
  public errmsg: string;
  public loginForm: FormGroup;
  hide: boolean = true;
  private lgClass: loginClass;
  appName: string;
  apiUrl: string;
  appversion: string;
  private isInteractionInProgress = false;
  constructor(
    private router: Router, private authService: AuthService,
    private subsink: SubSink,
    private renderer: Renderer2,
    private _loader: NgxUiLoaderService, private toastr: ToastrService,
    private loginService: LoginService,
    private fb: FormBuilder,
  ) {
    this.lgClass = new loginClass();

  }

  ngOnInit() {
    if (sessionStorage.getItem('user')) {
      sessionStorage.clear();
      this.router.navigate[''];
    } else {

    }
    this.renderer.addClass(
      document.querySelector('app-root'),
      'login-page'
    );
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
    this.appversion = environment.version;
  }
  getValueByKey(data: string, key: string) {
    const regex = new RegExp(`^${key}=`, 'm');
    return data.match(regex) ? data.match(regex)[0].split('=')[1].trim() : '';
  }
  onSubmit() {
    if (this.loginForm.invalid) {
      this.isAuthLoading = false;
      return;
    } else {
      this.signin();
    }
  }

  signin(): void {
    this._loader.start();
    this.isAuthLoading = true;
    this.lgClass.username = this.loginForm.value.email.trim();
    this.lgClass.password = this.loginForm.value.password.trim();
    this.subsink.sink = this.loginService.login(this.lgClass).subscribe(
      (res: any) => {
        this._loader.stop();
        console.log(res);
        if (res.status === "SUCCESS") {
          // this.authService.login(res.token);
          this.authService.login(res['errormsg']);
          this.router.navigate(['/dashboard']);
        } else {
          this._loader.stop();
          // Handle other cases
        }
      },
      (error: any) => {
        // this.toastr.error("Unable to log you in", 'Error');
        this._loader.stop();
      }
    );


  }
  clear() {
    this.lgForm.resetForm();
  }

  ngOnDestroy() {
    this.subsink.unsubscribe();
    this.renderer.removeClass(
      document.querySelector('app-root'),
      'login-page'
    );
  }
}
