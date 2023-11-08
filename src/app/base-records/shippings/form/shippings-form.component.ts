import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {AuthPolicy} from "../../../auth/auth-policy";
import {ShippingsService} from "../../../services/shippings.service";

@Component({
  selector: 'app-shippings-form',
  templateUrl: './shippings-form.component.html'
})
export class ShippingsFormComponent implements OnInit {
  operations = Operations;
  controlState: boolean;
  @Input() isLoading = false;
  @Input() action: Operations;
  @Output() submitted = new EventEmitter();
  @ViewChild('f') form: NgForm;
  protected readonly AuthPolicy = AuthPolicy;

  constructor(public router: Router,
              public shipService: ShippingsService) {
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
