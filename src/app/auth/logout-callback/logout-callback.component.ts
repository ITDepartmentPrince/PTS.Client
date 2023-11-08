import {Component, OnInit} from '@angular/core';
import {OidcSecurityService} from "angular-auth-oidc-client";
import {Router} from "@angular/router";

@Component({
  selector: 'app-logout-callback',
  template: '<div></div>'
})
export class LogoutCallbackComponent implements OnInit {
  constructor(private authService: OidcSecurityService,
              private router: Router) {}

  ngOnInit() {
    this.authService
      .isAuthenticated()
      .subscribe(isAuthenticated => {
        if (!isAuthenticated)
          this.authService.logoffLocal();

        this.router?.navigate(['/']);
      });
  }
}
