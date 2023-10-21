import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {IFormModel} from "../../../shared/interface/IFormModel";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthPolicy} from "../../../auth/auth-policy";
import {MatlCategory} from "../../../models/matl-category";

@Component({
  selector: 'app-matl-categories-form',
  templateUrl: './matl-categories-form.component.html'
})
export class MatlCategoriesFormComponent implements OnInit {
  operations = Operations;
  controlState: boolean;
  @Input() isLoading = false;
  @Input() action: Operations;
  @Input() model: MatlCategory;
  @Output() submitted = new EventEmitter<IFormModel<MatlCategory>>();
  @ViewChild('f') form: NgForm;
  protected readonly AuthPolicy = AuthPolicy;

  constructor(public router: Router) {
  }

  onSubmit() {
    this.isLoading = true;
    this.model.categoryName = this.form.value.categoryName;
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
