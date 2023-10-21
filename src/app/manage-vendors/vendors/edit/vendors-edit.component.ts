import {Component, Input} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {IFormModel} from "../../../shared/interface/IFormModel";
import {Router} from "@angular/router";
import {Utils} from "../../../shared/utils";
import {VendorsService} from "../../../services/vendors.service";
import {Vendor} from "../../../models/vendor";
import {StatesService} from "../../../services/states.service";

@Component({
  selector: 'app-vendors-edit',
  templateUrl: './vendors-edit.component.html'
})
export class VendorsEditComponent {
  operations = Operations;
  error = false;
  errorMessage: string;
  vendor = new Vendor();
  isLoading = true;

  constructor(private router: Router,
              private vendorsService: VendorsService,
              private statesService: StatesService) {
  }

  @Input()
  set vendorId(id: number) {
    this.vendorsService.get(id)
      .subscribe({
        next: vendor => {
          this.vendor = vendor;`
          `

          this.statesService.getAll()
            .subscribe({
              next: states => {
                this.vendor.states = states;
                this.isLoading = false;
              },
              error: _ => {
                this.isLoading = false;
              }
            });
        },
        error: _ => {
          this.isLoading = false;
        }
      });
  }

  onSubmitted = (formModel: IFormModel<Vendor>) => {
    this.isLoading = true;
    this.vendorsService.edit(formModel.model)
      .subscribe({
        next: _ => {
          this.router?.navigate(['/manage-vendors/vendors'], {
            queryParamsHandling: 'preserve'
          });
        },
        error: error => {
          this.errorMessage = Utils.handleError(error);
          this.error = true;
          this.isLoading = false;
        }
      });
  }
}
