import {Component, Input} from '@angular/core';
import {Operations} from "../../shared/operations";
import {Router} from "@angular/router";
import {StockTransferService} from "../../services/stock-transfer-service";

@Component({
  selector: 'app-stock-transfer-view',
  templateUrl: './stock-transfer-view.component.html'
})
export class StockTransferViewComponent {
  operations = Operations;
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
    this.router?.navigate([`/stock-transfer/${this.stService.stockTransfer.number}/edit`],
      {queryParamsHandling: 'preserve'}
    );
  }
}
