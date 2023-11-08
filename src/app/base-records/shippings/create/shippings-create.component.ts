import { Component } from '@angular/core';
import {Operations} from "../../../shared/operations";
import {Router} from "@angular/router";
import {Utils} from "../../../shared/utils";
import {ShippingsService} from "../../../services/shippings.service";
import {Shipping} from "../../../models/shipping";

@Component({
  selector: 'app-shippings-create',
  templateUrl: './shippings-create.component.html'
})
export class ShippingsCreateComponent {
  operations = Operations;
  error = false;
  errorMessage: string;
  isLoading = false;

  constructor(private router: Router,
              private shipService: ShippingsService) {
    this.shipService.shipping = new Shipping();
  }

  onSubmitted() {
    this.isLoading = true;
    this.shipService.create()
      .subscribe({
        next: _ => {
          this.router?.navigate(['/base-records/shippings'], {
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
