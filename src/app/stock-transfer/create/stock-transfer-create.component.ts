import {Component} from '@angular/core';
import {Operations} from "../../shared/operations";
import {Router} from "@angular/router";
import {Utils} from "../../shared/utils";
import {StockTransferService} from "../../services/stock-transfer-service";

@Component({
  selector: 'app-stock-transfer-create',
  templateUrl: './stock-transfer-create.component.html'
})
export class StockTransferCreateComponent {
  operations = Operations;
  error = false;
  errorMessage: string;
  isLoading = true;

  constructor(private router: Router,
              private stService: StockTransferService) {
    this.stService.init();
    this.stService.stCreateDate = new Date();
  }

  onSubmitted() {
    this.stService.create()
      .subscribe({
        next: _ => {
          this.router?.navigate(['/stock-transfer'], {
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
