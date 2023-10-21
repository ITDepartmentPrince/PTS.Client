import {Component, Input} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {IFormModel} from "../../../shared/interface/IFormModel";
import {Router} from "@angular/router";
import {Utils} from "../../../shared/utils";
import {MatlCategory} from "../../../models/matl-category";
import {MatlCategoriesService} from "../../../services/matl-categories.service";

@Component({
  selector: 'app-matl-categories-edit',
  templateUrl: './matl-categories-edit.component.html'
})
export class MatlCategoriesEditComponent {
  operations = Operations;
  error = false;
  errorMessage: string;
  category = new MatlCategory();
  isLoading = true;

  constructor(private router: Router,
              private matlCategoriesService: MatlCategoriesService) {
  }

  @Input()
  set categoryId(id: number) {
    this.matlCategoriesService.get(id)
      .subscribe({
        next: res => {
          this.category = res;
          this.isLoading = false;
        },
        error: _ => {
          this.isLoading = false;
        }
      });
  }

  onSubmitted = (formModel: IFormModel<MatlCategory>) => {
    this.isLoading = true;
    this.matlCategoriesService.edit(formModel.model)
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
