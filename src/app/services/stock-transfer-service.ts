import {IService} from "../shared/interface/IService";
import {StockTransfer} from "../models/stock-transfer";
import {QueryParams} from "../models/query-params";
import {Observable, Subject} from "rxjs";
import {DatatableResponse} from "../models/datatable-response";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {SitesService} from "./sites.service";
import {AuthConstant} from "../auth/auth.constant";
import {Injectable} from "@angular/core";

@Injectable({providedIn: 'root'})
export class StockTransferService implements IService<StockTransfer> {
  stockTransfer: StockTransfer;
  changeItems = new Subject<void>();

  constructor(private httpClient: HttpClient,
              private siteService: SitesService) {
    this.init();
  }

  init() {
    this.stockTransfer = new StockTransfer();
    this.stockTransfer.siteId = this.siteService.localSite;
    this.stockTransfer.createDate = new Date();
    this.stockTransfer.originSiteId = this.siteService.localSite;
  }

  set stCreateDate(date: Date) {
    this.stockTransfer.createDate = date;
  }

  getRequired(qp: QueryParams): Observable<DatatableResponse<StockTransfer>> {
    return this.httpClient
      .post<DatatableResponse<StockTransfer>>(
        AuthConstant.apiRoot + `/Sites/${this.siteService.localSite}/StockTransfer/GetRequired`,
        qp,
        { headers: new HttpHeaders().set('Content-Type', 'application/json') });
  }

  get(number: string): Observable<StockTransfer> {
    return this.httpClient.get<StockTransfer>(AuthConstant.apiRoot +
      `/Sites/${this.siteService.localSite}/StockTransfer/${number}`);
  }

  create(): Observable<any> {
    return this.httpClient.post<StockTransfer>(AuthConstant.apiRoot +
      `/Sites/${this.siteService.localSite}/StockTransfer`,
      this.stockTransfer,
      { headers: new HttpHeaders().set('Content-Type', 'application/json') });
  }

  edit(): Observable<any> {
    return this.httpClient.put<StockTransfer>(AuthConstant.apiRoot +
      `/Sites/${this.siteService.localSite}/StockTransfer`,
      this.stockTransfer,
      { headers: new HttpHeaders().set('Content-Type', 'application/json') });
  }

  delete(number: string | undefined) {
    return this.httpClient.delete(AuthConstant.apiRoot +
      `/Sites/${this.siteService.localSite}/StockTransfer/${number}`);
  }

  shipped(number: string) {
    return this.httpClient.put(AuthConstant.apiRoot +
      `/Sites/${this.siteService.localSite}/StockTransfer/Shipped/${number}`, null);
  }
}
