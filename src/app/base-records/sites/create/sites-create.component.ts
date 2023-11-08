import { Component } from '@angular/core';
import {Operations} from "../../../shared/operations";
import {Router} from "@angular/router";
import {Utils} from "../../../shared/utils";
import {SitesService} from "../../../services/sites.service";
import {Site} from "../../../models/site";

@Component({
  selector: 'app-sites-create',
  templateUrl: './sites-create.component.html'
})
export class SitesCreateComponent {
  operations = Operations;
  error = false;
  errorMessage: string;
  isLoading = false;

  constructor(private router: Router,
              private sitesService: SitesService) {
    this.sitesService.site = new Site();
  }

  onSubmitted() {
    this.isLoading = true;
    this.sitesService.create()
      .subscribe({
        next: _ => {
          this.router?.navigate(['/base-records/sites'], {
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
