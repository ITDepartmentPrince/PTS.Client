import {Component, OnInit} from '@angular/core';
import {ReceivingForSiteService} from "../../services/receiving-for-site.service";
import {Material} from "../../models/material";
import {MaterialsService} from "../../services/materials.service";
import {MeasurementUnit} from "../../models/measurement-unit";
import {BatchLot} from "../../models/batchLot";
import {ReceivingItem} from "../../models/receivingItem";
import {RecvdItemLotBatch} from "../../models/recvdItemLotBatch";
import {ControlContainer, NgForm} from "@angular/forms";
import {BatchesLotsService} from "../../services/batches-lots.service";
import {zip} from "rxjs";
import {MeasurementUnitsService} from "../../services/measurement-units.service";
import {SitesService} from "../../services/sites.service";

@Component({
  selector: 'app-receive-items-lots-batches',
  templateUrl: './receive-items-lots-batches.component.html',
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class ReceiveItemsLotsBatchesComponent implements OnInit {
  isLoading = true;
  recvdDate: any;
  materials: Array<Material>;
  measurementUnits: Array<MeasurementUnit>;

  constructor(public rfsService: ReceivingForSiteService,
              private materialsService: MaterialsService,
              public batchesLotsService: BatchesLotsService,
              private muService: MeasurementUnitsService,
              private sitesService: SitesService) {
    this.recvdDate = new Date();
  }

  async ngOnInit() {
    zip(this.materialsService.getAll(),
        this.muService.getAll())
        .subscribe(res => {
          this.materials = res[0];
          this.measurementUnits = res[1];

          this.isLoading = false;
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
    bl.siteId = this.sitesService.localSite;
    bl.batchLotNumber = value;
    bl.materialId = ri.materialId;
    bl.blUomId = ri.orderedUomId;
    bl.expireDate = rilb.expireDate;

    this.batchesLotsService.create(bl, this.sitesService.localSite)
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
      .reduce((acc, curr) => acc + curr.qty, 0).toLocaleString() ?? 0;
  }

  onReceiveDateChange(event: any) {
    for (let rilb of this.rfsService.receivingItems
      .flatMap(ri => ri.recvdItemLotsBatches)) {
      rilb.recvdBlockDate = event.target.value;
    }
  }

  getLongUnit(unitId?: number) {
    return this.measurementUnits
      .find(mu => mu.unitId === unitId)
      ?.longUnit
      ?.toLowerCase();
  }
}
