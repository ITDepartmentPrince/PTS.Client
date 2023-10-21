import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {IFormModel} from "../../../shared/interface/IFormModel";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthPolicy} from "../../../auth/auth-policy";
import {VendorContact} from "../../../models/vendor-contact";

@Component({
  selector: 'app-vendor-contacts-form',
  templateUrl: './vendor-contacts-form.component.html'
})
export class VendorContactsFormComponent implements OnInit {
  operations = Operations;
  controlState: boolean;
  @Input() isLoading = false;
  @Input() action: Operations;
  @Input() model: VendorContact;
  @Output() submitted = new EventEmitter<IFormModel<VendorContact>>();
  @ViewChild('f') form: NgForm;
  protected readonly AuthPolicy = AuthPolicy;

  constructor(public router: Router) {
  }

  onSubmit() {
    this.isLoading = true;

    this.model.vendorId = this.form.value.vendorId;
    this.model.firstName = this.form.value.firstName;
    this.model.lastName = this.form.value.lastName;
    this.model.emailAddress = this.form.value.emailAddress;
    this.model.emailDistribution = this.form.value.emailDistribution;
    this.model.phoneNumber = this.form.value.phoneNumber;
    this.model.mobileNumber = this.form.value.mobileNumber;
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
}
