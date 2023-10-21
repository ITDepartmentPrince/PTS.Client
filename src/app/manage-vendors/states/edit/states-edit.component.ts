import {Component, Input} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {IFormModel} from "../../../shared/interface/IFormModel";
import {Router} from "@angular/router";
import {Utils} from "../../../shared/utils";
import {State} from "../../../models/state";
import {StatesService} from "../../../services/states.service";
import {CountriesService} from "../../../services/countries.service";

@Component({
  selector: 'app-states-edit',
  templateUrl: './states-edit.component.html'
})
export class StatesEditComponent {
  operations = Operations;
  error = false;
  errorMessage: string;
  state = new State();
  isLoading = true;

  constructor(private router: Router,
              private statesService: StatesService,
              private countriesService: CountriesService) {
  }

  @Input()
  set stateCode(code: string) {
    this.statesService.get(code)
      .subscribe({
        next: state => {
          this.state = state;

          this.countriesService.getAll()
            .subscribe({
              next: countries => {
                this.state.countries = countries;
                this.isLoading = false;
              },
              error: _ => {
                this.isLoading = false;
              }
            });
        },
        error: _ => {
          this.isLoading = false;
        }
      });
  }

  onSubmitted = (formModel: IFormModel<State>) => {
    this.isLoading = true;
    this.statesService.edit(formModel.model)
      .subscribe({
        next: _ => {
          this.router?.navigate(['/manage-vendors/states'], {
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
