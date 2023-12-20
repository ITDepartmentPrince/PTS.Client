import {Component, OnInit, ViewChild} from '@angular/core';
import {BellNotificationService} from "../../services/bell-notification.service";
import {PushNotificationType, UserNotification} from "../../models/notification";
import {ModalService} from "../../shared/modal/modal.service";
import {ModalDirective} from "../../shared/modal/modal.directive";
import {UserNotesComponent} from "./user-notes/user-notes.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-bell-notification',
  templateUrl: './bell-notification.component.html'
})
export class BellNotificationComponent implements OnInit {
  protected readonly PushNotificationType = PushNotificationType;
  userNotifications: Array<UserNotification>;
  isLoading = true;
  @ViewChild(ModalDirective) modal: ModalDirective;

  constructor(public bnService: BellNotificationService,
              private modalService: ModalService,
              private router: Router) {
  }

  ngOnInit(): void {
    this.bnService.getAllUnRead()
      .subscribe(res => {
        this.userNotifications = res;
        this.isLoading = false;
      });
  }

  onViewNotes(event: MouseEvent, notes: string) {
    event.preventDefault();
    event.stopPropagation();

    this.modalService.show(this.modal.viewContainerRef, {
      title: 'User notes',
      btnSuccess: false,
      btnClose: true,
      appendTo: 'body'
    }, UserNotesComponent,
      { notes: notes });
  }

  OnRead(userNotification: UserNotification) {
    switch (userNotification.notification.notificationType) {
      case PushNotificationType.PrCreated:
      case PushNotificationType.PrUpdated:
        if (!userNotification.isRead)
          this.bnService.read(userNotification.notificationId)
            .subscribe(_ =>
              this.bnService.notificationRead.next());
        this.router?.navigate(['purchase-requisitions', userNotification.notification.prNumber]);
        break;
      case PushNotificationType.PoCreated:
        if (!userNotification.isRead)
          this.bnService.read(userNotification.notificationId)
            .subscribe(_ =>
              this.bnService.notificationRead.next());
        this.router?.navigate(['purchase-orders']);
        break;
    }
  }
}
