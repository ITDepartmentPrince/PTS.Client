import { Component } from '@angular/core';
import {Operations} from "../../../shared/operations";
import {IFormModel} from "../../../shared/interface/IFormModel";
import {Router} from "@angular/router";
import {Utils} from "../../../shared/utils";
import {MatlClassification} from "../../../models/matl-classification";
import {MatlClassificationsService} from "../../../services/matl-classifications.service";

@Component({
  selector: 'app-matl-classifications-create',
  templateUrl: './matl-classifications-create.component.html'
})
export class MatlClassificationsCreateComponent {
  operations = Operations;
  error = false;
  errorMessage: string;
  matlClassification = new MatlClassification();
  isLoading = false;
  constructor(private router: Router,
              private matlClassificationsService: MatlClassificationsService) {
  }

  onSubmitted(formModel: IFormModel<MatlClassification>) {
    this.isLoading = true;
    this.matlClassificationsService.create(formModel.model)
      .subscribe({
        next: _ => {
          this.router?.navigate(['/materials-management/matl-classifications'], {
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
