import {Component, Input} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {SizeVariant} from "../../../models/size-variant";
import {IFormModel} from "../../../shared/interface/IFormModel";
import {Router} from "@angular/router";
import {SizeVariantService} from "../../../services/size-variant.service";

@Component({
  selector: 'app-size-variant-view',
  templateUrl: './size-variant-view.component.html'
})
export class SizeVariantViewComponent {
  operations = Operations;
  sizeVariant = new SizeVariant();
  isLoading = true;

  constructor(private router: Router, private sizeVariantService: SizeVariantService) {
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

  onSubmitted(formModel: IFormModel<SizeVariant>) {
    this.router?.navigate([`/materials-management/size-variant/${formModel.model.sizeId}/edit`],
      {queryParamsHandling: 'preserve'}
    );
  }
}
