import {Component, Input} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {Router} from "@angular/router";
import {SitesService} from "../../../services/sites.service";

@Component({
  selector: 'app-sites-view',
  templateUrl: './sites-view.component.html'
})
export class SitesViewComponent {
  operations = Operations;
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

  onSubmitted() {
    this.router?.navigate([`/base-records/sites/${this.sitesService.site.siteId}/edit`],
      {queryParamsHandling: 'preserve'}
    );
  }
}
