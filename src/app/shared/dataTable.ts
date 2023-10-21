import {DataSource, SelectionModel} from "@angular/cdk/collections";
import {BehaviorSubject, Observable, Subscription} from "rxjs";
import {MatSort, SortDirection} from "@angular/material/sort";
import {ISearch} from "./interface/ISearch";
import {MatPaginator} from "@angular/material/paginator";
import {QueryParams} from "../models/query-params";
import {ActivatedRoute, Router} from "@angular/router";
import {IService} from "./interface/IService";

export class DataTable<T> implements DataSource<T> {
  private data = new BehaviorSubject<T[]>([]);
  private _row: T | null;
  private loading = new BehaviorSubject<boolean>(true);
  private subPage: Subscription;
  private subSort: Subscription;
  private subDataReq: Subscription;
  private _selection: SelectionModel<T>;
  private _paginator: MatPaginator;
  private startIndex: number;
  private _sort: MatSort;
  private startOrder: SortDirection;
  private _search: ISearch = {column: '', value: ''};

  constructor(private columns: string[],
              private service: IService<T>,
              private router: Router,
              private route: ActivatedRoute,
              private jsonData?: string) {
  }

  set paginator(paginator: MatPaginator) {
    this._paginator = paginator;

    this.subPage = this._paginator.page.subscribe(_ => {
      this.loading.next(true);
      this._row = null;

      this.router?.navigate([], {
        relativeTo: this.route,
        queryParams: {pageIndex: this._paginator.pageIndex},
        queryParamsHandling: 'merge'
      });

      this.loadData();
    });
  }

  set sort(sort: MatSort) {
    this._sort = sort;

    this.subSort = this._sort.sortChange.subscribe(_ => {
      this.loading.next(true);
      this._row = null;

      this.router?.navigate([], {
        relativeTo: this.route,
        queryParams: {pageOrder: this.startOrder = this._sort.direction},
        queryParamsHandling: 'merge'});

      this.loadData();
    });
  }

  get search() {
    return this._search;
  }

  get selection() {
    return this._selection;
  }

  get pageIndex() {
    return this.startIndex;
  }

  set pageIndex(index: number) {
    this.startIndex = !index ? 0 : index;
  }

  get pageOrder() {
    return this.startOrder;
  }

  set pageOrder(value: SortDirection) {
    this.startOrder = !value ? 'asc' : value;
  }

  get row() {
    return this._row;
  }

  set row(value: T | null) {
    this._row = value;
  }

  get isLoading() {
    return this.loading;
  }

  connect(): Observable<T[]> {
    return this.data.asObservable();
  }

  disconnect(): void {
    this.data.complete();
    this.loading.complete();
    this.subPage.unsubscribe();
    this.subSort.unsubscribe();
    this.subDataReq.unsubscribe();
  }

  init() {
    this._sort.disableClear = true;
    this._selection = new SelectionModel<T>(false, []);
    this.loadData();
  }

  onSearch(event: ISearch) {
    this.loading.next(true);
    this._search = event;
    this._paginator.pageIndex = 0;
    this._row = null;
    this.router?.navigate([], {
      relativeTo: this.route,
      queryParams: {pageIndex: this._paginator.pageIndex},
      queryParamsHandling: 'merge'
    });
    this.loadData();
  }

  onRowSelect(row: T) {
    if (this._selection.isSelected(row)) {
      // this._selection.clear();
      this._row = null;
    }
    else {
      this._row = row;
    }

    this._selection.toggle(row);
  }

  loadData() {
    const qp = new QueryParams(
      this._paginator.pageSize,
      this._paginator.pageSize * this._paginator.pageIndex,
      this.startOrder,
      this._sort.active ?? this.columns[0],
      this.search.column.length === 0 ? this.columns[0] : this.search.column,
      this.search.value);

    if (this.jsonData)
      qp.jsonData = this.jsonData;

    this.subDataReq = this.service.getRequired(qp)
      .subscribe({
        next: res => {
          this._paginator.length = res.recordsFiltered;
          this.data.next(res.data);
          this.loading.next(false);
        },
        error: _ => {
          this.loading.next(false);
        }
      });
  }
}
