import {EventEmitter, Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {AuthConstant} from "../auth/auth.constant";
import {BatchLot} from "../models/batchLot";
import {IService} from "../shared/interface/IService";
import {QueryParams} from "../models/query-params";
import {DatatableResponse} from "../models/datatable-response";

@Injectable({providedIn: 'root'})
export class BatchesLotsService implements IService<BatchLot> {
  siteId: number;

  constructor(private httpClient: HttpClient) { }

  getRequired(qp: QueryParams): Observable<DatatableResponse<BatchLot>> {
    return this.httpClient
      .post<DatatableResponse<BatchLot>>(
        AuthConstant.apiRoot + `/Sites/${this.siteId}/BatchesLots/GetRequired`,
        qp,
        { headers: new HttpHeaders().set('Content-Type', 'application/json') });
  }

  get(batchLotId: number, siteId: number): Observable<BatchLot> {
    return this.httpClient.get<BatchLot>(AuthConstant.apiRoot +
        `/Sites/${siteId}/BatchesLots/${batchLotId}`);
  }

  GetBatchesLotsByMaterialWithInventory(siteId: number, materialId: number): Observable<Array<BatchLot>> {
    return this.httpClient.get<Array<BatchLot>>(AuthConstant.apiRoot +
      `/Sites/${siteId}/BatchesLots/Materials/${materialId}/Inventory`);
  }

  /*GetBatchesLotsForUnStoredMaterials(siteId: number, refersTo: number): Observable<Array<BatchLot>> {
    return this.httpClient.get<Array<BatchLot>>(AuthConstant.apiRoot +
      `/Sites/${siteId}/BatchesLots/GetUnStoredMaterials/${refersTo}`);
  }*/

  GetBatchesLotsByMaterialWithInventory_StockTransfer(siteId: number, materialId: number) {
    return this.httpClient.get<Array<BatchLot>>(AuthConstant.apiRoot +
      `/Sites/${siteId}/BatchesLots/Materials/${materialId}/Inventory/StockTransfer`);
  }

  create(model: BatchLot, siteId: number): Observable<BatchLot> {
    return this.httpClient.post<BatchLot>(AuthConstant.apiRoot +
      `/Sites/${siteId}/BatchesLots`,
      model,
      { headers: new HttpHeaders().set('Content-Type', 'application/json') });
  }

  delete(batchLotId: number | undefined, siteId: number | undefined) {
    return this.httpClient.delete(AuthConstant.apiRoot + `/BatchesLots/${batchLotId}/${siteId}`);
  }

  getShelves(batchLot: BatchLot): string {
    return batchLot.itemLabels
      .filter(ss => ss.shelfCode !== null)
      .map(ss => ss.shelfCode)
      .join(', ');
  }

  isStoredAll(batchLot: BatchLot): boolean {
    const blQty = this.getBlQty(batchLot);
    return blQty > 0 && blQty === this.getShelvedQty(batchLot);
  }

  isPartiallyStored(batchLot: BatchLot): boolean {
    const blQty = this.getBlQty(batchLot);
    const ssQty = this.getShelvedQty(batchLot);
    return blQty > 0 && ssQty > 0 && blQty > ssQty;
  }

  isNotStored(batchLot: BatchLot): boolean {
    return this.getBlQty(batchLot) > 0 && this.getShelvedQty(batchLot) === 0;
  }

  isIiAvailable(batchLot: BatchLot): boolean {
    return this.getBlQty(batchLot) > 0;
  }

  avgCost(batchLot: BatchLot) {
    const avg = +(this.getAvgCost(batchLot).toFixed(5));
    return avg > 0 ? avg : 0;
  }

  valueInStock(batchLot: BatchLot) {
    const value = this.getAvgCost(batchLot) * this.getBlQty(batchLot);
    return value > 0
      ? value.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2 })
      : 0;
  }

  inStock(batchLot: BatchLot) {
    return this.getBlQty(batchLot).toLocaleString();
  }

  qtyCommitted(batchLot: BatchLot) {
    return this.getCommittedQty(batchLot).toLocaleString();
  }

  uomToLower(value: string) {
    return value.toLowerCase();
  }

  private getBlQty(batchLot: BatchLot) {
    return batchLot?.inventoryIntels?.reduce((acc, curr) => acc + curr.qty, 0);
  }

  private getShelvedQty(batchLot: BatchLot) {
    return batchLot?.itemLabels
      ?.filter(e => e.shelfCode !== null)
      ?.reduce((acc, curr) => acc + curr.qty, 0);
  }

  getCommittedQty(batchLot: BatchLot) {
    return batchLot?.committed?.reduce((acc, curr) => acc + curr.qty, 0);
  }

  private getAvgCost(batchLot: BatchLot) {
    if (this.getBlQty(batchLot) > 0)
      return batchLot?.pricePerQty;
    return 0;
  }
}
