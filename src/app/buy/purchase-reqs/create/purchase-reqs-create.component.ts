import {Component, OnInit} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {Router} from "@angular/router";
import {IFormModel} from "../../../shared/interface/IFormModel";
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
  purchaseReq = new PurchaseReq();
  isLoading = true;

  constructor(private router: Router,
              private purchaseReqsService: PurchaseReqsService) {
    if (!this.router.getCurrentNavigation()?.extras.state?.['duplicate'])
      this.purchaseReqsService.purchaseReq = this.purchaseReq;
    else
      if (this.purchaseReqsService.purchaseReq)
        this.purchaseReq = this.purchaseReqsService.purchaseReq;
      else
        this.purchaseReqsService.purchaseReq = this.purchaseReq;
  }

  ngOnInit(): void {
    this.purchaseReqsService.getRefsList()
      .subscribe({
        next: refs => {
          this.purchaseReq.classifications = refs.classifications;
          this.purchaseReq.vendors = refs.vendors;
          this.purchaseReq.otherCharges = refs.otherCharges;
          this.purchaseReq.departments = refs.departments;
          this.purchaseReq.payTerms = refs.payTerms;
          this.purchaseReq.shippings = refs.shippings;
          this.purchaseReq.sites = refs.sites;
          this.isLoading = false;

          //set the classificationId to raw materials by default.
          const rawMaterial = refs.classifications?.find(c =>
            c.classificationName?.includes('Raw Materials'))?.classificationId;

          if (rawMaterial !== undefined) {
            this.purchaseReq.classificationId = rawMaterial;
            this.purchaseReq.rawMaterial = rawMaterial;
          }
        },
        error: _ => {
          this.isLoading = false;
        }
      });
  }

  onSubmitted(formModel: IFormModel<PurchaseReq>) {
    this.isLoading = true;
    this.purchaseReqsService.create(formModel.model)
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
