import {Component, Input, Output} from '@angular/core';
import {SelectListItem} from "../select-list-item";

@Component({
  selector: 'select-search',
  templateUrl: './select-search.component.html',
  styleUrls: ['./select-search.component.css']
})
export class SelectSearchComponent {
  @Input() items: SelectListItem[] = [];
  @Input() placeHolder = '';
  @Input() focus = true;
  @Output() value: string | number = '';

}
