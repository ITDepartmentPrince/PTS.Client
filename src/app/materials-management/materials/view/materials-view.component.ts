import {Component, Input} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {Router} from "@angular/router";
import {MaterialsService} from "../../../services/materials.service";

@Component({
  selector: 'app-materials-view',
  templateUrl: './materials-view.component.html'
})
export class MaterialsViewComponent {
  operations = Operations;

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

  onSubmitted() {
    this.router?.navigate([`/materials-management/materials/${this.matService.material.id}/edit`],
      {queryParamsHandling: 'preserve'}
    );
  }
}
