import {Directive, HostBinding, HostListener} from '@angular/core';

@Directive({
  selector: '[appSidebar]'
})
export class SidebarDirective {
  @HostBinding('class.show') isShown = false;
  @HostListener('document:click', ['$event']) toggleOpen(event: Event) {
    this.isShown = (event.target as HTMLElement).closest('.btn-sidebar')
      ? !this.isShown
      : false;
  }
}
