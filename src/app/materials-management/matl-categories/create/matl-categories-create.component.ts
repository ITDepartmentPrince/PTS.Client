import { Component } from '@angular/core';
import {Operations} from "../../../shared/operations";
import {IFormModel} from "../../../shared/interface/IFormModel";
import {Router} from "@angular/router";
import {Utils} from "../../../shared/utils";
import {MatlCategory} from "../../../models/matl-category";
import {MatlCategoriesService} from "../../../services/matl-categories.service";

@Component({
  selector: 'app-matl-categories-create',
  templateUrl: './matl-categories-create.component.html'
})
export class MatlCategoriesCreateComponent {
  operations = Operations;
  error = false;
  errorMessage: string;
  category = new MatlCategory();
  isLoading = false;
  constructor(private router: Router,
              private matlCategoriesService: MatlCategoriesService) {
  }

  onSubmitted(formModel: IFormModel<MatlCategory>) {
    this.isLoading = true;
    this.matlCategoriesService.create(formModel.model)
      .subscribe({
        next: _ => {
          this.router?.navigate(['/materials-management/matl-categories'], {
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
