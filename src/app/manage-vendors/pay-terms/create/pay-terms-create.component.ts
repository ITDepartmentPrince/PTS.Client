import { Component } from '@angular/core';
import {Operations} from "../../../shared/operations";
import {Router} from "@angular/router";
import {Utils} from "../../../shared/utils";
import {PayTermsService} from "../../../services/pay-terms.service";
import {PayTerm} from "../../../models/pay-term";

@Component({
  selector: 'app-pay-terms-create',
  templateUrl: './pay-terms-create.component.html'
})
export class PayTermsCreateComponent {
  operations = Operations;
  error = false;
  errorMessage: string;
  isLoading = false;

  constructor(private router: Router,
              private ptService: PayTermsService) {
    this.ptService.payTerm = new PayTerm();
  }

  onSubmitted() {
    this.isLoading = true;
    this.ptService.create()
      .subscribe({
        next: _ => {
          this.router?.navigate(['/manage-vendors/pay-terms'], {
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
