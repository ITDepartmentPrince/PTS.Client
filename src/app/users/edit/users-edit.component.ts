import {Component, Input} from '@angular/core';
import {Router} from "@angular/router";
import {Operations} from "../../shared/operations";
import {UserService} from "../../services/user.service";
import {Utils} from "../../shared/utils";

@Component({
  selector: 'app-users-edit',
  templateUrl: './users-edit.component.html'
})
export class UsersEditComponent {
  operations = Operations;
  error = false;
  errorMessage: string;
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
    this.isLoading = true;
    this.userService.edit()
      .subscribe({
        next: _ => {
          this.router?.navigate(['/users'], {
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
