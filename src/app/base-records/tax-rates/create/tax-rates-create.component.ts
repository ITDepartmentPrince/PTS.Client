import { Component } from '@angular/core';
import {Operations} from "../../../shared/operations";
import {IFormModel} from "../../../shared/interface/IFormModel";
import {Router} from "@angular/router";
import {Utils} from "../../../shared/utils";
import {TaxRate} from "../../../models/tax-rate";
import {TaxRateService} from "../../../services/tax-rates.service";

@Component({
  selector: 'app-tax-rates-create',
  templateUrl: './tax-rates-create.component.html'
})
export class TaxRatesCreateComponent {
  operations = Operations;
  error = false;
  errorMessage: string;
  taxRate = new TaxRate();
  isLoading = false;
  constructor(private router: Router,
              private taxRateService: TaxRateService) {
  }

  onSubmitted(formModel: IFormModel<TaxRate>) {
    this.isLoading = true;
    this.taxRateService.create(formModel.model)
      .subscribe({
        next: _ => {
          this.router?.navigate(['/base-records/tax-rates'], {
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
