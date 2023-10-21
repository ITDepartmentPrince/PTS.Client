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

  ngOnInit(): void {
    let hasAccess = false;

    this.authService.getUserData()
      .subscribe(value => {
        if (this.userRoles)
          hasAccess = this.userRoles.some(r => (value?.role as string[])?.includes(r));

        if (hasAccess)
          this.viewContainer.createEmbeddedView(this.templateRef);
        else
          this.viewContainer.clear();
      });
  }
}
