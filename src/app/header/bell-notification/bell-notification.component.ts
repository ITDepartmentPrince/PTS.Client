import {Component, OnInit} from '@angular/core';
import {BellNotificationService} from "../../services/bell-notification.service";
import {PushNotificationType, UserNotification} from "../../models/notification";
import {Router} from "@angular/router";

@Component({
  selector: 'app-bell-notification',
  templateUrl: './bell-notification.component.html'
})
export class BellNotificationComponent implements OnInit {
  protected readonly PushNotificationType = PushNotificationType;
  userNotifications: Array<UserNotification>;
  isLoading = true;

  constructor(public bnService: BellNotificationService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.bnService.getAllUnRead()
      .subscribe(res => {
        this.userNotifications = res;
        this.isLoading = false;
      });
  }

  OnRead(userNotification: UserNotification) {
    switch (userNotification.notification.notificationType) {
      case PushNotificationType.PrCreated:
      case PushNotificationType.PrUpdated:
      case PushNotificationType.PrDisApproved:
        this.read(userNotification);
        this.router?.navigate(['purchase-requisitions', userNotification.notification.prNumber]);
        break;
      case PushNotificationType.PoCreated:
      case PushNotificationType.PoUpdated:
      case PushNotificationType.PoDisApproved:
      case PushNotificationType.PoValueExceeded:
        this.read(userNotification);
        this.router?.navigate(['purchase-orders']);
        break;
    }
  }

  private read(userNotification: UserNotification) {
    if (!userNotification.isRead)
      this.bnService
        .read(userNotification.notificationId)
        .subscribe(_ => this.bnService.notificationRead.next());
  }
}
