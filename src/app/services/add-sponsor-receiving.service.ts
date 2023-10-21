import {Receiving} from "../models/receiving";
import {Subject} from "rxjs";

export class AddSponsorReceivingService {
  receiving = new Receiving();
  itemsChange = new Subject<void>();

  getTotalQty() {
    return this.receiving.receivingItems.reduce((accumulator, currentValue) =>
      accumulator + currentValue.orderedQty, 0);
  }

  getTotalPricePerQty() {
    return this.receiving.receivingItems.reduce((accumulator, currentValue) =>
      accumulator + currentValue.pricePerOrderedQty, 0);
  }

  getTotal() {
    return this.receiving.receivingItems.reduce((accumulator, currentValue) =>
      accumulator + (currentValue.orderedQty * currentValue.pricePerOrderedQty), 0);
  }
}
