import {Component, OnInit} from '@angular/core';
import {ReceivingForSiteService} from "../../services/receiving-for-site.service";
import {Material} from "../../models/material";
import {MaterialsService} from "../../services/materials.service";
import {MeasurementUnit} from "../../models/measurement-unit";
import {BatchLot} from "../../models/batchLot";
import {ReceivingItem} from "../../models/receivingItem";
import {RecvdItemLotBatch} from "../../models/recvdItemLotBatch";
import {ControlContainer, NgForm} from "@angular/forms";
import {ReceivingService} from "../../services/receiving.service";
import {BatchesLotsService} from "../../services/batches-lots.service";

@Component({
  selector: 'app-receive-items-lots-batches',
  templateUrl: './receive-items-lots-batches.component.html',
  styleUrls: ['./receive-items-lots-batches.component.css'],
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class ReceiveItemsLotsBatchesComponent implements OnInit {
  isLoading = true;
  recvdDate: any;
  materials: Array<Material>;
  measurementUnits: Array<MeasurementUnit>;

  constructor(public rfsService: ReceivingForSiteService,
              private receivingService: ReceivingService,
              private materialsService: MaterialsService,
              public batchesLotsService: BatchesLotsService) {
    this.recvdDate = new Date();
  }

  async ngOnInit() {
    //automapper issue cause materials to call separate.
    this.materialsService.getAll()
      .subscribe({
        next: res => {
          this.materials = res;

          this.receivingService.getRefsList()
            .subscribe({
              next: refs => {
                this.measurementUnits = refs.measurementUnits;
                this.isLoading = false;
              }
            });
        }
      });
  }

  onToReceive(event: any, item: ReceivingItem, itemLb: RecvdItemLotBatch, rIlbIndex: number) {
    const recvdValue = +event.target.value;
    if (recvdValue < 0)
      return;

    const recvdQty = item.recvdItemLotsBatches
      .filter(lb => lb !== itemLb)
      .reduce((acc, curr) => acc + curr.rlbQty, 0);

    if (recvdQty + recvdValue > item.orderedQty)
      event.target.value = 0;
    else
      itemLb.rlbQty = recvdValue;

    if (recvdValue > 0 && item.orderedQty > recvdQty + recvdValue
      && !item.recvdItemLotsBatches[rIlbIndex + 1]) {
      const rilb = new RecvdItemLotBatch();
      rilb.rilbReceivingItemId = item.receivingItemId;
      rilb.pricePerRlbQty = item.pricePerOrderedQty;
      rilb.rlbConversionRate = item.orderedConversionRate;
      rilb.batchLots = JSON.parse(JSON.stringify(itemLb.batchLots));
      item.recvdItemLotsBatches.push(rilb);
    }
  }

  onRemoveToReceived(item: ReceivingItem, indexItemLb: number) {
    item.recvdItemLotsBatches.splice(indexItemLb, 1);
  }

  addTag = (rilb: RecvdItemLotBatch, ri: ReceivingItem, value: string) => {
    rilb.isLoading = true;
    const bl = new BatchLot();
    bl.siteId = ri.riSiteId;
    bl.batchLotNumber = value;
    bl.materialId = ri.materialId;
    bl.blUomId = ri.orderedUomId;
    bl.expireDate = rilb.expireDate;

    this.batchesLotsService.create(bl)
      .subscribe(res => {
        for (const item of this.rfsService.receivingItems) {
          if (item.materialId === res.materialId) {
            for (const rilbItem of item.recvdItemLotsBatches) {
              rilbItem.batchLots.push(res);
              rilbItem.batchLots = JSON.parse(JSON.stringify(rilbItem.batchLots))
            }
          }
        }

        rilb.batchLotId = res.batchLotId;
        rilb.batchLotSiteId = ri.riSiteId;
        rilb.isLoading = false;
      });

    return {};
  }

  getBatchLotQty(batchLot: BatchLot, rilb: RecvdItemLotBatch) {
    return rilb.batchLots
      .find(bl => bl.batchLotId === batchLot.batchLotId &&
        bl.siteId === batchLot.siteId)
      ?.inventoryIntels
      .reduce((acc, curr) => acc + curr.qty, 0) ?? 0;
  }

  onReceiveDateChange(event: any) {
    for (let rilb of this.rfsService.receivingItems
      .flatMap(ri => ri.recvdItemLotsBatches)) {
      rilb.recvdBlockDate = event.target.value;
    }
  }
}
