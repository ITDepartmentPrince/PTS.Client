import { Component } from '@angular/core';
import {Operations} from "../../../shared/operations";
import {Router} from "@angular/router";
import {IFormModel} from "../../../shared/interface/IFormModel";
import {Utils} from "../../../shared/utils";
import {MeasurementUnit} from "../../../models/measurement-unit";
import {MeasurementUnitsService} from "../../../services/measurement-units.service";

@Component({
  selector: 'app-measurement-units-create',
  templateUrl: './measurement-units-create.component.html'
})
export class MeasurementUnitsCreateComponent {
  operations = Operations;
  error = false;
  errorMessage: string;
  measurementUnit = new MeasurementUnit();
  isLoading = false;
  constructor(private router: Router,
              private measurementUnitsService: MeasurementUnitsService) {
  }

  onSubmitted(formModel: IFormModel<MeasurementUnit>) {
    this.isLoading = true;
    this.measurementUnitsService.create(formModel.model)
      .subscribe({
        next: _ => {
          this.router?.navigate(['/materials-management/measurement-units'], {
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
