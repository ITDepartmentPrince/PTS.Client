import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {RecvdItemLotBatch} from "../models/recvdItemLotBatch";
import {ItemLabel} from "../models/itemLabel";
import {Observable, Subject} from "rxjs";
import {AuthConstant} from "../auth/auth.constant";
import {SitesService} from "./sites.service";

@Injectable({providedIn: 'root'})
export class ItemLabelService {
  _recvdItemLotsBatches: Array<RecvdItemLotBatch>;
  shelfCode: string;
  shelfCodeAdded = new Subject<void>();
  itemLabels = new Array<ItemLabel>();

  constructor(private httpClient: HttpClient,
              private siteService: SitesService) {
  }

  set recvdItemLotsBatches(value: Array<RecvdItemLotBatch>) {
    this._recvdItemLotsBatches = value;

    if (this._recvdItemLotsBatches)
      for (const recvdItemLotsBatch of this._recvdItemLotsBatches) {
        const itemLabel = new ItemLabel();
        itemLabel.batchLotId = recvdItemLotsBatch.batchLotId;
        itemLabel.batchLotSiteId = recvdItemLotsBatch.batchLotSiteId;
        itemLabel.conversionRate = recvdItemLotsBatch.rlbConversionRate;
        recvdItemLotsBatch.itemsLabels = new Array<ItemLabel>();
        recvdItemLotsBatch.itemsLabels.push(itemLabel);
      }
  }

  get recvdItemLotsBatches() {
    return this._recvdItemLotsBatches;
  }

  create(): Observable<Array<number>> {
    return this.httpClient.post<Array<number>>(AuthConstant.apiRoot + '/ItemsLabel',
      this._recvdItemLotsBatches.flatMap(r => r.itemsLabels), {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  getLabelsByIds(ids: Array<number>) {
    const params = new HttpParams().set('ids', ids.join(','));
    return this.httpClient.get<Array<ItemLabel>>(AuthConstant.apiRoot + '/ItemsLabel', { params });
  }

  /*getMaterialsShelved(): Observable<Array<ItemLabel>> {
    if (!this.shelfCode)
      throw new Error('Invalid shelf code');

    return this.httpClient.get<Array<ItemLabel>>(AuthConstant.apiRoot +
      `/ItemsLabel/GetMaterialsShelved/${this.shelfCode}/${this.siteService.localSite}`);
  }*/

  addShelfCode(id: number, shelfCode: string): Observable<any> {
    return this.httpClient.put(AuthConstant.apiRoot +
      `/ItemsLabel/${id}/AddShelfCode/${shelfCode}/${this.siteService.localSite}`, {});
  }

  getLabelWithBatchLot(id: number): Observable<ItemLabel> {
    return this.httpClient.get<ItemLabel>(AuthConstant.apiRoot +
      `/ItemsLabel/GetLabelWithBatchLot/${id}`);
  }
}
