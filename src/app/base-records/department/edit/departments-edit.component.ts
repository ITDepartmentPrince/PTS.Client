import {Component, Input} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {Router} from "@angular/router";
import {Utils} from "../../../shared/utils";
import {DepartmentsService} from "../../../services/departments.service";

@Component({
  selector: 'app-departments-edit',
  templateUrl: './departments-edit.component.html'
})
export class DepartmentsEditComponent {
  operations = Operations;
  error = false;
  errorMessage: string;
  isLoading = true;

  constructor(private router: Router,
              private dService: DepartmentsService) {
  }

  @Input()
  set id(id: number) {
    this.dService.get(id)
      .subscribe({
        next: res => {
          this.dService.department = res;
          this.isLoading = false;
        },
        error: _ => {
          this.isLoading = false;
        }
      });
  }

  onSubmitted = () => {
    this.isLoading = true;
    this.dService.edit()
      .subscribe({
        next: _ => {
          this.router?.navigate(['/base-records/departments'], {
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
