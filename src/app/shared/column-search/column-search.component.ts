import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {ISearch} from "../interface/ISearch";

@Component({
  selector: 'app-column-search',
  templateUrl: './column-search.component.html',
  styleUrls: ['./column-search.component.css']
})
export class ColumnSearchComponent {
  @Input() value = '';
  @Input() type = 'text';
  @Input() column: string;
  @Output() search = new EventEmitter<ISearch>();
  @ViewChild('columnSearchInput') columnSearchInput: ElementRef

  onShow() {
    this.columnSearchInput.nativeElement.focus();
    this.columnSearchInput.nativeElement.select();
  }

  onInput() {
    this.search.emit({
      column: this.column,
      value: this.columnSearchInput.nativeElement.value
    });
  }

  onBackspaceKeydown(event: Event) {
    event.stopImmediatePropagation();
    document.getElementById('search-input')?.focus();
  }
}
