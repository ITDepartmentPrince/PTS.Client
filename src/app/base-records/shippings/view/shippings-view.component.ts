import {Component, Input} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {Router} from "@angular/router";
import {DepartmentsService} from "../../../services/departments.service";
import {ShippingsService} from "../../../services/shippings.service";

@Component({
  selector: 'app-shippings-view',
  templateUrl: './shippings-view.component.html'
})
export class ShippingsViewComponent {
  operations = Operations;
  isLoading = true;

  constructor(private router: Router,
              private shipService: ShippingsService) {
  }

  @Input()
  set id(id: number) {
    this.shipService.get(id)
      .subscribe({
        next: res => {
          this.shipService.shipping = res;
          this.isLoading = false;
        },
        error: _ => {
          this.isLoading = false;
        }
      });
  }

  onSubmitted() {
    this.router?.navigate([`/base-records/shippings/${this.shipService.shipping.id}/edit`],
      {queryParamsHandling: 'preserve'}
    );
  }
}
