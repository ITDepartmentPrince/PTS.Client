import {Component, OnInit} from '@angular/core';
import {PrintLabelsService} from "../print-labels.service";
import {ItemLabel} from "../../models/itemLabel";
import {ItemLabelService} from "../../services/item-label.service";

@Component({
  selector: 'app-items-label',
  templateUrl: './items-label.component.html',
  styleUrls: ['./items-label.component.css']
})
export class ItemsLabelComponent implements OnInit {
  itemLabels: ItemLabel[];

  constructor(private printLabelsService: PrintLabelsService,
              private itemLabelService: ItemLabelService) {
  }

  ngOnInit(): void {
    this.itemLabelService.getLabelsByIds(this.printLabelsService.data)
      .subscribe(res => {
        this.itemLabels = res;
        if (this.itemLabels)
          this.printLabelsService.onPrint();
      });
  }

  setQrData(itemLabel: ItemLabel) {
    const label = new ItemLabel();
    label.id = itemLabel.id;
    label.batchLotId = itemLabel.batchLotId;
    label.batchLotSiteId = itemLabel.batchLotSiteId;
    label.shelfCode = itemLabel.shelfCode;
    label.qty = itemLabel.qty;
    label.conversionRate = itemLabel.conversionRate;
    return JSON.stringify(label);
  }
}
