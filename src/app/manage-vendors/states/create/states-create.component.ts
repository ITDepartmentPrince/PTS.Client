import {Component, OnInit} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {IFormModel} from "../../../shared/interface/IFormModel";
import {Router} from "@angular/router";
import {Utils} from "../../../shared/utils";
import {CountriesService} from "../../../services/countries.service";
import {State} from "../../../models/state";
import {StatesService} from "../../../services/states.service";

@Component({
  selector: 'app-states-create',
  templateUrl: './states-create.component.html'
})
export class StatesCreateComponent implements OnInit {
  operations = Operations;
  error = false;
  errorMessage: string;
  state = new State();
  isLoading = false;

  constructor(private router: Router,
              private statesService: StatesService,
              private countriesService: CountriesService) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.countriesService.getAll()
      .subscribe({
        next: countries => {
          this.state.countries = countries;
          this.isLoading = false;
        },
        error: error => {
          this._error(error);
        }
      });
  }

  onSubmitted(formModel: IFormModel<State>) {
    this.isLoading = true;
    this.statesService.create(formModel.model)
      .subscribe({
        next: _ => {
          this.router?.navigate(['/manage-vendors/states'], {
            queryParamsHandling: 'preserve'
          });
        },
        error: error => {
          this._error(error);
        }
      });
  }

  private _error(error: any) {
    this.errorMessage = Utils.handleError(error);
    this.error = true;
    this.isLoading = false;
  }
}
