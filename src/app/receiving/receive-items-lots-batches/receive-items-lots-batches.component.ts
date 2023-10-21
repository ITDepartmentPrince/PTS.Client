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
  recvdDate: Date;
  materials: Array<Material>;
  measurementUnits: Array<MeasurementUnit>;
  batchLots: Array<BatchLot>;

  constructor(public rfsService: ReceivingForSiteService,
              private receivingService: ReceivingService,
              private materialsService: MaterialsService,
              public batchesLotsService: BatchesLotsService) {
    this.recvdDate = new Date();

    for (const item of this.rfsService.receiving.receivingItems)
      item.recvdItemLotsBatches
        .push(new RecvdItemLotBatch());
  }

  ngOnInit(): void {
    //automapper issue cause materials to call separate.
    this.materialsService.getAll()
      .subscribe({
        next: res => {
          this.materials = res;

          this.receivingService.getRefsList()
            .subscribe({
              next: refs => {
                this.measurementUnits = refs.measurementUnits;
                this.batchLots = refs.batchesLots;

                if (!this.batchLots)
                  this.batchLots = new Array<BatchLot>();

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
      && !item.recvdItemLotsBatches[rIlbIndex + 1])
      item.recvdItemLotsBatches.push(new RecvdItemLotBatch());
  }

  onRemoveToReceived(item: ReceivingItem, indexItemLb: number) {
    item.recvdItemLotsBatches.splice(indexItemLb, 1);
  }

  updateRestRecvdIlbFields(itemLb: RecvdItemLotBatch, item: ReceivingItem) {
    itemLb.rilbReceivingItemId = item.receivingItemId;
    itemLb.pricePerRlbQty = item.pricePerOrderedQty;
    itemLb.recvdBlockDate = this.recvdDate;
    return '';
  }

  addTag(rilb: RecvdItemLotBatch, ri: ReceivingItem,
         batchesLotsService: BatchesLotsService, value: string) {
    const bl = new BatchLot();
    bl.siteId = ri.riSiteId;
    bl.batchLotNumber = value;
    bl.materialId = ri.materialId;
    bl.blUomId = ri.orderedUomId;
    bl.expireDate = rilb.expireDate;

    batchesLotsService.create(bl)
      .subscribe({
        next: res => {
          console.log(res);
          (<any>this).push(res);
        },
        error: error => {
          console.log(error);
        }
      });

    return {
      ...bl,
      valid: true
    };
  }

  getBatchLotQty(itemLb: RecvdItemLotBatch) {
    return itemLb.batchLot
      ?.inventoryIntels
      .reduce((acc, curr) => acc + curr.qty, 0) ?? 0;
  }
}
