import {Component, OnDestroy} from '@angular/core';
import {AddSponsorReceivingService} from "../../../services/add-sponsor-receiving.service";
import {Material} from "../../../models/material";
import {MeasurementUnit} from "../../../models/measurement-unit";
import {ReceivingItem} from "../../../models/receivingItem";
import {ReceivingService} from "../../../services/receiving.service";
import {MaterialsService} from "../../../services/materials.service";
import {FixNgSelectPlacement} from "../../../shared/fix-ng-select-placement";
import {ControlContainer, NgForm} from "@angular/forms";
import {SiteService} from "../../../services/site-service";
import {Subscription} from "rxjs";

@Component({
  selector: 'add-sponsor-receiving-items-materials',
  templateUrl: './add-sponsor-receiving-items-materials.component.html',
  viewProviders: [{provide: ControlContainer, useExisting: NgForm}]
})
export class AddSponsorReceivingItemsMaterialsComponent implements OnDestroy {
  protected readonly FixNgSelectPlacement = FixNgSelectPlacement;
  isLoading = true;
  materials: Array<Material>;
  measurementUnits: Array<MeasurementUnit>;
  sub: Subscription;

  constructor(public asrService: AddSponsorReceivingService,
              private receivingService: ReceivingService,
              private materialsService: MaterialsService,
              private siteService: SiteService) {
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  ngOnInit(): void {
    //automapper issue cause materials to call separate.
    this.materialsService.getAllByClassificationId(
        this.asrService.receiving.classificationId)
      .subscribe({
        next: res => {
          this.materials = res;

          this.receivingService.getRefsList()
            .subscribe({
              next: refs => {
                this.measurementUnits = refs.measurementUnits;
                this.isLoading = false;
              }
            });
        },
        error: _ => {
          this.isLoading = false;
        }
      });

    this.sub = this.asrService.itemsChange.subscribe(_ => {
      this.materialsService.getAllByClassificationId(
          this.asrService.receiving.classificationId)
        .subscribe(materials => {
          this.materials = materials;
          this.isLoading = false;
        });
    });
  }

  onAddItem() {
    const recItem = new ReceivingItem();
    recItem.riSiteId = this.siteService.site;
    this.asrService.receiving.receivingItems.push(recItem);
  }

  onRemoveItem(item: ReceivingItem) {
    this.asrService.receiving.receivingItems
      .splice(this.asrService.receiving.receivingItems.indexOf(item), 1);
  }

  onMaterialChange(item: ReceivingItem) {
    const material = this.getMaterial(item.materialId as number);
    item.orderedUomId = material?.defaultUomUnitId as number;
    item.orderedConversionRate = material?.conversionRate as number;
  }

  private getMaterial(materialId: number) {
    return this.materials?.find(m => m.materialId === materialId);
  }
}
