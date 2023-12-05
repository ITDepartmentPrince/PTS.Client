import {Component, Input, OnInit} from '@angular/core';
import {ReceivingForSiteService} from "../../services/receiving-for-site.service";
import {Material} from "../../models/material";
import {MeasurementUnit} from "../../models/measurement-unit";
import {TaxRate} from "../../models/tax-rate";
import {MaterialsService} from "../../services/materials.service";
import {ReceivingItem} from "../../models/receivingItem";
import {zip} from "rxjs";
import {MeasurementUnitsService} from "../../services/measurement-units.service";
import {TaxRateService} from "../../services/tax-rates.service";

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
              private materialsService: MaterialsService,
              private muService: MeasurementUnitsService,
              private trService: TaxRateService) {
  }

  ngOnInit(): void {
    zip(this.materialsService.getAll(),
      this.muService.getAll(),
      this.trService.getAll())
      .subscribe(res => {
        this.materials = res[0];
        this.measurementUnits = res[1];
        this.taxRates = res[2];

        this.isLoading = false;
      });
  }
}
