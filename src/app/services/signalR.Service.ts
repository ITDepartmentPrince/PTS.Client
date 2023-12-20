import * as signalR from "@microsoft/signalr";
import {EventEmitter, Injectable} from "@angular/core";

@Injectable({providedIn: "root"})
export class SignalRService {
  private hubConnection: signalR.HubConnection;
  onNotified = new EventEmitter<void>();

  startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7230/notification')
      .build();

    this.hubConnection
      .start()
      .then(_ => console.log('SignalR connection started.'))
      .catch(error => console.log(error));
  }

  getServerNotification() {
    return this.hubConnection.on('NotifyClient', () => {
      this.onNotified.emit();
    });
  }
}
