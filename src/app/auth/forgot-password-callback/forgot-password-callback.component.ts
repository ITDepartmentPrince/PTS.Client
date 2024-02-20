import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-login-callback',
  standalone: true,
  template: '<div></div>'
})
export class ForgotPasswordCallbackComponent implements OnInit {
  constructor(private router: Router) {}

  ngOnInit() {
    this.router?.navigate(['/']);
  }
}
