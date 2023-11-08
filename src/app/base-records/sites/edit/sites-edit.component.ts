import {Component, Input} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {Router} from "@angular/router";
import {Utils} from "../../../shared/utils";
import {SitesService} from "../../../services/sites.service";

@Component({
  selector: 'app-sites-edit',
  templateUrl: './sites-edit.component.html'
})
export class SitesEditComponent {
  operations = Operations;
  error = false;
  errorMessage: string;
  isLoading = true;

  constructor(private router: Router,
              private sitesService: SitesService) {
  }

  @Input()
  set siteId(siteId: number) {
    this.sitesService.get(siteId)
      .subscribe({
        next: res => {
          this.sitesService.site = res;
          this.isLoading = false;
        },
        error: _ => {
          this.isLoading = false;
        }
      });
  }

  onSubmitted = () => {
    this.isLoading = true;
    this.sitesService.edit()
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
