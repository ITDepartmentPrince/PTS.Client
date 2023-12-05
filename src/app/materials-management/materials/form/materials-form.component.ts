import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {Router} from "@angular/router";
import {AuthPolicy} from "../../../auth/auth-policy";
import {MeasurementUnitsService} from "../../../services/measurement-units.service";
import {MatlClassificationsService} from "../../../services/matl-classifications.service";
import {MatlCategoriesService} from "../../../services/matl-categories.service";
import {SizeVariantService} from "../../../services/size-variant.service";
import {VendorsService} from "../../../services/vendors.service";
import {zip} from "rxjs";
import {MaterialsService} from "../../../services/materials.service";
import {MeasurementUnit} from "../../../models/measurement-unit";
import {MatlClassification} from "../../../models/matl-classification";
import {SizeVariant} from "../../../models/size-variant";
import {Vendor} from "../../../models/vendor";
import {MatlCategory} from "../../../models/matl-category";
import {enumToArray} from "../../../shared/enumToArray";
import {RefersTo} from "../../../models/material";

@Component({
  selector: 'app-materials-form',
  templateUrl: './materials-form.component.html'
})
export class MaterialsFormComponent implements OnInit {
  operations = Operations;
  controlState: boolean;
  @Input() isLoading = true;
  @Input() action: Operations;
  @Output() submitted = new EventEmitter<void>();
  protected readonly AuthPolicy = AuthPolicy;
  measurementUnits: Array<MeasurementUnit>;
  classifications: Array<MatlClassification>;
  matlCategories: Array<MatlCategory>;
  sizeVariants: Array<SizeVariant>;
  vendors: Array<Vendor>;
  refersToList: Array<{ name: string; id: number }>;

  constructor(public router: Router,
              public matService: MaterialsService,
              private msrUnitService: MeasurementUnitsService,
              private matClasService: MatlClassificationsService,
              private matCatService: MatlCategoriesService,
              private sizeService: SizeVariantService,
              private vendorService: VendorsService) {
  }

  ngOnInit(): void {
    this.controlState =
      this.action === this.operations.View ||
      this.action === this.operations.Delete;

    zip(this.msrUnitService.getAll(),
      this.matClasService.getAll(),
      this.matCatService.getAll(),
      this.sizeService.getAll(),
      this.vendorService.getAll())
      .subscribe(res => {
        this.measurementUnits = res[0];
        this.classifications = res[1];
        this.matlCategories = res[2];
        this.sizeVariants = res[3];
        this.vendors = res[4];

        this.isLoading = false;
      });

    this.refersToList = enumToArray(RefersTo);
  }

  onSubmit() {
    this.submitted.emit();
  }

  get convertedLongUnit() {
    return this.measurementUnits
      ?.find(unit => unit.unitId === this.matService.material.convertToUomId)
      ?.longUnit?.toLowerCase();
  }

  get uomLongUnit() {
    return this.measurementUnits
      ?.find(unit => unit.unitId === this.matService.material.uomId)
      ?.longUnit?.toLowerCase();
  }
}
