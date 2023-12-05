import {Component, Input} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {Router} from "@angular/router";
import {Utils} from "../../../shared/utils";
import {PurchaseReqsService} from "../../../services/purchase-reqs.service";

@Component({
  selector: 'app-purchase-reqs-edit',
  templateUrl: './purchase-reqs-edit.component.html'
})
export class PurchaseReqsEditComponent {
  operations = Operations;
  error = false;
  errorMessage: string;
  isLoading = true;

  constructor(private router: Router,
              private prService: PurchaseReqsService) {
  }

  @Input()
  set prNumber(prNumber: string) {
    this.prService.get(prNumber)
      .subscribe(res => {
          this.prService.purchaseReq = res;
          this.prService.purchaseItemsControlDecimal();
      });
  }

  onSubmitted = () => {
    this.isLoading = true;

    this.prService.edit()
      .subscribe({
        next: _ => {
          this.router?.navigate(['/purchase-requisitions'], {
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
