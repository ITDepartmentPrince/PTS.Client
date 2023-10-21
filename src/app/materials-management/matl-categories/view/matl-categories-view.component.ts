import {Component, Input} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {IFormModel} from "../../../shared/interface/IFormModel";
import {Router} from "@angular/router";
import {MatlCategory} from "../../../models/matl-category";
import {MatlCategoriesService} from "../../../services/matl-categories.service";

@Component({
  selector: 'app-matl-categories-view',
  templateUrl: './matl-categories-view.component.html'
})
export class MatlCategoriesViewComponent {
  operations = Operations;
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

  onSubmitted(formModel: IFormModel<MatlCategory>) {
    this.router?.navigate([`/materials-management/matl-categories/${formModel.model.categoryId}/edit`],
      {queryParamsHandling: 'preserve'}
    );
  }
}
