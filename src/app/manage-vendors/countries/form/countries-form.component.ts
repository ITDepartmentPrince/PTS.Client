import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {IFormModel} from "../../../shared/interface/IFormModel";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthPolicy} from "../../../auth/auth-policy";
import {Country} from "../../../models/country";

@Component({
  selector: 'app-countries-form',
  templateUrl: './countries-form.component.html'
})
export class countriesFormComponent implements OnInit {
  operations = Operations;
  controlState: boolean;
  @Input() isLoading = false;
  @Input() action: Operations;
  @Input() model: Country;
  @Output() submitted = new EventEmitter<IFormModel<Country>>();
  @ViewChild('f') form: NgForm;
  protected readonly AuthPolicy = AuthPolicy;

  constructor(public router: Router) {
  }

  onSubmit() {
    this.isLoading = true;

    if (this.action !== Operations.Edit)
      this.model.countryCode = this.form.value.countryCode;

    this.model.countryName = this.form.value.countryName;
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
