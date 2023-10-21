import {Component, Input} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {IFormModel} from "../../../shared/interface/IFormModel";
import {Router} from "@angular/router";
import {Material} from "../../../models/material";
import {MaterialsService} from "../../../services/materials.service";

@Component({
  selector: 'app-materials-view',
  templateUrl: './materials-view.component.html'
})
export class MaterialsViewComponent {
  operations = Operations;
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

  onSubmitted(formModel: IFormModel<Material>) {
    this.router?.navigate([`/materials-management/materials/${formModel.model.materialId}/edit`],
      {queryParamsHandling: 'preserve'}
    );
  }
}
