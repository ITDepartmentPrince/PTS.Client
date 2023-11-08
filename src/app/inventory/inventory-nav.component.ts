import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-inventory-nav',
  templateUrl: './inventory-nav.component.html'
})
export class InventoryNavComponent {
  protected readonly window = window;
  isOpen = false;

  constructor(private router: Router, private route: ActivatedRoute) {
    /*this.router.events
      ?.forEach(_ => {
        this.isOpen = this.route.root.firstChild?.snapshot.firstChild?.data['pathEnd'] === 'open';
      });*/
  }
}
