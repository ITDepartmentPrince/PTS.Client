import {Component, OnInit} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {IFormModel} from "../../../shared/interface/IFormModel";
import {Router} from "@angular/router";
import {Utils} from "../../../shared/utils";
import {VendorContact} from "../../../models/vendor-contact";
import {VendorContactsService} from "../../../services/vendor-contacts.service";
import {VendorsService} from "../../../services/vendors.service";

@Component({
  selector: 'app-vendor-contacts-create',
  templateUrl: './vendor-contacts-create.component.html'
})
export class VendorContactsCreateComponent implements OnInit {
  operations = Operations;
  error = false;
  errorMessage: string;
  contact = new VendorContact();
  isLoading = false;

  constructor(private router: Router,
              private contactsService: VendorContactsService,
              private vendorsService: VendorsService) {
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.vendorsService.getAll()
      .subscribe({
        next: vendors => {
          this.contact.vendors = vendors;
          this.isLoading = false;
        },
        error: error => {
          this._error(error);
        }
      });
  }

  onSubmitted(formModel: IFormModel<VendorContact>) {
    this.isLoading = true;
    this.contactsService.create(formModel.model)
      .subscribe({
        next: _ => {
          this.router?.navigate(['/manage-vendors/vendor-contacts'], {
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
