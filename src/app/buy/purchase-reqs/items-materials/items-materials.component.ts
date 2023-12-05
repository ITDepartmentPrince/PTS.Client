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
import {Subscription, zip} from "rxjs";

@Component({
  selector: 'app-items-materials',
  templateUrl: './items-materials.component.html',
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class ItemsMaterialsComponent implements OnInit, OnDestroy {
  @Input() controlState: boolean;
  @Input() action: Operations;
  isLoading = true;
  sub: Subscription;
  operations = Operations;
  materials: Material[];
  measurementUnits: MeasurementUnit[];

  constructor(public prService: PurchaseReqsService,
              private matService: MaterialsService,
              private muService: MeasurementUnitsService,
              private trService: TaxRateService) {
  }

  ngOnInit(): void {
    zip(this.matService.getAllByClassificationIdAndVendorId(
        this.prService.purchaseReq.classificationId,
        this.prService.purchaseReq.vendorId),
      this.muService.getAll(),
      this.trService.getAll())
      .subscribe(res => {
        this.materials = res[0];
        this.measurementUnits = res[1];
        this.prService.taxRates = res[2];

        this.isLoading = false;
      });

    this.sub = this.prService.changeItems
      .subscribe(_ => {
        this.isLoading = true;
        this.prService.purchaseReq.purchaseReqItems = [];

        this.matService
          .getAllByClassificationIdAndVendorId(this.prService.purchaseReq.classificationId,
            this.prService.purchaseReq.vendorId)
          .subscribe(res => {
            this.materials = res

            this.isLoading = false;
          });
      });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onAddItem() {
    this.prService.purchaseReq.purchaseReqItems.push(new PurchaseReqItem());
  }

  onRemoveItem(index: number) {
    this.prService.purchaseReq.purchaseReqItems.splice(index, 1);
  }

  onMaterialChange(item: PurchaseReqItem) {
    const material = this.getMaterial(item.materialId as number);
    item.purchaseUomId = material?.convertToUomId as number;
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
    return this.materials?.find(m => m.id === materialId);
  }

  private getMeasurementUnit(unitId: number) {
    return this.measurementUnits?.find(mu => mu.unitId === unitId)
  }
}
