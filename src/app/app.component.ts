//import { Component, HostListener, OnInit } from '@angular/core';
import { Component, OnInit } from '@angular/core';
//import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(private router: Router, private location: Location) { }

  ngOnInit(): void {
    // let previousUrl = this.location.path();
    // this.router.events.subscribe((event) => {
    //   if (event instanceof NavigationEnd) {
    //     const currentUrl = this.location.path();
    //     console.log('check rfresh1')
    //     if (currentUrl === previousUrl) {
    //       // Page was reloaded
    //       console.log('current url and previous url are equal so rfersh should work here');

    //       this.router.navigateByUrl(currentUrl);
    //     }

    //     previousUrl = currentUrl;
    //   }
    // });
  }
}
