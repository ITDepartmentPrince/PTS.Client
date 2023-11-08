import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {AuthConstant} from "../auth/auth.constant";
import {BatchLot} from "../models/batchLot";
import {IService} from "../shared/interface/IService";
import {QueryParams} from "../models/query-params";
import {DatatableResponse} from "../models/datatable-response";
import {SitesService} from "./sites.service";

@Injectable({providedIn: 'root'})
export class BatchesLotsService implements IService<BatchLot> {
  constructor(private httpClient: HttpClient,
              private siteService: SitesService) { }

  getRequired(qp: QueryParams): Observable<DatatableResponse<BatchLot>> {
    return this.httpClient
      .post<DatatableResponse<BatchLot>>(
        AuthConstant.apiRoot + `/BatchesLots/GetRequired/${this.siteService.localSite}`,
        qp,
        { headers: new HttpHeaders().set('Content-Type', 'application/json') });
  }

  get(batchLotId: number, siteId: number): Observable<BatchLot> {
    return this.httpClient.get<BatchLot>(AuthConstant.apiRoot + `/BatchesLots/${batchLotId}/${siteId}`);
  }

  getAllByMaterial(siteId: number, materialId: number): Observable<Array<BatchLot>> {
    return this.httpClient.get<Array<BatchLot>>(AuthConstant.apiRoot +
      `/BatchesLots/${siteId}/Materials/${materialId}`);
  }

  getUnStoredMaterials(siteId: number): Observable<Array<BatchLot>> {
    return this.httpClient.get<Array<BatchLot>>(AuthConstant.apiRoot +
      `/BatchesLots/GetUnStoredMaterials/${siteId}`);
  }

  create(model: BatchLot): Observable<BatchLot> {
    return this.httpClient.post<BatchLot>(AuthConstant.apiRoot + '/BatchesLots', model, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  getShelves(batchLot: BatchLot): string {
    return batchLot.shelfStorage
      .map(ss => ss.shelfCode)
      .join(', ');
  }

  isStoredAll(batchLot: BatchLot): boolean {
    const blQty = this.getBlQty(batchLot);
    return blQty > 0 && blQty === this.getSsQty(batchLot);
  }

  isPartiallyStored(batchLot: BatchLot): boolean {
    const blQty = this.getBlQty(batchLot);
    const ssQty = this.getSsQty(batchLot);
    return blQty > 0 && ssQty > 0 && blQty > ssQty;
  }

  isNotStored(batchLot: BatchLot): boolean {
    return this.getBlQty(batchLot) > 0 && this.getSsQty(batchLot) === 0;
  }

  isIiAvailable(batchLot: BatchLot): boolean {
    return batchLot.inventoryIntels?.length > 0;
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

  uomToLower(value: string) {
    return value.toLowerCase();
  }

  private getBlQty(batchLot: BatchLot) {
    return batchLot?.inventoryIntels?.reduce((acc, curr) => acc + curr.qty, 0);
  }

  private getSsQty(batchLot: BatchLot) {
    return batchLot?.shelfStorage?.reduce((acc, curr) => acc + curr.qty, 0);
  }

  private getAvgCost(batchLot: BatchLot) {
    return +(batchLot?.inventoryIntels?.reduce((acc, curr) => acc + curr.pricePerQty, 0)
      / batchLot?.inventoryIntels?.filter(ii => ii.qty > 0).length);
  }
}
