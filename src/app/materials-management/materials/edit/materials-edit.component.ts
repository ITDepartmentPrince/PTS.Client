import {Component, Input} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {IFormModel} from "../../../shared/interface/IFormModel";
import {Router} from "@angular/router";
import {Utils} from "../../../shared/utils";
import {Material} from "../../../models/material";
import {MaterialsService} from "../../../services/materials.service";

@Component({
  selector: 'app-materials-edit',
  templateUrl: './materials-edit.component.html'
})
export class MaterialsEditComponent {
  operations = Operations;
  error = false;
  errorMessage: string;
  material = new Material();
  isLoading = true;

  constructor(private router: Router,
              private materialsService: MaterialsService) {
  }

  @Input()
  set materialId(id: number) {
    this.materialsService.get(id)
      .subscribe({
        next: material => {
          this.material = material;
          this.material.isPurchaseDifferent = this.material.defaultUomUnitId as number > 0 &&
            this.material.conversionRate as number > 0;

          this.materialsService.getRefsList()
            .subscribe({
              next: refs => {
                this.material.measurementUnits = refs.measurementUnits;
                this.material.classifications = refs.classifications;
                this.material.matlCategories = refs.matlCategories;
                this.material.sizeVariants = refs.sizeVariants;
                this.material.vendors = refs.vendors;
                this.material.defaultUomUnits = refs.measurementUnits;
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

  onSubmitted = (formModel: IFormModel<Material>) => {
    this.isLoading = true;
    this.materialsService.edit(formModel.model)
      .subscribe({
        next: _ => {
          this.router?.navigate(['/materials-management/materials'], {
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
