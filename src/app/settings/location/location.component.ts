import {Component, OnInit} from '@angular/core';
import {AuthPolicy} from "../../auth/auth-policy";
import {SitesService} from "../../services/sites.service";
import {Site} from "../../models/site";
import {RolesConstant} from "../../auth/roles-constant";

@Component({
  selector: 'app-location',
  templateUrl: './location.component.html'
})
export class LocationComponent implements OnInit {
  protected readonly AuthPolicy = AuthPolicy;
  protected readonly isNaN = isNaN;
  isLoading = false;
  sites: Site[];
  siteId: number;
  locationChanged = false;

  constructor(public siteService: SitesService) {
  }

  ngOnInit(): void {
    this.siteService.getAll()
      .subscribe(sites => {
        this.sites = sites.filter(s =>
          !s.siteName.toLowerCase().includes('all locations'));
        this.siteId = this.siteService.localSite;
      });
  }

  onSubmit() {
    this.siteService.localSite = this.siteId;

    this.locationChanged = false;
    setTimeout(() => {
      this.locationChanged = true;
    }, 200);
  }

  protected readonly RolesConstant = RolesConstant;
}
