import {Component, Input, OnInit} from '@angular/core';
import {ReceivingForSiteService} from "../../services/receiving-for-site.service";
import {Material} from "../../models/material";
import {MeasurementUnit} from "../../models/measurement-unit";
import {TaxRate} from "../../models/tax-rate";
import {MaterialsService} from "../../services/materials.service";
import {ReceivingService} from "../../services/receiving.service";
import {ReceivingItem} from "../../models/receivingItem";

@Component({
  selector: 'app-receiving-items',
  templateUrl: './receiving-items.component.html'
})
export class ReceivingItemsComponent implements OnInit {
  @Input() receivingItems: Array<ReceivingItem>;
  @Input() ShowBatchesLots = false;
  materials: Array<Material>;
  measurementUnits: Array<MeasurementUnit>;
  taxRates: Array<TaxRate>;
  isLoading = true;

  constructor(public rfsService: ReceivingForSiteService,
              private receivingService: ReceivingService,
              private materialsService: MaterialsService) {
  }

  ngOnInit(): void {
    //automapper issue cause materials to call separate.
    this.materialsService.getAll()
      .subscribe({
        next: res => {
          this.materials = res;

          this.receivingService.getRefsList()
            .subscribe({
              next: refs => {
                this.measurementUnits = refs.measurementUnits;
                this.taxRates = refs.taxRates;

                this.isLoading = false;
              }
            });
        }
      });
  }
}
