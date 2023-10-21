import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {PurchaseReqItem} from "../../../models/purchase-req-item";
import {Material} from "../../../models/material";
import {MaterialsService} from "../../../services/materials.service";
import {MeasurementUnitsService} from "../../../services/measurement-units.service";
import {MeasurementUnit} from "../../../models/measurement-unit";
import {ControlContainer, NgForm} from "@angular/forms";
import {Operations} from "../../../shared/operations";
import {TaxRateService} from "../../../services/tax-rates.service";
import {PurchaseReqsService} from "../../../services/purchase-reqs.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-items-materials',
  templateUrl: './items-materials.component.html',
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class ItemsMaterialsComponent implements OnInit, OnDestroy {
  @Input() controlState: boolean;
  @Input() action: Operations;
  sub: Subscription;
  items: PurchaseReqItem[];
  operations = Operations;
  materials: Material[];
  measurementUnits: MeasurementUnit[];

  constructor(public prService: PurchaseReqsService,
              private materialsService: MaterialsService,
              private measurementUnitsService: MeasurementUnitsService,
              private taxRateService: TaxRateService) {
    this.items = this.prService.purchaseReq.purchaseReqItems;
  }

  ngOnInit(): void {
    this.materialsService
      .getAllByClassificationIdAndVendorId(this.prService.purchaseReq.classificationId,
        this.prService.purchaseReq.vendorId)
      .subscribe(materials => this.materials = materials);

    this.measurementUnitsService.getAll()
      .subscribe(measurementUnits => this.measurementUnits = measurementUnits);

    this.taxRateService.getAll()
      .subscribe(taxRates => {
        this.prService.taxRates = taxRates;
      });

    this.sub = this.prService.changeItems
      .subscribe(_ => {
        this.items = [];
        this.items = this.prService.purchaseReq.purchaseReqItems;

        this.materialsService
          .getAllByClassificationIdAndVendorId(this.prService.purchaseReq.classificationId,
            this.prService.purchaseReq.vendorId)
          .subscribe(materials => this.materials = materials);
      });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onAddItem() {
    this.items.push(new PurchaseReqItem());
  }

  onRemoveItem(item: PurchaseReqItem) {
    this.items.splice(this.items.indexOf(item), 1);
  }

  onMaterialChange(item: PurchaseReqItem) {
    const material = this.getMaterial(item.materialId as number);
    item.purchaseUomId = material?.defaultUomUnitId as number;
    item.conversionRate = material?.conversionRate as number;
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
    return this.materials?.find(m => m.materialId === materialId);
  }

  private getMeasurementUnit(unitId: number) {
    return this.measurementUnits?.find(mu => mu.unitId === unitId)
  }
}
