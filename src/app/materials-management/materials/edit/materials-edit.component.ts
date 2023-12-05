import {Component, Input} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {Router} from "@angular/router";
import {Utils} from "../../../shared/utils";
import {MaterialsService} from "../../../services/materials.service";

@Component({
  selector: 'app-materials-edit',
  templateUrl: './materials-edit.component.html'
})
export class MaterialsEditComponent {
  operations = Operations;
  error = false;
  errorMessage: string;
  isLoading = true;

  constructor(private router: Router,
              private matService: MaterialsService) {
  }

  @Input()
  set materialId(id: number) {
    this.matService.get(id)
      .subscribe(res => {
          this.matService.material = res;

        this.matService.material.isUomConverted =
          this.matService.material.convertToUomId as number > 0 &&
          this.matService.material.conversionRate as number > 0;
      });
  }

  onSubmitted = () => {
    this.isLoading = true;

    this.matService.edit()
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
