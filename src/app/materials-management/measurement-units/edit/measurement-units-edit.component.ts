import {Component, Input} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {Router} from "@angular/router";
import {IFormModel} from "../../../shared/interface/IFormModel";
import {Utils} from "../../../shared/utils";
import {MeasurementUnit} from "../../../models/measurement-unit";
import {MeasurementUnitsService} from "../../../services/measurement-units.service";

@Component({
  selector: 'app-measurement-units-edit',
  templateUrl: './measurement-units-edit.component.html'
})
export class MeasurementUnitsEditComponent {
  operations = Operations;
  error = false;
  errorMessage: string;
  measurementUnit = new MeasurementUnit();
  isLoading = true;

  constructor(private router: Router,
              private measurementUnitsService: MeasurementUnitsService) {
  }

  @Input()
  set unitId(id: number) {
    this.measurementUnitsService.get(id)
      .subscribe({
        next: res => {
          this.measurementUnit = res;
          this.isLoading = false;
        },
        error: _ => {
          this.isLoading = false;
        }
      });
  }

  onSubmitted = (formModel: IFormModel<MeasurementUnit>) => {
    this.isLoading = true;
    this.measurementUnitsService.edit(formModel.model)
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
