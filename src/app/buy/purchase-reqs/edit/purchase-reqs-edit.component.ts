import {Component, Input} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {IFormModel} from "../../../shared/interface/IFormModel";
import {Router} from "@angular/router";
import {Utils} from "../../../shared/utils";
import {PurchaseReq} from "../../../models/purchase-req";
import {PurchaseReqsService} from "../../../services/purchase-reqs.service";

@Component({
  selector: 'app-purchase-reqs-edit',
  templateUrl: './purchase-reqs-edit.component.html'
})
export class PurchaseReqsEditComponent {
  operations = Operations;
  error = false;
  errorMessage: string;
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
          this.purchaseReqsService.purchaseReq = this.purchaseReq;
          this.purchaseReqsService.purchaseItemsControlDecimal();

          this.purchaseReqsService.getRefsList()
            .subscribe({
              next: refs => {
                this.purchaseReq.classifications = refs.classifications;
                this.purchaseReq.vendors = refs.vendors;
                this.purchaseReq.vendorContacts = refs.vendorContacts;
                this.purchaseReq.otherCharges = refs.otherCharges;
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

  onSubmitted = (formModel: IFormModel<PurchaseReq>) => {
    this.isLoading = true;
    this.purchaseReqsService.edit(formModel.model)
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
