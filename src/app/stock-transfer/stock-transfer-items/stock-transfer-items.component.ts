import {Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ControlContainer, NgForm} from "@angular/forms";
import {Operations} from "../../shared/operations";
import {Subscription} from "rxjs";
import {MaterialsService} from "../../services/materials.service";
import {Material} from "../../models/material";
import {StockTransferItem} from "../../models/stock-transfer-item";
import {SitesService} from "../../services/sites.service";
import {StockTransferService} from "../../services/stock-transfer-service";
import {BatchesLotsService} from "../../services/batches-lots.service";
import {ModalDirective} from "../../shared/modal/modal.directive";
import {ModalService} from "../../shared/modal/modal.service";
import {AddStockTransferQtyComponent} from "./add-stock-transfer-qty/add-stock-transfer-qty.component";

@Component({
  selector: 'app-stock-transfer-items',
  templateUrl: './stock-transfer-items.component.html',
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class StockTransferItemsComponent implements OnInit, OnDestroy {
  @Input() controlState: boolean;
  @Input() action: Operations;
  @ViewChild(ModalDirective) modal: ModalDirective;
  operations = Operations;
  sub: Subscription;
  materials: Array<Material>;
  isLoading: boolean;

  constructor(public stService: StockTransferService,
              private materialsService: MaterialsService,
              private blService: BatchesLotsService,
              private sitesService: SitesService,
              private modalService: ModalService) {
  }

  ngOnInit(): void {
    this.sub = this.stService.changeItems
      .subscribe(_ => {
        if (!this.stService.stockTransfer.classificationId
          || !this.stService.stockTransfer.vendorId) {
          this.materials = [];
          return;
        }

        this.isLoading = true;
        this.materialsService
          .getAllByClassificationIdAndVendorId(
            this.stService.stockTransfer.classificationId,
            this.stService.stockTransfer.vendorId)
          .subscribe(materials => {
            this.materials = materials;
            this.isLoading = false;
          });

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

  ngOnDestroy(): void {
    this.sub.unsubscribe();
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

    this.onMaterialsDdClose();
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
      ?.convertToUom
      ?.longUnit
      ?.toLowerCase() ?? '';
  }

  onMaterialsDdClose() {
    if (!this.materials)
      return;

    this.materials = this.materials.map(m => {
      if (this.stService.stockTransfer.stockTransferItems
        .some(stItem => stItem.materialId === m.id)) {
        return {...m, disabled: true};
      }
      return {...m, disabled: false};
    });
  }

  private getMaterial(materialId: number) {
    return this.materials?.find(m => m.id === materialId);
  }

  OnAddQty(stItem: StockTransferItem) {
    if (parseInt(stItem.totalOriginQty.split(',').join('')) < 1)
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
}
