import { Component } from '@angular/core';
import {Operations} from "../../../shared/operations";
import {IFormModel} from "../../../shared/interface/IFormModel";
import {Router} from "@angular/router";
import {Utils} from "../../../shared/utils";
import {Country} from "../../../models/country";
import {CountriesService} from "../../../services/countries.service";

@Component({
  selector: 'app-countries-create',
  templateUrl: './countries-create.component.html'
})
export class CountriesCreateComponent {
  operations = Operations;
  error = false;
  errorMessage: string;
  country = new Country();
  isLoading = false;
  constructor(private router: Router,
              private countriesService: CountriesService) {
  }

  onSubmitted(formModel: IFormModel<Country>) {
    this.isLoading = true;
    this.countriesService.create(formModel.model)
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
