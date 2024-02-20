import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Operations} from "../../shared/operations";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthPolicy} from 'src/app/auth/auth-policy';
import {UserService} from "../../services/user.service";
import {RoleService} from "../../services/role.service";
import {RoleType} from "../../models/role";
import {SelectListItem} from "../../shared/select-list-item";

@Component({
  selector: 'app-users-form',
  templateUrl: './users-form.component.html'
})
export class UsersFormComponent implements OnInit {
  operations = Operations;
  controlState: boolean;
  @Input() isLoading = false;
  @Input() action: Operations;
  @Output() submitted = new EventEmitter<void>()
  @ViewChild('f') form: NgForm;
  protected readonly AuthPolicy = AuthPolicy;
  operationalList = new Array<SelectListItem>();
  entityList = new Array<SelectListItem>();
  administrativeList = new Array<SelectListItem>();

  constructor(public router: Router,
              public userService: UserService,
              public roleService: RoleService) {
  }

  onSubmit() {
    this.isLoading = true;
    this.userService.model.roles = [...this.administrativeList, ...this.entityList, ...this.operationalList];
    this.submitted.emit();
  }

  ngOnInit(): void {
    this.controlState = this.action === this.operations.View ||
      this.action === this.operations.Delete;

    this.roleService.getAll()
      .subscribe(roles => {
        this.userService.userLoaded.subscribe(_ => {
          this.userService.getUserRoles(this.userService.model.id)
            .subscribe(userRoles => {
              for (const role of roles) {
                const roleItem = new SelectListItem();
                roleItem.text = role.name;
                roleItem.value = role.id.toString();
                roleItem.roleType = role.roleType;
                roleItem.selected = !!userRoles.find(ur => ur.role.id === role.id);

                const access = userRoles.find(ur => ur.role.id === role.id)?.access;
                if (access) {
                  roleItem.create = this.canUserCreate(access);
                  roleItem.read = this.canUserRead(access);
                  roleItem.update = this.canUserUpdate(access);
                  roleItem.delete = this.canUserDelete(access);
                }

                if (role.roleType === RoleType.Administrative)
                  this.administrativeList.push(roleItem);

                if (role.roleType === RoleType.Operational)
                  this.operationalList.push(roleItem);

                if (role.roleType === RoleType.Entity)
                  this.entityList.push(roleItem);
              }
            });
        });
      });
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

  canUserCreate(access: number) {
    return this.getActiveBits(access)[0] === 1;
  }

  canUserRead(access: number) {
    return this.getActiveBits(access)[1] === 1;
  }

  canUserUpdate(access: number) {
    return this.getActiveBits(access)[2] === 1;
  }

  canUserDelete(access: number) {
    return this.getActiveBits(access)[3] === 1;
  }

  private getActiveBits(value: number) {
    let access = value;
    const activeBits: number[] = [];

    while (access > 0) {
      if (access === 1) {
        activeBits.push(1);
        access = 0;
      }
      else {
        activeBits.push(access % 2);
        access = Math.floor(access / 2);
      }
    }

    return activeBits;
  }
}
