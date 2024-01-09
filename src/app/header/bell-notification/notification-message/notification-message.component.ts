import {Component, Input, ViewChild} from '@angular/core';
import {UserNotification} from "../../../models/notification";
import {UserNotesComponent} from "../user-notes/user-notes.component";
import {ModalService} from "../../../shared/modal/modal.service";
import {ModalDirective} from "../../../shared/modal/modal.directive";

@Component({
  selector: 'notification-message',
  templateUrl: './notification-message.component.html'
})
export class NotificationMessageComponent {
  @Input() userNotification: UserNotification;
  @ViewChild(ModalDirective) modal: ModalDirective;

  constructor(private modalService: ModalService) {
  }

  onViewNotes(event: MouseEvent, notes: string) {
    event.preventDefault();
    event.stopPropagation();

    this.modalService.show(this.modal.viewContainerRef,
      {
        title: 'User notes',
        btnSuccess: false,
        btnClose: true,
        appendTo: 'body'
      },
      UserNotesComponent,
      {
        notes: notes
      });
  }
}
