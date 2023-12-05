import {Component, OnInit} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {Router} from "@angular/router";
import {Utils} from "../../../shared/utils";
import {PurchaseReq} from "../../../models/purchase-req";
import {PurchaseReqsService} from "../../../services/purchase-reqs.service";

@Component({
  selector: 'app-purchase-reqs-create',
  templateUrl: './purchase-reqs-create.component.html'
})
export class PurchaseReqsCreateComponent implements OnInit {
  operations = Operations;
  error = false;
  errorMessage: string;
  isLoading = true;

  constructor(private router: Router,
              private prService: PurchaseReqsService) {
  }

  ngOnInit(): void {
    if (!this.prService.isDuplicate)
      this.prService.purchaseReq = new PurchaseReq();

    this.prService.isDuplicate = false;
  }

  onSubmitted() {
    this.isLoading = true;

    this.prService.create()
      .subscribe({
        next: _ => {
          this.router?.navigate(['/purchase-requisitions'], {
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
