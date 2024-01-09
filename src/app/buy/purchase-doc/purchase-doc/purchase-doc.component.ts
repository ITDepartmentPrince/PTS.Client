import {AfterViewInit, Component, ElementRef, EventEmitter, ViewChild} from '@angular/core';
import {ImageService} from "../../../services/image.service";
import {PurchaseReqItem} from "../../../models/purchase-req-item";
import {PurchaseReqCharges} from "../../../models/purchase-req-charges";

@Component({
  selector: 'purchase-doc',
  templateUrl: './purchase-doc.component.html'
})
export class PurchaseDocComponent implements AfterViewInit {
  logo: string;
  model: any;
  imagesLoaded = new EventEmitter<void>();
  @ViewChild('imgLogo') imgLogo: ElementRef;

  constructor(private imageService: ImageService) {
  }

  ngAfterViewInit(): void {
    this.imageService.imageToDataUri('/assets/images/app/pss_logo.webp')
      .subscribe(res => {
        this.logo = res;

        this.imgLogo.nativeElement.onload = (_: any) => {
          this.imagesLoaded.emit();
        }
      });
  }

  getItemTotal(item: PurchaseReqItem): number {
    return item.pricePerQty * item.quantity;
  }

  getTotalQty(): number {
    return this.model.purchaseReq.purchaseReqItems
      .reduce((a: number, c: PurchaseReqItem) => a + c.quantity, 0);
  }

  getTotalPricePerQty(): number {
    return this.model.purchaseReq.purchaseReqItems
      .reduce((a: number, c: PurchaseReqItem) => a + c.pricePerQty, 0);
  }

  getTotal(): number {
    return this.model.purchaseReq.purchaseReqItems
      .reduce((a: number, c: PurchaseReqItem) => a + (c.quantity * c.pricePerQty), 0);
  }

  getTotalTaxRate(): number {
    return this.model.purchaseReq.purchaseReqItems
      .reduce((a: number, c: PurchaseReqItem) => {
        return a + (c.quantity * c.pricePerQty * (c.taxRate.rate ?? 0) / 100.0)
      }, 0);
  }

  getAddChargesTotal(): number {
    return this.model.purchaseReq.purchaseReqCharges
      .reduce((a: number, c: PurchaseReqCharges) => a + c.amount, 0);
  }
}
