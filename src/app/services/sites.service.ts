import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {QueryParams} from "../models/query-params";
import {Observable} from "rxjs";
import {DatatableResponse} from "../models/datatable-response";
import {AuthConstant} from "../auth/auth.constant";
import {Site} from "../models/site";

@Injectable({providedIn: 'root'})
export class SitesService {
  site: Site;

  constructor(private httpClient: HttpClient) {
  }

  set localSite(siteId: number) {
    localStorage.setItem('site', siteId.toString());
  }

  get localSite() {
    // return parseInt(localStorage.getItem('site') as string);
    return 1;
  }

  getRequired(queryParams: QueryParams): Observable<DatatableResponse<Site>> {
    return this.httpClient
      .post<DatatableResponse<Site>>(AuthConstant.apiRoot + '/Sites/GetRequired', queryParams, {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      });
  }

  getAll(): Observable<Site[]> {
    return this.httpClient.get<Site[]>(AuthConstant.apiRoot + `/Sites`);
  }

  get(siteId: number): Observable<Site> {
    return this.httpClient.get<Site>(AuthConstant.apiRoot + `/Sites/${siteId}`);
  }

  create(): Observable<any> {
    return this.httpClient.post<Site>(AuthConstant.apiRoot + '/Sites', this.site, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  edit(): Observable<any> {
    return this.httpClient.put<Site>(AuthConstant.apiRoot + '/Sites', this.site, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  delete(siteId: number | undefined): Observable<any> {
    return this.httpClient.delete(AuthConstant.apiRoot + `/Sites/${siteId}`);
  }
}
