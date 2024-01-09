import { Component } from '@angular/core';
import {ItemLabelService} from "../../../services/item-label.service";
import {ControlContainer, NgForm} from "@angular/forms";

@Component({
  selector: 'app-add-st-qty-scan',
  templateUrl: './add-st-qty-scan.component.html',
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]

})
export class AddStQtyScanComponent {
  constructor(public itemLabelService: ItemLabelService) {
  }

  onItemScanned(scannedItem: any) {
    this.itemLabelService
      .getLabelWithBatchLot(JSON.parse(scannedItem).id)
      .subscribe(res => {
        res.toTransferQty = 0;
        if (!this.itemLabelService.itemLabels.some(e => e.id === res.id))
          this.itemLabelService.itemLabels.push(res);
      });
  }

  onRemoveItem(index: number) {
    this.itemLabelService.itemLabels.splice(index, 1);
  }
}
