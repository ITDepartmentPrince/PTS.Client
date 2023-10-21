import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {ISearchColumns} from "../interface/ISearchColumns";

@Component({
  selector: 'app-search-builder',
  templateUrl: './search-builder.component.html',
  styleUrls: ['./search-builder.component.css'],
})
export class SearchBuilderComponent {
  @Input() columns: string[] = [];
  conditions = ['Equals', 'Contains', 'Starts With', 'Ends With'];
  searchColumns: ISearchColumns[] = [{ column: '', condition: '', value: '' }];
  @ViewChild('dropdownMenu') dropdownMenu: ElementRef;
  @Output() columnsSearched = new EventEmitter<ISearchColumns[]>();

  addSearchColumn() {
    this.searchColumns.push({ column: '', condition: '', value: '' });
  }

  removeSearchColumn(index: number) {
    if (this.searchColumns.length > 1)
      this.searchColumns.splice(index, 1);
  }

  onSearch() {
    this.columnsSearched.emit(this.searchColumns.splice(0));
    this.searchColumns.push({ column: '', condition: '', value: '' });
    this.dropdownMenu.nativeElement.classList.remove('show');
  }
}
