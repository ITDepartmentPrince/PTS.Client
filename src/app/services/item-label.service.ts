import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {RecvdItemLotBatch} from "../models/recvdItemLotBatch";
import {ItemLabel} from "../models/itemLabel";
import {Observable} from "rxjs";
import {AuthConstant} from "../auth/auth.constant";

@Injectable({providedIn: 'root'})
export class ItemLabelService {
  _recvdItemLotsBatches: Array<RecvdItemLotBatch>;

  constructor(private httpClient: HttpClient) {
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

  create(): Observable<any> {
    return this.httpClient.post<ItemLabel>(AuthConstant.apiRoot + '/ItemsLabel',
      this._recvdItemLotsBatches.flatMap(r => r.itemsLabels), {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }
}
