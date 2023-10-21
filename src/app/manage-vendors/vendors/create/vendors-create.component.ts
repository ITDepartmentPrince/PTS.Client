import {Component, OnInit} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {IFormModel} from "../../../shared/interface/IFormModel";
import {Router} from "@angular/router";
import {Utils} from "../../../shared/utils";
import {StatesService} from "../../../services/states.service";
import {Vendor} from "../../../models/vendor";
import {VendorsService} from "../../../services/vendors.service";

@Component({
  selector: 'app-vendors-create',
  templateUrl: './vendors-create.component.html'
})
export class VendorsCreateComponent implements OnInit {
  operations = Operations;
  error = false;
  errorMessage: string;
  vendor = new Vendor();
  isLoading = false;

  constructor(private router: Router,
              private vendorsService: VendorsService,
              private statesService: StatesService) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.statesService.getAll()
      .subscribe({
        next: states => {
          this.vendor.states = states;
          this.isLoading = false;
        },
        error: error => {
          this._error(error);
        }
      });
  }

  onSubmitted(formModel: IFormModel<Vendor>) {
    this.isLoading = true;
    this.vendorsService.create(formModel.model)
      .subscribe({
        next: _ => {
          this.router?.navigate(['/manage-vendors/vendors'], {
            queryParamsHandling: 'preserve'
          });
        },
        error: error => {
          this._error(error);
        }
      });
  }

  private _error(error: any) {
    this.errorMessage = Utils.handleError(error);
    this.error = true;
    this.isLoading = false;
  }
}
