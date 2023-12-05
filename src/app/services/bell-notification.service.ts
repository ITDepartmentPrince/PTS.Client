import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, Subject} from "rxjs";
import {AuthConstant} from "../auth/auth.constant";
import {UserNotification} from "../models/notification";

@Injectable({providedIn: 'root'})
export class BellNotificationService {
  notificationRead = new Subject<void>;

  constructor(private httpClient: HttpClient) { }

  getAllUnRead(): Observable<Array<UserNotification>> {
    return this.httpClient.get<Array<UserNotification>>(
      AuthConstant.apiRoot + `/UserNotification/GetAllUnRead`);
  }

  read(notificationId: number): Observable<any> {
    return this.httpClient.put(AuthConstant.apiRoot + `/UserNotification/Read/${notificationId}`,
      {},
      { headers: new HttpHeaders().set('Content-Type', 'application/json') });
  }

  getUnReadCount(): Observable<number> {
    return this.httpClient.get<number>(AuthConstant.apiRoot + `/UserNotification/GetUnReadCount`);
  }
}
