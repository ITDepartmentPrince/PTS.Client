import {Component, Input} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {IFormModel} from "../../../shared/interface/IFormModel";
import {Router} from "@angular/router";
import {State} from "../../../models/state";
import {StatesService} from "../../../services/states.service";
import {CountriesService} from "../../../services/countries.service";

@Component({
  selector: 'app-states-view',
  templateUrl: './states-view.component.html'
})
export class StatesViewComponent {
  operations = Operations;
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

  onSubmitted(formModel: IFormModel<State>) {
    this.router?.navigate([`/manage-vendors/states/${formModel.model.stateCode}/edit`],
      {queryParamsHandling: 'preserve'}
    );
  }
}
