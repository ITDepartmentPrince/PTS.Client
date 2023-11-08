import {Component, OnInit} from '@angular/core';
import {ShelfStorageService} from "../../services/shelf-storage.service";
import {BatchLot} from "../../models/batchLot";
import {Material} from "../../models/material";
import {BatchesLotsService} from "../../services/batches-lots.service";
import {MaterialsService} from "../../services/materials.service";
import {SitesService} from "../../services/sites.service";
import {ShelfStorage} from "../../models/shelfStorage";
import {MeasurementUnit} from "../../models/measurement-unit";
import {ControlContainer, NgForm} from "@angular/forms";
import {MeasurementUnitsService} from "../../services/measurement-units.service";
import {InventoryIntel} from "../../models/inventoryIntel";
import {ItemType} from "../../shared/item-type";

@Component({
  selector: 'app-add-view-shelf',
  templateUrl: './add-view-shelf.component.html',
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]

})
export class AddViewShelfComponent implements OnInit {
  isLoading = true;
  batchLots: Array<BatchLot>;
  materials: Array<Material>;
  units: Array<MeasurementUnit>;

  constructor(public ssService: ShelfStorageService,
              private blService: BatchesLotsService,
              private siteService: SitesService,
              private materialsService: MaterialsService,
              private muService: MeasurementUnitsService) {
  }

  ngOnInit(): void {
    this.ssService.getMaterialsShelved()
      .subscribe(res => {
        this.ssService.shelfStorage = res;
        this.isLoading = false;
      });

    this.blService.getUnStoredMaterials(this.siteService.localSite)
      .subscribe(res => this.batchLots = res);

    this.materialsService.getAll()
      .subscribe(res => this.materials = res);

    this.muService.getAll()
      .subscribe(res => this.units = res);
  }

  onAddItem() {
    this.ssService.toAddShelfStorage.push(new ShelfStorage());
  }

  onRemoveItem(index: number) {
    this.ssService.toAddShelfStorage.splice(index, 1);
  }

  onBlNumberChange(ss: ShelfStorage) {
    const bl = this.batchLots.find(bl => bl.batchLotId === ss.batchLotId);
    ss.batchLotSiteId = this.siteService.localSite;
    ss.shelfCode = this.ssService.shelfCode;
    ss.materialId = <number>bl?.materialId;
    ss.unitId = <number>bl?.blUomId;
    ss.expireDate = <Date>bl?.expireDate;
    ss.blQty = this.getIiQty(bl?.inventoryIntels as Array<InventoryIntel>) -
      this.getSsQty(bl?.shelfStorage as Array<ShelfStorage>);
  }

  getIiQty(inventoryIntels: Array<InventoryIntel>) {
    return inventoryIntels.reduce((acc, curr) => acc + curr.qty, 0);
  }

  getSsQty(shelfStorage: Array<ShelfStorage>) {
    return shelfStorage.reduce((acc, curr) => acc + curr.qty, 0);
  }

  onToShelf(event: any, item: ShelfStorage) {
    const recvdValue = +event.target.value;
    if (recvdValue < 0 || recvdValue > item.blQty)
      return;

    item.qty = recvdValue;
  }
}
