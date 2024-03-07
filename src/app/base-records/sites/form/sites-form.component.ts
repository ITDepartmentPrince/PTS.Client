import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthPolicy} from "../../../auth/auth-policy";
import {SitesService} from "../../../services/sites.service";
import {State} from "../../../models/state";
import {StatesService} from "../../../services/states.service";
import {RolesConstant} from "../../../auth/roles-constant";

@Component({
  selector: 'app-sites-form',
  templateUrl: './sites-form.component.html'
})
export class SitesFormComponent implements OnInit {
  operations = Operations;
  controlState: boolean;
  @Input() isLoading = false;
  @Input() action: Operations;
  @Output() submitted = new EventEmitter();
  @ViewChild('f') form: NgForm;
  protected readonly AuthPolicy = AuthPolicy;
  states: Array<State>;
  protected readonly RolesConstant = RolesConstant;

  constructor(public router: Router,
              public sitesService: SitesService,
              public statesService: StatesService) {
  }

  onSubmit() {
    this.isLoading = true;
    this.submitted.emit();
  }

  ngOnInit(): void {
    this.controlState = this.action === this.operations.View ||
      this.action === this.operations.Delete;

    this.statesService.getAll()
      .subscribe(res => this.states = res);
  }
}
