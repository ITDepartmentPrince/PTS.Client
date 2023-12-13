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
import {zip} from "rxjs";
import {ActivatedRoute} from "@angular/router";

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
  refersTo = 1;

  constructor(public ssService: ShelfStorageService,
              private route: ActivatedRoute,
              private blService: BatchesLotsService,
              private siteService: SitesService,
              private materialsService: MaterialsService,
              private muService: MeasurementUnitsService) {
    if (this.route.snapshot.url[0].path === 'sponsor-materials')
      this.refersTo = 2;
  }

  ngOnInit(): void {
    this.ssService.toAddShelfStorage = [];

    zip(this.ssService.getMaterialsShelved(),
      this.blService.GetBatchesLotsForUnStoredMaterials(this.siteService.localSite, this.refersTo),
      this.materialsService.getAll(),
      this.muService.getAll())
      .subscribe(res => {
        this.ssService.shelfStorage = res[0];
        this.batchLots = res[1];
        this.materials = res[2];
        this.units = res[3];

        this.isLoading = false;
      });
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
    ss.expireDate = bl?.expireDate;
    ss.blQty = this.getIiQty(bl?.inventoryIntels as Array<InventoryIntel>) -
      this.getSsQty(bl?.shelfStorage as Array<ShelfStorage>);
  }

  getIiQty(inventoryIntels: Array<InventoryIntel>) {
    return inventoryIntels?.reduce((acc, curr) => acc + curr.qty, 0) ?? 0;
  }

  getSsQty(shelfStorage: Array<ShelfStorage>) {
    return shelfStorage?.reduce((acc, curr) => acc + curr.qty, 0) ?? 0;
  }

  onToShelf(event: any, item: ShelfStorage) {
    const recvdValue = +event.target.value;
    if (recvdValue < 0 || recvdValue > item.blQty)
      return;

    item.qty = recvdValue;
  }

  displayMaterial(id: number) {
    return this.getMaterial(id)?.catalogDescription;
  }

  getLongUnit(unitId: number) {
    return this.units
      .find(mu => mu.unitId === unitId)
      ?.longUnit
      ?.toLowerCase();
  }

  getMaterial(id: number) {
    return this.materials.find(m => m.id === id);
  }

  getBatchLot(id: number) {
    return this.batchLots.find(bl => bl.batchLotId === id);
  }
}
