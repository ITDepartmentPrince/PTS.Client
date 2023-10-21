import {Component, Input} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {SizeVariant} from "../../../models/size-variant";
import {IFormModel} from "../../../shared/interface/IFormModel";
import {Router} from "@angular/router";
import {SizeVariantService} from "../../../services/size-variant.service";
import {Utils} from "../../../shared/utils";

@Component({
  selector: 'app-size-variant-edit',
  templateUrl: './size-variant-edit.component.html'
})
export class SizeVariantEditComponent {
  operations = Operations;
  error = false;
  errorMessage: string;
  sizeVariant = new SizeVariant();
  isLoading = true;

  constructor(private router: Router,
              private sizeVariantService: SizeVariantService) {
  }

  @Input()
  set sizeId(id: number) {
    this.sizeVariantService.get(id)
      .subscribe({
        next: res => {
          this.sizeVariant = res;
          this.isLoading = false;
        },
        error: _ => {
          this.isLoading = false;
        }
      });
  }

  onSubmitted = (formModel: IFormModel<SizeVariant>) => {
    this.isLoading = true;
    this.sizeVariantService.edit(formModel.model)
      .subscribe({
        next: _ => {
          this.router?.navigate(['/materials-management/size-variant'], {
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
