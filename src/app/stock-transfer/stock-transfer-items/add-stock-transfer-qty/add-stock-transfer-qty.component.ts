import {Component, OnInit} from '@angular/core';
import {IBodyData} from "../../../shared/interface/IBodyData";
import {Operations} from "../../../shared/operations";
import {StockTransferItem} from "../../../models/stock-transfer-item";
import {BatchLot} from "../../../models/batchLot";
import {StockTransferItemQty} from "../../../models/stock-transfer-item-qty";
import {SitesService} from "../../../services/sites.service";
import {BatchesLotsService} from "../../../services/batches-lots.service";
import {ShelfStorage} from "../../../models/shelfStorage";
import {CheckShelfStorage} from "../../../models/check-shelf-storage";
import {ControlContainer, NgForm} from "@angular/forms";
import {FixNgSelectPlacement} from "../../../shared/fix-ng-select-placement";

@Component({
  selector: 'app-add-stock-transfer-qty',
  templateUrl: './add-stock-transfer-qty.component.html',
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class AddStockTransferQtyComponent implements IBodyData, OnInit {
  protected readonly FixNgSelectPlacement = FixNgSelectPlacement;
  bodyData: any;
  stockTransferItem: StockTransferItem;
  isLoading = true;
  operations = Operations;
  batchesLots: Array<BatchLot>;
  controlState: boolean;
  action: Operations;

  constructor(private sitesService: SitesService,
              private blService: BatchesLotsService) {
  }

  ngOnInit(): void {
    this.stockTransferItem = this.bodyData.data;
    this.action = this.bodyData.action;
    this.controlState = this.bodyData.controlState;

    this.blService.GetBatchesLotsByMaterialWithInventory_StockTransfer(this.sitesService.localSite,
      this.stockTransferItem.materialId)
      .subscribe(res => {
        if (this.action === Operations.Create) {
          this.batchesLots = res.filter(bl => {
            const qty = bl.inventoryIntels.reduce((a, c) => a + c.qty, 0) -
              bl.committed.reduce((a, c) => a + c.qty, 0);
            return qty !== 0;
          });
        }
        else {
          this.batchesLots = res;

          for (const stItemQty of this.stockTransferItem.stockTransferItemQtys) {
            stItemQty.shelfStorages = (this.batchesLots.find(bl => bl.batchLotId === stItemQty.batchLotId
              && bl.siteId === stItemQty.batchLotSiteId)?.shelfStorage as Array<ShelfStorage>);
          }
        }

        this.isLoading = false;
      });
  }

  onAddItem() {
    const stItemQty = new StockTransferItemQty();
    stItemQty.batchLotSiteId = this.sitesService.localSite;
    this.stockTransferItem.stockTransferItemQtys.push(stItemQty);
  }

  onRemoveItem(index: number) {
    this.stockTransferItem.stockTransferItemQtys.splice(index, 1);
    this.onBlDdClose();
  }

  onBlChange(stItemQty: StockTransferItemQty) {
    const batchLot = this.batchesLots.find(bl => bl.batchLotId === stItemQty.batchLotId
      && bl.siteId === stItemQty.batchLotSiteId);

    const comShelves = batchLot?.committed
      .flatMap(c => c.stockTransfer.stockTransferItems
        .flatMap(sti => sti.stockTransferItemQtys
          .flatMap(stIq => stIq.checkShelfStorage)));

    stItemQty.checkShelfStorage = [];
    stItemQty.shelfStorages = (batchLot?.shelfStorage as Array<ShelfStorage>)
      .map(ss => {
        const newSs = {...ss, disabled: true};
        const comShelf = comShelves?.filter(cs => cs.shelfStorageId === ss.id);
        if (comShelf && this.action !== Operations.Edit)
          newSs.qty -= comShelf.reduce((a, c) => a + c.qty, 0);

        if (newSs.qty > 0 || this.action === Operations.Edit) {
          const checkSs = new CheckShelfStorage();
          checkSs.shelfStorageId = newSs.id;
          checkSs.shelfQty = newSs.qty;
          stItemQty.checkShelfStorage.push(checkSs);
        }

        return newSs;
      });
  }

  onBlDdClose() {
    if (!this.batchesLots)
      return;

    this.batchesLots = this.batchesLots.map(bl => {
      if (this.stockTransferItem.stockTransferItemQtys
        .some(stItemQty => stItemQty.batchLotId === bl.batchLotId
          && stItemQty.batchLotSiteId === bl.siteId)) {
        return {...bl, disabled: true};
      }
      return {...bl, disabled: false};
    });
  }

  onRemoveCheckSs(stItemQty: StockTransferItemQty, index: number) {
    stItemQty.checkShelfStorage.splice(index, 1);
    this.onShelfDdClose(stItemQty);
  }

  onShelfChange(checkSs: CheckShelfStorage) {
    checkSs.shelfQty = this.batchesLots
      .flatMap(bl => bl.shelfStorage)
      .find(ss => ss.id === checkSs.shelfStorageId)
      ?.qty as number;
  }

  onShelfDdClose(stItemQty: StockTransferItemQty) {
    stItemQty.shelfStorages = stItemQty.shelfStorages.map(ss => {
      if (stItemQty.checkShelfStorage.some(css => css.shelfStorageId === ss.id))
        return {...ss, disabled: true};
      else
        return {...ss, disabled: false};
    });
  }

  blQtyTotal(batchLot: BatchLot) {
    return (batchLot.inventoryIntels.reduce((a, c) => a + c.qty, 0) -
      batchLot.committed.reduce((a, c) => a + c.qty, 0)).toLocaleString();
  }

  transferQtyTotal() {
    return this.stockTransferItem.stockTransferItemQtys
      .reduce((a, c) => a + c.checkShelfStorage
        .reduce((a, c) => a + c.qty, 0), 0).toLocaleString();
  }
}
