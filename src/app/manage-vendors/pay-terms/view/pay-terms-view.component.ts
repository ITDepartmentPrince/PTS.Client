import {Component, Input} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {Router} from "@angular/router";
import {PayTermsService} from "../../../services/pay-terms.service";

@Component({
  selector: 'app-pay-terms-view',
  templateUrl: './pay-terms-view.component.html'
})
export class PayTermsViewComponent {
  operations = Operations;
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

  onSubmitted() {
    this.router?.navigate([`/manage-vendors/pay-terms/${this.ptService.payTerm.id}/edit`],
      {queryParamsHandling: 'preserve'}
    );
  }
}
