import {Component, Input} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {IFormModel} from "../../../shared/interface/IFormModel";
import {Router} from "@angular/router";
import {TaxRate} from "../../../models/tax-rate";
import {TaxRateService} from "../../../services/tax-rates.service";

@Component({
  selector: 'app-tax-rates-view',
  templateUrl: './tax-rates-view.component.html'
})
export class TaxRatesViewComponent {
  operations = Operations;
  taxRate: TaxRate;
  isLoading = true;

  constructor(private router: Router, private taxRateService: TaxRateService) {
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

  onSubmitted(formModel: IFormModel<TaxRate>) {
    this.router?.navigate([`/base-records/tax-rates/${formModel.model.taxId}/edit`],
      {queryParamsHandling: 'preserve'}
    );
  }
}
