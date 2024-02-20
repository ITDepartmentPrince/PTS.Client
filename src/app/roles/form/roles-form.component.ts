import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Operations} from "../../shared/operations";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthPolicy} from 'src/app/auth/auth-policy';
import {RoleService} from "../../services/role.service";
import {enumToArray} from "../../shared/enumToArray";
import {RoleType} from "../../models/role";

@Component({
  selector: 'app-roles-form',
  templateUrl: './roles-form.component.html'
})
export class RolesFormComponent implements OnInit {
  operations = Operations;
  controlState: boolean;
  @Input() isLoading = false;
  @Input() action: Operations;
  @Output() submitted = new EventEmitter<void>()
  @ViewChild('f') form: NgForm;
  protected readonly AuthPolicy = AuthPolicy;
  rolesType: Array<{ name: string; id: number }>;

  constructor(public router: Router,
              public roleService: RoleService) {
  }

  onSubmit() {
    this.isLoading = true;
    this.submitted.emit();
  }

  ngOnInit(): void {
    this.controlState = this.action === this.operations.View ||
      this.action === this.operations.Delete;

    this.rolesType = enumToArray(RoleType);
  }
}
