import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthPolicy} from "../../../auth/auth-policy";
import {DepartmentsService} from "../../../services/departments.service";

@Component({
  selector: 'app-Departments-form',
  templateUrl: './departments-form.component.html'
})
export class DepartmentsFormComponent implements OnInit {
  operations = Operations;
  controlState: boolean;
  @Input() isLoading = false;
  @Input() action: Operations;
  @Output() submitted = new EventEmitter();
  @ViewChild('f') form: NgForm;
  protected readonly AuthPolicy = AuthPolicy;

  constructor(public router: Router,
              public dService: DepartmentsService) {
  }

  onSubmit() {
    this.isLoading = true;
    this.submitted.emit();
  }

  ngOnInit(): void {
    this.controlState = this.action === this.operations.View ||
      this.action === this.operations.Delete;
  }
}
