import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {AuthConstant} from "../auth/auth.constant";
import {QueryParams} from "../models/query-params";
import {DatatableResponse} from "../models/datatable-response";
import {IService} from "../shared/interface/IService";
import {Material} from "../models/material";

@Injectable({providedIn: 'root'})
export class MaterialsService implements IService<Material> {
  material: Material;

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

  getSponMatsByClas_Ven(classificationId: number, vendorId: number): Observable<Material[]> {
    return this.httpClient.get<Material[]>(AuthConstant.apiRoot +
      `/Materials/Classification/${classificationId}/Vendors/${vendorId}/Sponsor`);
  }

  getAllByClassificationId(classificationId: number): Observable<Material[]> {
    return this.httpClient.get<Material[]>(AuthConstant.apiRoot +
      `/Materials/Classification/${classificationId}`);
  }

  get(materialId: number): Observable<Material> {
    return this.httpClient.get<Material>(AuthConstant.apiRoot + `/Materials/${materialId}`);
  }

  create(): Observable<any> {
    return this.httpClient.post<Material>(AuthConstant.apiRoot + '/Materials', this.material, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  edit(): Observable<any> {
    return this.httpClient.put<Material>(AuthConstant.apiRoot + '/Materials', this.material, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  delete(materialId: number | undefined): Observable<any> {
    return this.httpClient.delete(AuthConstant.apiRoot + `/Materials/${materialId}`);
  }

  getMaterialsByVendor(vendorId: number): Observable<Array<Material>> {
    return this.httpClient.get<Material[]>(AuthConstant.apiRoot + `/Materials/Vendors/${vendorId}`);
  }
}
