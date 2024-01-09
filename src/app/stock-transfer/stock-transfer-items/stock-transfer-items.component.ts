import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {ControlContainer, NgForm} from "@angular/forms";
import {Operations} from "../../shared/operations";
import {zip} from "rxjs";
import {MaterialsService} from "../../services/materials.service";
import {Material} from "../../models/material";
import {StockTransferItem} from "../../models/stock-transfer-item";
import {SitesService} from "../../services/sites.service";
import {StockTransferService} from "../../services/stock-transfer-service";
import {BatchesLotsService} from "../../services/batches-lots.service";
import {ModalDirective} from "../../shared/modal/modal.directive";
import {ModalService} from "../../shared/modal/modal.service";
import {AddStockTransferQtyComponent} from "./add-stock-transfer-qty/add-stock-transfer-qty.component";
import {AddStQtyScanComponent} from "./add-st-qty-scan/add-st-qty-scan.component";
import {Vendor} from "../../models/vendor";
import {VendorsService} from "../../services/vendors.service";
import {ItemLabelService} from "../../services/item-label.service";
import {CheckShelfStorage} from "../../models/check-shelf-storage";
import {StockTransferItemQty} from "../../models/stock-transfer-item-qty";

@Component({
  selector: 'app-stock-transfer-items',
  templateUrl: './stock-transfer-items.component.html',
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class StockTransferItemsComponent implements OnInit {
  @Input() controlState: boolean;
  @Input() action: Operations;
  @ViewChild(ModalDirective) modal: ModalDirective;
  operations = Operations;
  materials: Array<Material>;
  // isLoading = true;
  vendors: Array<Vendor>;

  constructor(public stService: StockTransferService,
              private materialsService: MaterialsService,
              private vendorsService: VendorsService,
              private blService: BatchesLotsService,
              private sitesService: SitesService,
              private modalService: ModalService,
              private itemLabelService: ItemLabelService) {
  }

  ngOnInit(): void {
    zip(this.materialsService.getAll()
      ,this.vendorsService.getAll())
      .subscribe(res => {
        this.materials = res[0];
        this.vendors = res[1];

        if (this.action !== Operations.Create)
          for (const stItem of this.stService.stockTransfer.stockTransferItems)
            this.onVendorChange(stItem);
      });

    this.stService.changeItems
      .subscribe(_ => {
        if (this.action !== Operations.Create) {
          for (const stItem of this.stService.stockTransfer.stockTransferItems) {
            this.blService.GetBatchesLotsByMaterialWithInventory_StockTransfer(
              this.sitesService.localSite,
              stItem.materialId)
              .subscribe(res => {
                stItem.totalOriginQty = (res.flatMap(r => r.inventoryIntels)
                  .reduce((acc, curr) => acc + curr.qty, 0) - res.flatMap(r => r.committed)
                  .reduce((acc, curr) => acc + curr.qty, 0)).toLocaleString();
              });

            stItem.destQty = stItem.stockTransferItemQtys
              .reduce((a, c) => a + c.checkShelfStorage.reduce((a, c) => a + c.qty, 0), 0)
              .toLocaleString();

            if (parseInt(stItem.destQty.split(',').join('')) > 0)
              this.stService.stockTransfer.itemsValid = true;
          }
        }
      });
  }

  onAddItem() {
    const stItem = new StockTransferItem();
    stItem.stSiteId = this.sitesService.localSite;
    this.stService.stockTransfer.stockTransferItems.push(stItem);
  }

  onRemoveItem(index: number) {
    this.stService.stockTransfer.stockTransferItems.splice(index, 1);

    if (this.stService.stockTransfer.stockTransferItems.length === 0)
      this.stService.stockTransfer.itemsValid = false;

    // this.onMaterialsDdClose();
  }

  onMaterialChange(stItem: StockTransferItem) {
    if (!stItem.materialId)
      return;

    this.blService.GetBatchesLotsByMaterialWithInventory_StockTransfer(
      this.sitesService.localSite,
      stItem.materialId)
      .subscribe(res => {
        stItem.totalOriginQty = (res.flatMap(r => r.inventoryIntels)
          .reduce((acc, curr) => acc + curr.qty, 0) - res.flatMap(r => r.committed)
          .reduce((acc, curr) => acc + curr.qty, 0)).toLocaleString();
      });

    stItem.stockTransferItemQtys = [];
    stItem.destQty = '---';
  }

  getMaterialBaseLU(materialId: number) {
    return this.getMaterial(materialId)
      ?.uom
      ?.longUnit
      ?.toLowerCase() ?? '';
  }

  /*onMaterialsDdClose() {
    if (!this.materials)
      return;

    this.materials = this.materials.map(m => {
      if (this.stService.stockTransfer.stockTransferItems
        .some(stItem => stItem.materialId === m.id)) {
        return {...m, disabled: true};
      }
      return {...m, disabled: false};
    });
  }*/

  private getMaterial(materialId: number) {
    return this.materials?.find(m => m.id === materialId);
  }

  OnAddQty(stItem: StockTransferItem) {
    const orgQty = parseInt(stItem.totalOriginQty.split(',').join(''));
    if (this.action === Operations.Create &&
      (orgQty < 1 || isNaN(orgQty)))
      return;

    this.modalService.show(this.modal.viewContainerRef, {
        title: this.materials.find(m => m.id === stItem.materialId)?.catalogDescription,
        modalSize: 'modal-xl',
        btnSuccess: this.action !== Operations.View,
        btnSuccessLabel: 'Save',
        successCallback: (_, data) => {
          stItem.stockTransferItemQtys = data.data.stockTransferItemQtys;

          stItem.destQty = stItem.stockTransferItemQtys
            .reduce((a, c) => a + c.checkShelfStorage.reduce((a, c) => a + c.qty, 0), 0)
            .toLocaleString();

          if (parseInt(stItem.destQty.split(',').join('')) > 0)
            this.stService.stockTransfer.itemsValid = true;
        }
      },
      AddStockTransferQtyComponent, {
        data: JSON.parse(JSON.stringify(stItem)),
        action: this.action,
        controlState: this.controlState
    });
  }

  onAddByScan() {
    this.modalService.show(this.modal.viewContainerRef, {
      modalSize: 'modal-xl',
      title: 'Add items to transfer',
      btnSuccessLabel: 'Add',
      successCallback: _ => {
        if (this.itemLabelService.itemLabels.length === 0)
          return;

        const stItems = new Array<StockTransferItem>();
        const stItemQtys = new Array<StockTransferItemQty>();

        for (const itemLabel of this.itemLabelService.itemLabels) {
          let itemQty = stItemQtys.find(e => e.batchLotId === itemLabel.batchLotId &&
            e.batchLotSiteId === itemLabel.batchLotSiteId);
          if (!itemQty) {
            const itemQty = new StockTransferItemQty();
            itemQty.batchLotId = itemLabel.batchLotId;
            itemQty.batchLotSiteId = itemLabel.batchLotSiteId;
            stItemQtys.push(itemQty);
          }

          let item = stItems.find(e => e.materialId === itemLabel.batchLot.materialId);
          if (!item) {
            item = new StockTransferItem();
            item.stSiteId = itemLabel.batchLotSiteId;
            item.materialId = itemLabel.batchLot.materialId;
            item.vendorId = itemLabel.batchLot.material.vendorId;
            this.onVendorChange(item);
            this.blService.GetBatchesLotsByMaterialWithInventory_StockTransfer(
              this.sitesService.localSite,
              item.materialId)
              .subscribe(res => {
                (item as StockTransferItem).totalOriginQty = (res.flatMap(r => r.inventoryIntels)
                  .reduce((acc, curr) => acc + curr.qty, 0) - res.flatMap(r => r.committed)
                  .reduce((acc, curr) => acc + curr.qty, 0)).toLocaleString();

                (item as StockTransferItem).destQty = (item as StockTransferItem).stockTransferItemQtys
                  .reduce((a, c) => a + c.checkShelfStorage.reduce((a, c) => a + c.qty, 0), 0)
                  .toLocaleString();

                if (parseInt((item as StockTransferItem).destQty.split(',').join('')) > 0)
                  this.stService.stockTransfer.itemsValid = true;
              });
            stItems.push(item);
          }
        }

        for (const itemLabel of this.itemLabelService.itemLabels) {
          const checkShelfStorage = new CheckShelfStorage();
          checkShelfStorage.qty = itemLabel.toTransferQty;
          checkShelfStorage.itemLabelId = itemLabel.id;

          const itemQty = stItemQtys.find(e => e.batchLotId === itemLabel.batchLotId &&
            e.batchLotSiteId === itemLabel.batchLotSiteId);
          itemQty?.checkShelfStorage.push(checkShelfStorage);

          const item = stItems.find(e => e.materialId === itemLabel.batchLot.materialId);
          if (!(item?.stockTransferItemQtys
            .find(e => e.batchLotId === itemQty?.batchLotId &&
              e.batchLotSiteId === itemQty?.batchLotSiteId)))
            item?.stockTransferItemQtys.push(itemQty as StockTransferItemQty);
        }

        this.stService.stockTransfer.stockTransferItems.push(...stItems);
        this.itemLabelService.itemLabels = [];
      }
    }, AddStQtyScanComponent);
  }

  onVendorChange(item: StockTransferItem) {
    item.vendorMaterials = this.materials.filter(e => e.vendorId === item.vendorId);
  }
}
