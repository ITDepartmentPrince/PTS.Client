import {Component, Input, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Operations} from "../../shared/operations";
import {UserService} from "../../services/user.service";
import {SelectListItem} from "../../shared/select-list-item";
import {Role, RoleType} from "../../models/role";
import {RoleService} from "../../services/role.service";
import {AuthPolicy} from "../../auth/auth-policy";
import {UserRole} from "../../models/user-role";
import {AuthConstant} from "../../auth/auth.constant";
import {OidcSecurityService} from "angular-auth-oidc-client";
import {Utils} from "../../shared/utils";
import {RolesConstant} from "../../auth/roles-constant";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {
  protected readonly authPolicy = AuthPolicy;
  protected readonly operations = Operations;
  private userId: number;
  action: Operations;
  controlState: boolean;
  isLoading = true;
  errorMessage: string;
  operationalList: SelectListItem[] = [];
  entityList: SelectListItem[] = [];
  administrativeList: SelectListItem[] = [];

  constructor(private authService: OidcSecurityService,
              private route: ActivatedRoute,
              public router: Router,
              public userService: UserService,
              private roleService: RoleService) {
    this.action = this.route.snapshot.data['action'] as Operations;
    this.controlState = this.action === Operations.View;
  }

  @Input()
  set id(id: number) {
    if (this.action !== Operations.Create)
      this.userId = id;
  }

  ngOnInit(): void {
    if (this.action !== Operations.Create) {
      this.userService.get(this.userId)
        .subscribe({
          next: user => {
            this.userService.user = user;

            this.roleService.getAll()
              .subscribe(roles => {
                this.userService.getUserRoles(this.userId)
                  .subscribe(userRoles => {
                    this.setRolesForUser(roles, userRoles);

                    this.isLoading = false;
                  });
              });
          },
          error: error => {
            this.errorMessage = Utils.handleError(error);
            this.isLoading = false;
          }
        });
    }
    else {
      this.authService.getAuthorizeUrl()
        .subscribe(value => {
          window.location.replace(AuthConstant.idpRoot +
            '/Identity/Account/Register?ReturnUrl=' +
            encodeURIComponent(value?.substring(value?.indexOf('/connect')) as string));
        });
    }
  }

  onSubmit() {
    this.isLoading = true;

    if (this.action !== Operations.Create)
      this.userService.user.roles = [...this.administrativeList, ...this.entityList, ...this.operationalList];

    switch (this.action) {
      case Operations.View:
        this.router?.navigate([`/users/${this.userId}/edit`], { queryParamsHandling: 'preserve' });
      break;

      case Operations.Edit:
        this.userService.edit()
          .subscribe({
            next: _ => {
              this.router?.navigate(['/users'], { queryParamsHandling: 'preserve' });
            },
            error: error => {
              this.errorMessage = Utils.handleError(error);
              this.isLoading = false;
            }
          });
      break;
    }
  }

  displayText(text: string) {
    switch (text) {
      case 'PRApprover':
        return 'Purchase requisition approver';
      case 'POApprover':
        return 'Purchase order approver';
      case 'ExecutiveApprover':
        return 'Executive approver';
      default:
        return text;
    }
  }

  private setRolesForUser(roles: Role[], userRoles: UserRole[]) {
    for (const role of roles) {
      const roleItem = new SelectListItem();
      roleItem.text = role.name;
      roleItem.value = role.id.toString();
      roleItem.roleType = role.roleType;
      roleItem.selected = !!userRoles.find(ur => ur.role.id === role.id);

      const access = userRoles.find(ur => ur.role.id === role.id)?.access;
      if (access) {
        roleItem.create = this.userService.canUserCreate(access);
        roleItem.read = this.userService.canUserRead(access);
        roleItem.update = this.userService.canUserUpdate(access);
        roleItem.delete = this.userService.canUserDelete(access);
      }

      if (role.roleType === RoleType.Administrative)
        this.administrativeList.push(roleItem);

      if (role.roleType === RoleType.Operational)
        this.operationalList.push(roleItem);

      if (role.roleType === RoleType.Entity)
        this.entityList.push(roleItem);
    }
  }

  protected readonly RolesConstant = RolesConstant;
}
