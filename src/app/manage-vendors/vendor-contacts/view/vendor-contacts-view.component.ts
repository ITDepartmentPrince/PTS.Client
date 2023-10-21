import {Component, Input} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {IFormModel} from "../../../shared/interface/IFormModel";
import {Router} from "@angular/router";
import {VendorContact} from "../../../models/vendor-contact";
import {VendorContactsService} from "../../../services/vendor-contacts.service";
import {VendorsService} from "../../../services/vendors.service";

@Component({
  selector: 'app-vendor-contacts-view',
  templateUrl: './vendor-contacts-view.component.html'
})
export class VendorContactsViewComponent {
  operations = Operations;
  contact = new VendorContact();
  isLoading = true;

  constructor(private router: Router,
              private contactsService: VendorContactsService,
              private vendorsService: VendorsService) {
  }

  @Input()
  set contactId(id: number) {
    this.contactsService.get(id)
      .subscribe({
        next: contact => {
          this.contact = contact;

          this.vendorsService.getAll()
            .subscribe({
              next: vendors => {
                this.contact.vendors = vendors;
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

  onSubmitted(formModel: IFormModel<VendorContact>) {
    this.router?.navigate([`/manage-vendors/vendor-contacts/${formModel.model.contactId}/edit`],
      {queryParamsHandling: 'preserve'}
    );
  }
}
