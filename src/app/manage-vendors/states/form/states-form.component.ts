import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {IFormModel} from "../../../shared/interface/IFormModel";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthPolicy} from "../../../auth/auth-policy";
import {State} from "../../../models/state";

@Component({
  selector: 'app-states-form',
  templateUrl: './states-form.component.html'
})
export class statesFormComponent implements OnInit {
  operations = Operations;
  controlState: boolean;
  @Input() isLoading = false;
  @Input() action: Operations;
  @Input() model: State;
  @Output() submitted = new EventEmitter<IFormModel<State>>();
  @ViewChild('f') form: NgForm;
  protected readonly AuthPolicy = AuthPolicy;

  constructor(public router: Router) {
  }

  onSubmit() {
    this.isLoading = true;

    if (this.action !== Operations.Edit)
      this.model.stateCode = this.form.value.stateCode;

    this.model.stateName = this.form.value.stateName;
    this.model.countryCode = this.form.value.countryCode;
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
