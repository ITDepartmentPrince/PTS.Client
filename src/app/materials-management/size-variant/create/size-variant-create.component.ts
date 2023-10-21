import { Component } from '@angular/core';
import {Operations} from "../../../shared/operations";
import {SizeVariant} from "../../../models/size-variant";
import {IFormModel} from "../../../shared/interface/IFormModel";
import {Router} from "@angular/router";
import {SizeVariantService} from "../../../services/size-variant.service";
import {Utils} from "../../../shared/utils";

@Component({
  selector: 'app-size-variant-create',
  templateUrl: './size-variant-create.component.html'
})
export class SizeVariantCreateComponent {
  operations = Operations;
  error = false;
  errorMessage: string;
  sizeVariant = new SizeVariant();
  isLoading = false;
  constructor(private router: Router,
              private sizeVariantService: SizeVariantService) {
  }

  onSubmitted(formModel: IFormModel<SizeVariant>) {
    this.isLoading = true;
    this.sizeVariantService.create(formModel.model)
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
