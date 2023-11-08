import {Component, Input} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {Router} from "@angular/router";
import {Utils} from "../../../shared/utils";
import {ShippingsService} from "../../../services/shippings.service";

@Component({
  selector: 'app-shippings-edit',
  templateUrl: './shippings-edit.component.html'
})
export class ShippingsEditComponent {
  operations = Operations;
  error = false;
  errorMessage: string;
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

  onSubmitted = () => {
    this.isLoading = true;
    this.shipService.edit()
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
