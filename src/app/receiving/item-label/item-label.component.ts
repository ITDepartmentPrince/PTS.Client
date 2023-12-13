import { Component } from '@angular/core';
import {ControlContainer, NgForm} from "@angular/forms";
import {ItemLabelService} from "../../services/item-label.service";
import {RecvdItemLotBatch} from "../../models/recvdItemLotBatch";
import {ItemLabel} from "../../models/itemLabel";

@Component({
  selector: 'app-item-label',
  templateUrl: './item-label.component.html',
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class ItemLabelComponent {

  constructor(public itemLabelService: ItemLabelService) {
  }

  labelQty(item: RecvdItemLotBatch) {
    const labelQty = item.itemsLabels.reduce((a, c) => a + (c.count * c.qty), 0);
    return labelQty > item.rlbQty ? 0 : labelQty;
  }

  onRemoveToQty(item: RecvdItemLotBatch, index: number) {
    item.itemsLabels.splice(index, 1);
  }

  onAddToQty(item: RecvdItemLotBatch) {
    const itemLabel = new ItemLabel();
    itemLabel.batchLotId = item.batchLotId;
    itemLabel.batchLotSiteId = item.batchLotSiteId;
    itemLabel.conversionRate = item.rlbConversionRate;
    item.itemsLabels.push(itemLabel);
  }
}
