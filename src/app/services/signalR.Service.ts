import * as signalR from "@microsoft/signalr";
import {EventEmitter, Injectable} from "@angular/core";
import {AuthConstant} from "../auth/auth.constant";

@Injectable({providedIn: "root"})
export class SignalRService {
  private hubConnection: signalR.HubConnection;
  onNotified = new EventEmitter<void>();

  startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(AuthConstant.apiSignalRConn)
      .build();

    this.hubConnection
      .start()
      .catch(error => console.log(error));
  }

  getServerNotification() {
    return this.hubConnection.on('NotifyClient', () => {
      this.onNotified.emit();
    });
  }
}
