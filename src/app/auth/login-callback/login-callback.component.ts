import {Component, OnInit} from '@angular/core';
import {OidcSecurityService} from "angular-auth-oidc-client";
import {Router} from "@angular/router";

@Component({
  selector: 'app-login-callback',
  template: '<div></div>'
})
export class LoginCallbackComponent implements OnInit {
  constructor(private authService: OidcSecurityService, private router: Router) {}

  ngOnInit() {
    this.authService
      .isAuthenticated()
      .subscribe(isAuthenticated => {
        if (isAuthenticated)
          this.router?.navigate(['/']);
      });
  }
}
