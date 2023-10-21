import {Component, Input} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {IFormModel} from "../../../shared/interface/IFormModel";
import {Router} from "@angular/router";
import {Country} from "../../../models/country";
import {CountriesService} from "../../../services/countries.service";

@Component({
  selector: 'app-countries-view',
  templateUrl: './countries-view.component.html'
})
export class CountriesViewComponent {
  operations = Operations;
  country = new Country();
  isLoading = true;

  constructor(private router: Router, private countriesService: CountriesService) {
  }

  @Input()
  set countryCode(code: string) {
    this.countriesService.get(code)
      .subscribe({
        next: res => {
          this.country = res;
          this.isLoading = false;
        },
        error: _ => {
          this.isLoading = false;
        }
      });
  }

  onSubmitted(formModel: IFormModel<Country>) {
    this.router?.navigate([`/manage-vendors/countries/${formModel.model.countryCode}/edit`],
      {queryParamsHandling: 'preserve'}
    );
  }
}
