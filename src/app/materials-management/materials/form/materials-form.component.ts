import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {IFormModel} from "../../../shared/interface/IFormModel";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthPolicy} from "../../../auth/auth-policy";
import {Material} from "../../../models/material";

@Component({
  selector: 'app-materials-form',
  templateUrl: './materials-form.component.html'
})
export class MaterialsFormComponent implements OnInit {
  operations = Operations;
  controlState: boolean;
  @Input() isLoading = false;
  @Input() action: Operations;
  @Input() model: Material;
  @Output() submitted = new EventEmitter<IFormModel<Material>>();
  @ViewChild('f') form: NgForm;
  protected readonly AuthPolicy = AuthPolicy;

  constructor(public router: Router) {
  }

  onSubmit() {
    this.isLoading = true;

    this.model.materialDescription = this.form.value.materialDescription;
    this.model.catalogNumber = this.form.value.catalogNumber;
    this.model.uomId = this.form.value.uomId;
    this.model.classificationId = this.form.value.classificationId;
    this.model.categoryId = this.form.value.categoryId;
    this.model.sizeId = this.form.value.sizeId;
    this.model.vendorId = this.form.value.vendorId;

    if (this.model.isPurchaseDifferent) {
      this.model.defaultUomUnitId = this.form.value.defaultUomUnitId;
      this.model.conversionRate = this.form.value.conversionRate;
    }
    else {
      this.model.defaultUomUnitId = null;
      this.model.conversionRate = null;
    }

    this.model.inActive = this.form.value.inActive;

    this.submitted.emit({
      action: this.action,
      model: this.model
    });
  }

  ngOnInit(): void {
    this.controlState = this.action === this.operations.View ||
      this.action === this.operations.Delete;

  }

  get defaultLongUnit() {
    return this.model.defaultUomUnits?.
    find(unit => unit.unitId === this.model.defaultUomUnitId)
      ?.longUnit?.toLowerCase();
  }

  get uomLongUnit() {
    return this.model.measurementUnits?.
    find(unit => unit.unitId === this.model.uomId)
      ?.longUnit?.toLowerCase();
  }
}
