import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {IFormModel} from "../../../shared/interface/IFormModel";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthPolicy} from "../../../auth/auth-policy";
import {MeasurementUnit} from "../../../models/measurement-unit";
import {RolesConstant} from "../../../auth/roles-constant";

@Component({
  selector: 'app-measurement-units-form',
  templateUrl: './measurement-units-form.component.html'
})
export class MeasurementUnitsFormComponent implements OnInit {
  operations = Operations;
  controlState: boolean;
  @Input() isLoading = false;
  @Input() action: Operations;
  @Input() model: MeasurementUnit;
  @Output() submitted = new EventEmitter<IFormModel<MeasurementUnit>>();
  @ViewChild('f') form: NgForm;
  protected readonly AuthPolicy = AuthPolicy;

  constructor(public router: Router) {
  }

  onSubmit() {
    this.isLoading = true;
    this.model.shortUnit = this.form.value.shortUnit;
    this.model.longUnit = this.form.value.longUnit;
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

  protected readonly RolesConstant = RolesConstant;
}
