import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {AuthConstant} from "../auth/auth.constant";
import {HttpClient} from "@angular/common/http";
import {SitesService} from "./sites.service";

@Injectable({providedIn: 'root'})
export class ShelvesService {
  constructor(private httpClient: HttpClient,
              private siteService: SitesService) { }

  isShelfAvailable(shelfCode: string): Observable<boolean> {
    return this.httpClient.get<boolean>(AuthConstant.apiRoot +
      `/Shelves/IsShelfAvailable/${shelfCode}/${this.siteService.localSite}`);
  }
}
