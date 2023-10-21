import {Component, Input} from '@angular/core';
import {Operations} from "../../shared/operations";
import {Receiving} from "../../models/receiving";
import {Router} from "@angular/router";
import {ReceivingForSiteService} from "../../services/receiving-for-site.service";
import {IFormModel} from "../../shared/interface/IFormModel";

@Component({
  selector: 'app-receiving-view',
  templateUrl: './receiving-view.component.html'
})
export class ReceivingViewComponent {
  operations = Operations;
  isLoading = true;

  constructor(private router: Router,
              private rfsService: ReceivingForSiteService) {
  }

  @Input()
  set roNumber(roNumber: string) {
    this.rfsService.get(roNumber)
      .subscribe({
        next: ro => {
          this.rfsService.receiving = ro;
          this.isLoading = false;
        },
        error: _ => {
          this.isLoading = false;
        }
      });
  }

  onSubmitted(formModel: IFormModel<Receiving>) {
    this.router?.navigate([`/receiving/${formModel.model.roNumber}/edit`],
      {queryParamsHandling: 'preserve'}
    );
  }
}
