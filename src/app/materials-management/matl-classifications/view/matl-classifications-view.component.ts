import {Component, Input} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {IFormModel} from "../../../shared/interface/IFormModel";
import {Router} from "@angular/router";
import {MatlClassificationsService} from "../../../services/matl-classifications.service";
import {MatlClassification} from "../../../models/matl-classification";

@Component({
  selector: 'app-matl-classifications-view',
  templateUrl: './matl-classifications-view.component.html'
})
export class MatlClassificationsViewComponent {
  operations = Operations;
  matlClassification = new MatlClassification();
  isLoading = true;

  constructor(private router: Router, private matlClassificationsService: MatlClassificationsService) {
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

  onSubmitted(formModel: IFormModel<MatlClassification>) {
    this.router?.navigate([`/materials-management/matl-classifications/${formModel.model.classificationId}/edit`],
      {queryParamsHandling: 'preserve'}
    );
  }
}
