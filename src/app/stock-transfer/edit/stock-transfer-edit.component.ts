import {Component, Input} from '@angular/core';
import {Operations} from "../../shared/operations";
import {Router} from "@angular/router";
import {StockTransferService} from "../../services/stock-transfer-service";
import {Utils} from "../../shared/utils";

@Component({
  selector: 'app-stock-transfer-edit',
  templateUrl: './stock-transfer-edit.component.html'
})
export class StockTransferEditComponent {
  operations = Operations;
  error = false;
  errorMessage: string;
  isLoading = true;

  constructor(private router: Router,
              private stService: StockTransferService) {
  }

  @Input()
  set number(number: string) {
    this.stService.get(number)
      .subscribe({
        next: st => {
          this.stService.stockTransfer = st;
          this.isLoading = false;

          setTimeout(() => {
            this.stService.changeItems.next();
          });
        },
        error: _ => {
          this.isLoading = false;
        }
      });
  }

  onSubmitted() {
    this.stService.edit()
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
