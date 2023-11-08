import { Component } from '@angular/core';
import {Operations} from "../../../shared/operations";
import {Router} from "@angular/router";
import {Utils} from "../../../shared/utils";
import {DepartmentsService} from "../../../services/departments.service";
import {Department} from "../../../models/department";

@Component({
  selector: 'app-departments-create',
  templateUrl: './departments-create.component.html'
})
export class DepartmentsCreateComponent {
  operations = Operations;
  error = false;
  errorMessage: string;
  isLoading = false;

  constructor(private router: Router,
              private dService: DepartmentsService) {
    this.dService.department = new Department();
  }

  onSubmitted() {
    this.isLoading = true;
    this.dService.create()
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
