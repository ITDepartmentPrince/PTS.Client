import {Component, Input} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {Router} from "@angular/router";
import {DepartmentsService} from "../../../services/departments.service";

@Component({
  selector: 'app-departments-view',
  templateUrl: './departments-view.component.html'
})
export class DepartmentsViewComponent {
  operations = Operations;
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

  onSubmitted() {
    this.router?.navigate([`/base-records/departments/${this.dService.department.id}/edit`],
      {queryParamsHandling: 'preserve'}
    );
  }
}
