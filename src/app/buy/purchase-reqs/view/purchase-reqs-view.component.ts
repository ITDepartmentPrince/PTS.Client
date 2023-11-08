import {Component, Input} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {IFormModel} from "../../../shared/interface/IFormModel";
import {Router} from "@angular/router";
import {PurchaseReq} from "../../../models/purchase-req";
import {PurchaseReqsService} from "../../../services/purchase-reqs.service";
import {UserService} from "../../../services/user-service";
import {ApproveUser} from "../../../models/approve-user";

@Component({
  selector: 'app-purchase-reqs-view',
  templateUrl: './purchase-reqs-view.component.html'
})
export class PurchaseReqsViewComponent {
  operations = Operations;
  purchaseReq: PurchaseReq;
  isLoading = true;

  constructor(private router: Router,
              private userService: UserService,
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
                this.purchaseReq.departments = refs.departments;
                this.purchaseReq.payTerms = refs.payTerms;
                this.purchaseReq.shippings = refs.shippings;
                this.purchaseReq.sites = refs.sites;
                this.isLoading = false;
              },
              error: _ => {
                this.isLoading = false;
              }
            });

          if (this.purchaseReq.approveUserId)
            this.userService.get(this.purchaseReq.approveUserId)
              .subscribe(res => {
                const aUser = new ApproveUser();
                aUser.auFirstName = res.firstName;
                aUser.auLastName = res.lastName;
                this.purchaseReq.approveUser = aUser;
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
