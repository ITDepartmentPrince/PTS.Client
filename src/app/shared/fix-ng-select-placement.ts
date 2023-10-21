import {NgSelectComponent} from "@ng-select/ng-select";

export class FixNgSelectPlacement {
  static onOpen(el: NgSelectComponent) {
    setTimeout(() => {
      const ngDropdownPanel = document.querySelector('.ng-dropdown-panel') as any;
      ngDropdownPanel.style.width = el.element.clientWidth + 'px';
      ngDropdownPanel.style.left = el.element.getBoundingClientRect().left + 'px';
    }, 0);
  }
}
