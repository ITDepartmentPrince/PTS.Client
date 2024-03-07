import {Component, OnDestroy, OnInit} from '@angular/core';
import {AddSponsorReceivingService} from "../../../services/add-sponsor-receiving.service";
import {Material} from "../../../models/material";
import {MeasurementUnit} from "../../../models/measurement-unit";
import {ReceivingItem} from "../../../models/receivingItem";
import {MaterialsService} from "../../../services/materials.service";
import {FixNgSelectPlacement} from "../../../shared/fix-ng-select-placement";
import {ControlContainer, NgForm} from "@angular/forms";
import {SitesService} from "../../../services/sites.service";
import {Subscription, zip} from "rxjs";
import {MeasurementUnitsService} from "../../../services/measurement-units.service";

@Component({
  selector: 'add-sponsor-receiving-items-materials',
  templateUrl: './add-sponsor-receiving-items-materials.component.html',
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class AddSponsorReceivingItemsMaterialsComponent implements OnInit, OnDestroy {
  protected readonly FixNgSelectPlacement = FixNgSelectPlacement;
  isLoading = true;
  materials: Array<Material>;
  measurementUnits: Array<MeasurementUnit>;
  sub: Subscription;

  constructor(public asrService: AddSponsorReceivingService,
              private materialsService: MaterialsService,
              private siteService: SitesService,
              private muService: MeasurementUnitsService) {
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngOnInit(): void {
    zip(this.materialsService.getSponMatsByClas_Ven(
      this.asrService.receiving.classificationId,
      this.asrService.receiving.source.sponsorId),
      this.muService.getAll())
      .subscribe(res => {
        this.materials = res[0];
        this.measurementUnits = res[1];
        this.isLoading = false;
      });

    this.sub = this.asrService.itemsChange.subscribe(_ => {
      this.materialsService.getSponMatsByClas_Ven(
        this.asrService.receiving.classificationId,
        this.asrService.receiving.source.sponsorId)
        .subscribe(res => {
          this.materials = res;
          this.isLoading = false;
        });
    });
  }

  onAddItem() {
    const recItem = new ReceivingItem();
    recItem.riSiteId = this.siteService.localSite;
    this.asrService.receiving.receivingItems.push(recItem);
  }

  onRemoveItem(index: number) {
    this.asrService.receiving.receivingItems.splice(index, 1);
  }

  onMaterialChange(item: ReceivingItem) {
    const material = this.getMaterial(item.materialId);
    item.orderedUomId = material?.convertToUomId;
    item.orderedConversionRate = material?.conversionRate;
  }

  purchaseUomLu(unitId: number) {
    return this.getMeasurementUnit(unitId)?.longUnit;
  }

  baseUomLu(materialId: number | undefined) {
    return this.getMeasurementUnit(
      this.getMaterial(materialId as number)?.uomId as number)
      ?.longUnit;
  }

  private getMaterial(materialId: number) {
    return this.materials?.find(m => m.id === materialId);
  }

  private getMeasurementUnit(unitId: number) {
    return this.measurementUnits?.find(mu => mu.unitId === unitId)
  }
}
