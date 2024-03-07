import {Directive, Input, OnInit, TemplateRef, ViewContainerRef} from '@angular/core';
import {OidcSecurityService} from "angular-auth-oidc-client";
import {Operations} from "../shared/operations";
import {UserService} from "../services/user.service";
import {RolesConstant} from "./roles-constant";
import {Subject} from "rxjs";

@Directive({
  selector: '[appAuth]'
})
export class AuthDirective implements OnInit {
  private userRoleAccess: { action?: Operations; role: string };
  private isAuth = new Subject<boolean>();

  constructor(private templateRef: TemplateRef<any>,
              private authService: OidcSecurityService,
              private viewContainer: ViewContainerRef,
              private userService: UserService) {
  }

  @Input()
  set appAuth(userRoleAccess: { action?: Operations, role: string }) {
    this.userRoleAccess = userRoleAccess;
  }

  @Input()
  set appAuthElse(template: TemplateRef<any>) {
    this.isAuth
      .subscribe(value => {
        if (!value)
          this.viewContainer.createEmbeddedView(template);
      });
  }

  ngOnInit(): void {
    this.authService.getUserData()
      .subscribe(userData => {
        this.userService.getUserRoles(userData.sub as number)
          .subscribe(userRoles => {
            if (userRoles.find(ur => ur.role.name === RolesConstant.Admin)) {
              this.viewContainer.createEmbeddedView(this.templateRef);
              this.isAuth.next(true);
              return;
            }
            else {
              const userRole = userRoles.find(ur => ur.role.name === this.userRoleAccess.role);

              if (this.userRoleAccess.action !== undefined) {
                switch (this.userRoleAccess.action) {
                  case Operations.Create:
                    if (this.userService.canUserCreate(userRole?.access as number))
                      this.viewContainer.createEmbeddedView(this.templateRef);
                    this.isAuth.next(true);
                    return;
                  case Operations.View:
                    if (this.userService.canUserRead(userRole?.access as number))
                      this.viewContainer.createEmbeddedView(this.templateRef);
                    this.isAuth.next(true);
                    return;
                  case Operations.Edit:
                    if (this.userService.canUserUpdate(userRole?.access as number))
                      this.viewContainer.createEmbeddedView(this.templateRef);
                    this.isAuth.next(true);
                    return;
                  case Operations.Delete:
                    if (this.userService.canUserDelete(userRole?.access as number))
                      this.viewContainer.createEmbeddedView(this.templateRef);
                    this.isAuth.next(true);
                    return;
                }
              }
              else if (this.userRoleAccess.role === userRole?.role.name) {
                this.viewContainer.createEmbeddedView(this.templateRef);
                this.isAuth.next(true);
                return;
              }
            }

            this.isAuth.next(false);
            return;
          });
      });
  }
}
