import {Component, Input} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {Router} from "@angular/router";
import {PurchaseReqsService} from "../../../services/purchase-reqs.service";
import {UserService} from "../../../services/user.service";

@Component({
  selector: 'app-purchase-reqs-view',
  templateUrl: './purchase-reqs-view.component.html'
})
export class PurchaseReqsViewComponent {
  operations = Operations;

  constructor(private router: Router,
              private userService: UserService,
              private prService: PurchaseReqsService) {
  }

  @Input()
  set prNumber(prNumber: string) {
    this.prService.get(prNumber)
      .subscribe(res => {
          this.prService.purchaseReq = res;
          this.prService.purchaseItemsControlDecimal();

          /*if (this.purchaseReq.approveUserId)
            this.userService.get(this.purchaseReq.approveUserId)
              .subscribe(res => {
                const aUser = new ApproveUser();
                aUser.auFirstName = res.firstName;
                aUser.auLastName = res.lastName;
                this.purchaseReq.approveUser = aUser;
              });*/
      });
  }

  onSubmitted() {
    this.router?.navigate([`/purchase-requisitions/${this.prService.purchaseReq.prNumber}/edit`],
      {queryParamsHandling: 'preserve'}
    );
  }
}
