import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {IFormModel} from "../../../shared/interface/IFormModel";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthPolicy} from "../../../auth/auth-policy";
import {Vendor} from "../../../models/vendor";
import {RolesConstant} from "../../../auth/roles-constant";

@Component({
  selector: 'app-vendors-form',
  templateUrl: './vendors-form.component.html'
})
export class vendorsFormComponent implements OnInit {
  operations = Operations;
  controlState: boolean;
  @Input() isLoading = false;
  @Input() action: Operations;
  @Input() model: Vendor;
  @Output() submitted = new EventEmitter<IFormModel<Vendor>>();
  @ViewChild('f') form: NgForm;
  protected readonly AuthPolicy = AuthPolicy;

  constructor(public router: Router) {
  }

  onSubmit() {
    this.isLoading = true;

    this.model.companyName = this.form.value.companyName;
    this.model.email = this.form.value.email;
    this.model.phoneNumber = this.form.value.phoneNumber;
    this.model.street1 = this.form.value.street1;
    this.model.street2 = this.form.value.street2;
    this.model.cityName = this.form.value.cityName;
    this.model.stateCode = this.form.value.stateCode;
    this.model.zipCode = this.form.value.zipCode;
    this.model.notes = this.form.value.notes;
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
