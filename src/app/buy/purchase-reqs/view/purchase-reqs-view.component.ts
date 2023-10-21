import {Component, Input} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {IFormModel} from "../../../shared/interface/IFormModel";
import {Router} from "@angular/router";
import {PurchaseReq} from "../../../models/purchase-req";
import {PurchaseReqsService} from "../../../services/purchase-reqs.service";

@Component({
  selector: 'app-purchase-reqs-view',
  templateUrl: './purchase-reqs-view.component.html'
})
export class PurchaseReqsViewComponent {
  operations = Operations;
  purchaseReq: PurchaseReq;
  isLoading = true;

  constructor(private router: Router,
              private purchaseReqsService: PurchaseReqsService) {
  }

  @Input()
  set prNumber(prNumber: string) {
    this.purchaseReqsService.get(prNumber)
      .subscribe({
        next: pr => {
          this.purchaseReq = pr;
          this.purchaseReqsService.purchaseReq = pr;
          this.purchaseReqsService.purchaseItemsControlDecimal();

          this.purchaseReqsService.getRefsList()
            .subscribe({
              next: refs => {
                this.purchaseReq.classifications = refs.classifications;
                this.purchaseReq.vendors = refs.vendors;
                this.purchaseReq.vendorContacts = refs.vendorContacts;
                this.isLoading = false;
              },
              error: _ => {
                this.isLoading = false;
              }
            });
        },
        error: _ => {
          this.isLoading = false;
        }
      });
  }

  onSubmitted(formModel: IFormModel<PurchaseReq>) {
    this.router?.navigate([`/purchase-requisitions/${formModel.model.prNumber}/edit`],
      {queryParamsHandling: 'preserve'}
    );
  }
}
