import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {AuthConstant} from "../auth/auth.constant";
import {QueryParams} from "../models/query-params";
import {DatatableResponse} from "../models/datatable-response";
import {IService} from "../shared/interface/IService";
import {Material, MaterialRefsList} from "../models/material";

@Injectable({providedIn: 'root'})
export class MaterialsService implements IService<Material> {
  constructor(private httpClient: HttpClient) { }

  getRequired(queryParams: QueryParams): Observable<DatatableResponse<Material>> {
    return this.httpClient
      .post<DatatableResponse<Material>>(AuthConstant.apiRoot + '/Materials/GetRequired', queryParams, {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      });
  }

  getAll(): Observable<Material[]> {
    return this.httpClient.get<Material[]>(AuthConstant.apiRoot + `/Materials`);
  }

  getAllByClassificationIdAndVendorId(classificationId: number, vendorId: number): Observable<Material[]> {
    return this.httpClient.get<Material[]>(AuthConstant.apiRoot +
      `/Materials/Classification/${classificationId}/Vendors/${vendorId}`);
  }

  getAllByClassificationId(classificationId: number): Observable<Material[]> {
    return this.httpClient.get<Material[]>(AuthConstant.apiRoot +
      `/Materials/Classification/${classificationId}`);
  }

  getRefsList(): Observable<MaterialRefsList> {
    return this.httpClient.get<MaterialRefsList>(AuthConstant.apiRoot + `/Materials/GetMaterialRefsList`);
  }

  get(materialId: number): Observable<Material> {
    return this.httpClient.get<Material>(AuthConstant.apiRoot + `/Materials/${materialId}`);
  }

  create(model: Material): Observable<any> {
    return this.httpClient.post<Material>(AuthConstant.apiRoot + '/Materials', model, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  edit(model: Material): Observable<any> {
    return this.httpClient.put<Material>(AuthConstant.apiRoot + '/Materials', model, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  delete(materialId: number | undefined): Observable<any> {
    return this.httpClient.delete(AuthConstant.apiRoot + `/Materials/${materialId}`);
  }
}
