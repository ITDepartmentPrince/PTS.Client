import {Directive, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {OidcSecurityService} from "angular-auth-oidc-client";

@Directive({
  selector: '[appAuth]'
})
export class AuthDirective implements OnInit {
  private userRoles: string[];
  constructor(private templateRef: TemplateRef<any>,
              private authService: OidcSecurityService,
              private viewContainer: ViewContainerRef) { }

  @Input()
  set appAuth(authPolicy: string[]) {
    this.userRoles = authPolicy;
  }

  @Input()
  set appAuthElse(template: TemplateRef<any>) {
    this.authService.getUserData()
      .subscribe(value => {
        if (this.userRoles && this.userRoles.some(r => (value?.role as string[])?.includes(r))){}
          // this.viewContainer.clear();
        else
          this.viewContainer.createEmbeddedView(template);
      });
  }

  ngOnInit(): void {
    this.authService.getUserData()
      .subscribe(value => {
          if (this.userRoles && this.userRoles.some(r => (value?.role as string[])?.includes(r)))
            this.viewContainer.createEmbeddedView(this.templateRef);
          /*else
            this.viewContainer.clear();*/
      });
  }
}
