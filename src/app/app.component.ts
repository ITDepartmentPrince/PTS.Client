import {Component, OnInit} from '@angular/core';
import {OidcSecurityService} from "angular-auth-oidc-client";
import {take} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  isAuthenticated = false;

  constructor(private authService: OidcSecurityService) {
  }

  ngOnInit(): void {
    this.authService
      .checkAuth()
      .pipe(take(1))
      .subscribe(({isAuthenticated}) => {
        this.isAuthenticated = isAuthenticated;
      });
  }
}
