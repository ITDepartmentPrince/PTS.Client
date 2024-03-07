import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {SizeVariant} from "../../../models/size-variant";
import {IFormModel} from "../../../shared/interface/IFormModel";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthPolicy} from "../../../auth/auth-policy";
import {RolesConstant} from "../../../auth/roles-constant";

@Component({
  selector: 'app-size-variant-form',
  templateUrl: './size-variant-form.component.html'
})
export class SizeVariantFormComponent implements OnInit {
  operations = Operations;
  controlState: boolean;
  @Input() isLoading = false;
  @Input() action: Operations;
  @Input() model: SizeVariant;
  @Output() submitted = new EventEmitter<IFormModel<SizeVariant>>();
  @ViewChild('f') form: NgForm;
  protected readonly AuthPolicy = AuthPolicy;

  constructor(public router: Router) {
  }

  onSubmit() {
    this.isLoading = true;
    this.model.sizeDescription = this.form.value.sizeDescription;
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
