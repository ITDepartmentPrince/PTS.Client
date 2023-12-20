import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable} from "rxjs";
import {ShelfStorage} from "../models/shelfStorage";
import {AuthConstant} from "../auth/auth.constant";
import {SitesService} from "./sites.service";

@Injectable()
export class ShelfStorageService {
  shelfStorage: Array<ShelfStorage>;
  toAddShelfStorage: Array<ShelfStorage> = new Array<ShelfStorage>();
  shelfCode: string;

  constructor(private httpClient: HttpClient,
              private siteService: SitesService) {
  }

  create(): Observable<any> | null {
    if (this.toAddShelfStorage.length === 0)
      return null;

    return this.httpClient.post<ShelfStorage>(AuthConstant.apiRoot + '/ShelfStorage',
      this.toAddShelfStorage, {
      headers: new HttpHeaders().set('Content-Type', 'application/json')
    });
  }
}
