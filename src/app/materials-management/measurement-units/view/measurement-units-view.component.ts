import {Component, Input} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {Router} from "@angular/router";
import {IFormModel} from "../../../shared/interface/IFormModel";
import {MeasurementUnit} from "../../../models/measurement-unit";
import {MeasurementUnitsService} from "../../../services/measurement-units.service";

@Component({
  selector: 'app-measurement-units-view',
  templateUrl: './measurement-units-view.component.html'
})
export class MeasurementUnitsViewComponent {
  operations = Operations;
  measurementUnit = new MeasurementUnit();
  isLoading = true;

  constructor(private router: Router, private measurementUnitsService: MeasurementUnitsService) {
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

  onSubmitted(formModel: IFormModel<MeasurementUnit>) {
    this.router?.navigate([`/materials-management/measurement-units/${formModel.model.unitId}/edit`],
      {queryParamsHandling: 'preserve'}
    );
  }
}
