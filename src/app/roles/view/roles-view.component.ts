import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";
import {Operations} from "../../shared/operations";
import {RoleService} from "../../services/role.service";

@Component({
  selector: 'app-roles-view',
  templateUrl: './roles-view.component.html'
})
export class RolesViewComponent {
  operations = Operations;
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
    this.router?.navigate([`/roles/${this.roleService.model.id}/edit`],
      {queryParamsHandling: 'preserve'}
    );
  }
}
