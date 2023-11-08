import {Component, Input} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {Router} from "@angular/router";
import {Utils} from "../../../shared/utils";
import {PayTermsService} from "../../../services/pay-terms.service";

@Component({
  selector: 'app-pay-terms-edit',
  templateUrl: './pay-terms-edit.component.html'
})
export class PayTermsEditComponent {
  operations = Operations;
  error = false;
  errorMessage: string;
  isLoading = true;

  constructor(private router: Router,
              private ptService: PayTermsService) {
  }

  @Input()
  set id(id: number) {
    this.ptService.get(id)
      .subscribe({
        next: res => {
          this.ptService.payTerm = res;
          this.isLoading = false;
        },
        error: _ => {
          this.isLoading = false;
        }
      });
  }

  onSubmitted = () => {
    this.isLoading = true;
    this.ptService.edit()
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
