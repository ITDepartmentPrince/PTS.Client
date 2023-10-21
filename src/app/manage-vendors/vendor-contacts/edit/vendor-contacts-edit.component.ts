import {Component, Input} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {IFormModel} from "../../../shared/interface/IFormModel";
import {Router} from "@angular/router";
import {Utils} from "../../../shared/utils";
import {VendorContact} from "../../../models/vendor-contact";
import {VendorContactsService} from "../../../services/vendor-contacts.service";
import {VendorsService} from "../../../services/vendors.service";

@Component({
  selector: 'app-vendor-contacts-edit',
  templateUrl: './vendor-contacts-edit.component.html'
})
export class VendorContactsEditComponent {
  operations = Operations;
  error = false;
  errorMessage: string;
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

  onSubmitted = (formModel: IFormModel<VendorContact>) => {
    this.isLoading = true;
    this.contactsService.edit(formModel.model)
      .subscribe({
        next: _ => {
          this.router?.navigate(['/manage-vendors/vendor-contacts'], {
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
