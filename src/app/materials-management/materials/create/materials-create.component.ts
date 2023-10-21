import {Component, OnInit} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {IFormModel} from "../../../shared/interface/IFormModel";
import {Router} from "@angular/router";
import {Utils} from "../../../shared/utils";
import {Material} from "../../../models/material";
import {MaterialsService} from "../../../services/materials.service";

@Component({
  selector: 'app-materials-create',
  templateUrl: './materials-create.component.html'
})
export class MaterialsCreateComponent implements OnInit {
  operations = Operations;
  error = false;
  errorMessage: string;
  material = new Material();
  isLoading = false;

  constructor(private router: Router,
              private materialsService: MaterialsService) {
  }

  ngOnInit(): void {
    this.isLoading = true;

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
        error: error => {
          this._error(error);
        }
      });
  }

  onSubmitted(formModel: IFormModel<Material>) {
    this.isLoading = true;
    this.materialsService.create(formModel.model)
      .subscribe({
        next: _ => {
          this.router?.navigate(['/materials-management/materials'], {
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
