import {Component, Input} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {IFormModel} from "../../../shared/interface/IFormModel";
import {Router} from "@angular/router";
import {Vendor} from "../../../models/vendor";
import {VendorsService} from "../../../services/vendors.service";
import {StatesService} from "../../../services/states.service";

@Component({
  selector: 'app-vendors-view',
  templateUrl: './vendors-view.component.html'
})
export class VendorsViewComponent {
  operations = Operations;
  vendor: Vendor;
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
          this.vendor = vendor;

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

  onSubmitted(formModel: IFormModel<Vendor>) {
    this.router?.navigate([`/manage-vendors/vendors/${formModel.model.vendorId}/edit`],
      {queryParamsHandling: 'preserve'}
    );
  }
}
