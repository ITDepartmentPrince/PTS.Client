import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {InventoryIntel} from "../models/inventoryIntel";
import {AuthConstant} from "../auth/auth.constant";
import {Source} from "../models/source";

@Injectable({
  providedIn: 'root'
})
export class InventoryIntelService {
  constructor(private httpClient: HttpClient) { }

  getAll(batchLotId: number, siteId: number): Observable<InventoryIntel[]> {
    return this.httpClient.get<InventoryIntel[]>(
      AuthConstant.apiRoot + `/InventoryIntel/${batchLotId}/${siteId}`);
  }

  getInvSource(invIntel: InventoryIntel): Observable<Source> {
    return this.httpClient.get<Source>(
      AuthConstant.apiRoot + `/InventoryIntel/InvSource/${invIntel.roNumber}/Sites/${invIntel.roSiteId}`
    );
  }
}
