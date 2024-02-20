import {Component, OnInit} from '@angular/core';
import {AuthConstant} from "../../auth/auth.constant";
import {OidcSecurityService} from "angular-auth-oidc-client";

@Component({
  selector: 'app-users-create',
  template: ''
})
export class UsersCreateComponent implements OnInit {
  constructor(private authService: OidcSecurityService) {
  }

  ngOnInit(): void {
    this.authService.getAuthorizeUrl()
      .subscribe(value => {
        window.location.replace(AuthConstant.idpRoot +
          '/Identity/Account/Register?ReturnUrl=' +
          encodeURIComponent(value?.substring(value?.indexOf('/connect')) as string));
      });
  }
}
