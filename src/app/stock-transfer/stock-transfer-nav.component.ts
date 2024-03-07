import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-stock-transfer-nav',
  templateUrl: './stock-transfer-nav.component.html'
})
export class StockTransferNavComponent {
  isOpen = false;

  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events
      ?.forEach(_ => {
        this.isOpen = this.route.root.firstChild?.snapshot.firstChild?.data['pathEnd'] === 'transfer';
      });
  }
}
