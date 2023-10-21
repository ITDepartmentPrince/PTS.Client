import {Observable} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {AuthConstant} from "../auth/auth.constant";
import {QueryParams} from "../models/query-params";
import {DatatableResponse} from "../models/datatable-response";
import {IService} from "../shared/interface/IService";
import {VendorContact} from "../models/vendor-contact";

@Injectable({providedIn: 'root'})
export class VendorContactsService implements IService<VendorContact> {
  constructor(private httpClient: HttpClient) { }

  getRequired(queryParams: QueryParams): Observable<DatatableResponse<VendorContact>> {
    return this.httpClient
      .post<DatatableResponse<VendorContact>>(AuthConstant.apiRoot + '/VendorContacts/GetRequired', queryParams, {
        headers: new HttpHeaders().set('Content-Type', 'application/json')
      });
  }

  getAll(): Observable<VendorContact[]> {
    return this.httpClient.get<VendorContact[]>(AuthConstant.apiRoot + `/VendorContacts`);
  }

  get(contactId: number): Observable<VendorContact> {
    return this.httpClient.get<VendorContact>(AuthConstant.apiRoot + `/VendorContacts/${contactId}`);
  }

  create(model: VendorContact): Observable<any> {
    return this.httpClient.post<VendorContact>(AuthConstant.apiRoot + '/VendorContacts', model, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  edit(model: VendorContact): Observable<any> {
    return this.httpClient.put<VendorContact>(AuthConstant.apiRoot + '/VendorContacts', model, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }

  delete(contactId: number | undefined): Observable<any> {
    return this.httpClient.delete(AuthConstant.apiRoot + `/VendorContacts/${contactId}`);
  }

  getContactsByVendorId(vendorId: number): Observable<VendorContact[]> {
    return this.httpClient.get<VendorContact[]>(
      AuthConstant.apiRoot + `/VendorContacts/GetContactsByVendorId/${vendorId}`);
  }
}
