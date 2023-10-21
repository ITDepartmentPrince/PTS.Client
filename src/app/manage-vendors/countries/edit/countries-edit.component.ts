import {Component, Input} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {IFormModel} from "../../../shared/interface/IFormModel";
import {Router} from "@angular/router";
import {Utils} from "../../../shared/utils";
import {Country} from "../../../models/country";
import {CountriesService} from "../../../services/countries.service";

@Component({
  selector: 'app-countries-edit',
  templateUrl: './countries-edit.component.html'
})
export class CountriesEditComponent {
  operations = Operations;
  error = false;
  errorMessage: string;
  country = new Country();
  isLoading = true;

  constructor(private router: Router,
              private countriesService: CountriesService) {
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

  onSubmitted = (formModel: IFormModel<Country>) => {
    this.isLoading = true;
    this.countriesService.edit(formModel.model)
      .subscribe({
        next: _ => {
          this.router?.navigate(['/manage-vendors/countries'], {
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
