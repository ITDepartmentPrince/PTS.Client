import {Injectable} from "@angular/core";

@Injectable({providedIn: 'root'})
export class SiteService {
  set site(siteId: number) {
    localStorage.setItem('site', siteId.toString());
  }

  get site() {
    // return parseInt(localStorage.getItem('site') as string);
    return 1;
  }
}
