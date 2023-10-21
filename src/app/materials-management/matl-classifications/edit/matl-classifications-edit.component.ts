import {Component, Input} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {IFormModel} from "../../../shared/interface/IFormModel";
import {Router} from "@angular/router";
import {Utils} from "../../../shared/utils";
import {MatlClassification} from "../../../models/matl-classification";
import {MatlClassificationsService} from "../../../services/matl-classifications.service";

@Component({
  selector: 'app-matl-classifications-edit',
  templateUrl: './matl-classifications-edit.component.html'
})
export class MatlClassificationsEditComponent {
  operations = Operations;
  error = false;
  errorMessage: string;
  matlClassification = new MatlClassification();
  isLoading = true;

  constructor(private router: Router,
              private matlClassificationsService: MatlClassificationsService) {
  }

  @Input()
  set classificationId(id: number) {
    this.matlClassificationsService.get(id)
      .subscribe({
        next: res => {
          this.matlClassification = res;
          this.isLoading = false;
        },
        error: _ => {
          this.isLoading = false;
        }
      });
  }

  onSubmitted = (formModel: IFormModel<MatlClassification>) => {
    this.isLoading = true;
    this.matlClassificationsService.edit(formModel.model)
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
