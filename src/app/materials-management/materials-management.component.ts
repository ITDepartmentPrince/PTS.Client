import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-materials-management',
  templateUrl: './materials-management.component.html'
})
export class MaterialsManagementComponent implements OnInit {
  constructor(private router: Router, public route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.router?.navigate(['materials'], {relativeTo: this.route});
  }
}
