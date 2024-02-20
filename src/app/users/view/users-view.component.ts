import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";
import {Operations} from "../../shared/operations";
import {UserService} from "../../services/user.service";

@Component({
  selector: 'app-users-view',
  templateUrl: './users-view.component.html'
})
export class UsersViewComponent {
  operations = Operations;
  isLoading = true;

  constructor(private router: Router,
              private userService: UserService) {
  }

  @Input()
  set id(id: number) {
    this.userService.get(id)
      .subscribe({
        next: res => {
          this.userService.model = res;
          this.isLoading = false;
          this.userService.userLoaded.emit();
        },
        error: _ => {
          this.isLoading = false;
        }
      });
  }

  onSubmitted() {
    this.router?.navigate([`/users/${this.userService.model.id}/edit`],
      {queryParamsHandling: 'preserve'}
    );
  }
}
