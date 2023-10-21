import {Component, Input} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {IFormModel} from "../../../shared/interface/IFormModel";
import {Router} from "@angular/router";
import {Utils} from "../../../shared/utils";
import {TaxRate} from "../../../models/tax-rate";
import {TaxRateService} from "../../../services/tax-rates.service";

@Component({
  selector: 'app-tax-rates-edit',
  templateUrl: './tax-rates-edit.component.html'
})
export class TaxRatesEditComponent {
  operations = Operations;
  error = false;
  errorMessage: string;
  taxRate: TaxRate;
  isLoading = true;

  constructor(private router: Router,
              private taxRateService: TaxRateService) {
  }

  @Input()
  set taxId(id: number) {
    this.taxRateService.get(id)
      .subscribe({
        next: res => {
          this.taxRate = res;
          this.isLoading = false;
        },
        error: _ => {
          this.isLoading = false;
        }
      });
  }

  onSubmitted = (formModel: IFormModel<TaxRate>) => {
    this.isLoading = true;
    this.taxRateService.edit(formModel.model)
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
