import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";
import {Operations} from "../../shared/operations";
import {Utils} from "../../shared/utils";
import {RoleService} from "../../services/role.service";

@Component({
  selector: 'app-roles-edit',
  templateUrl: './roles-edit.component.html'
})
export class RolesEditComponent {
  operations = Operations;
  error = false;
  errorMessage: string;
  isLoading = true;

  constructor(private router: Router,
              private roleService: RoleService) {
  }

  @Input()
  set id(id: number) {
    this.roleService.get(id)
      .subscribe({
        next: res => {
          this.roleService.model = res;
          this.isLoading = false;
        },
        error: _ => {
          this.isLoading = false;
        }
      });
  }

  onSubmitted() {
    this.isLoading = true;
    this.roleService.edit()
      .subscribe({
        next: _ => {
          this.router?.navigate(['/roles'], {
            queryParamsHandling: 'preserve'
          });
        },
        error: error => {
          this.errorMessage = Utils.handleError(error);
          this.error = true;
          this.isLoading = false;
        }
      });
  }
}
