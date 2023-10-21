import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-vendors',
  templateUrl: './manage-vendors.component.html'
})
export class ManageVendorsComponent implements OnInit {
  constructor(private router: Router, public route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.router?.navigate(['vendors'], {relativeTo: this.route});
  }
}
