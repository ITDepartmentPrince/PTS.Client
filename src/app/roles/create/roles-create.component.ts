import { Component } from '@angular/core';
import {Operations} from "../../shared/operations";
import {Router} from "@angular/router";
import {RoleService} from "../../services/role.service";
import {Utils} from "../../shared/utils";
import {Role} from "../../models/role";

@Component({
  selector: 'app-roles-create',
  templateUrl: './roles-create.component.html'
})
export class RolesCreateComponent {
  operations = Operations;
  error = false;
  errorMessage: string;
  isLoading = false;
  constructor(private router: Router,
              private roleService: RoleService) {
    this.roleService.model = new Role();
  }

  onSubmitted() {
    this.isLoading = true;
    this.roleService.create()
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
