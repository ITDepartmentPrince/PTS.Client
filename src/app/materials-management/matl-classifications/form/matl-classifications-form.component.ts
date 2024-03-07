import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {IFormModel} from "../../../shared/interface/IFormModel";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthPolicy} from "../../../auth/auth-policy";
import {MatlClassification} from "../../../models/matl-classification";
import {ItemType} from "../../../shared/item-type";
import {RolesConstant} from "../../../auth/roles-constant";

@Component({
  selector: 'app-matl-classifications-form',
  templateUrl: './matl-classifications-form.component.html'
})
export class MatlClassificationsFormComponent implements OnInit {
  operations = Operations;
  controlState: boolean;
  @Input() isLoading = false;
  @Input() action: Operations;
  @Input() model: MatlClassification;
  @Output() submitted = new EventEmitter<IFormModel<MatlClassification>>();
  @ViewChild('f') form: NgForm;
  protected readonly AuthPolicy = AuthPolicy;
  itemsType: { name: any; id: number }[];

  constructor(public router: Router) {
  }

  onSubmit() {
    this.isLoading = true;
    this.model.classificationName = this.form.value.classificationName;
    this.model.classifiedAs = this.form.value.classifiedAs;
    this.model.inActive = this.form.value.inActive;

    this.submitted.emit({
      action: this.action,
      model: this.model
    });
  }

  ngOnInit(): void {
    this.controlState = this.action === this.operations.View ||
      this.action === this.operations.Delete;

    this.setItemsType();
  }

   private setItemsType() {
    this.itemsType = Object.entries(ItemType)
      .filter(entry => !isNaN(entry[0] as any))
      .map(entry => ({ name: entry[1], id: +entry[0] }));
  }

  protected readonly RolesConstant = RolesConstant;
}
