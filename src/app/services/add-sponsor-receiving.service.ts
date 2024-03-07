import {Receiving} from "../models/receiving";
import {Observable, Subject} from "rxjs";
import {AuthConstant} from "../auth/auth.constant";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {SitesService} from "./sites.service";
import {Injectable} from "@angular/core";

@Injectable()
export class AddSponsorReceivingService {
  receiving = new Receiving();
  itemsChange = new Subject<void>();

  constructor(private httpClient: HttpClient,
              private siteService: SitesService) {
  }

  getTotalQty() {
    return this.receiving.receivingItems.reduce((accumulator, currentValue) =>
      accumulator + currentValue.orderedQty, 0);
  }

  getTotalPricePerQty() {
    return this.receiving.receivingItems.reduce((accumulator, currentValue) =>
      accumulator + currentValue.pricePerOrderedQty, 0);
  }

  getTotal() {
    return this.receiving.receivingItems.reduce((accumulator, currentValue) =>
      accumulator + (currentValue.orderedQty * currentValue.pricePerOrderedQty), 0);
  }

  create(): Observable<any> {
    console.log(this.receiving.receivingItems);
    return this.httpClient.post<Receiving>(AuthConstant.apiRoot +
      `/Sites/${this.siteService.localSite}/Receiving`,
      this.receiving,
      { headers: new HttpHeaders().set('Content-Type', 'application/json') });
  }
}
