import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';
import {DataTable} from "../../../shared/dataTable";
import {PurchaseReq} from "../../../models/purchase-req";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, SortDirection} from "@angular/material/sort";
import {ModalDirective} from "../../../shared/modal/modal.directive";
import {ActivatedRoute, Router} from "@angular/router";
import {Operations} from "../../../shared/operations";
import {PrDurationService} from "../../../services/pr-duration.service";

@Component({
  selector: 'app-new-pr-duration',
  templateUrl: './new-pr-duration.component.html'
})
export class NewPrDurationComponent implements AfterViewInit {
  displayedColumns = ['CreateDate', 'PrNumber', 'CreatedBy', 'Duration'];
  dataSource: DataTable<PurchaseReq>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(ModalDirective) modal: ModalDirective;

  constructor(private prDurationService: PrDurationService,
              private router: Router,
              protected route: ActivatedRoute) {

    this.dataSource =
      new DataTable<PurchaseReq>(this.displayedColumns,
        this.prDurationService,
        this.router,
        this.route);
  }

  @Input()
  set pageIndex(index: number) {
    this.dataSource.pageIndex = index;
  }

  @Input()
  set pageOrder(value: SortDirection) {
    this.dataSource.pageOrder = value;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.init();
  }

  onOperate(operation: Operations) {
    switch (operation) {
      case Operations.View:
        if (this.dataSource.row)
          this.router?.navigate(['purchase-requisitions', this.dataSource.row?.prNumber], {
            queryParamsHandling: 'preserve'
          });
        break;
    }
  }

  getDuration(row: PurchaseReq) {
    const diff = this.getDataDiff(new Date(row.start as Date), new Date(row.end as Date))
    return `${diff.minute} min, ${diff.second} sec`;
  }

  private getDataDiff(startDate: Date, endDate: Date) {
    const diff = endDate.getTime() - startDate.getTime();
    const days = Math.floor(diff / (60 * 60 * 24 * 1000));
    const hours = Math.floor(diff / (60 * 60 * 1000)) - (days * 24);
    const minutes = Math.floor(diff / (60 * 1000)) - ((days * 24 * 60) + (hours * 60));
    const seconds = Math.floor(diff / 1000) - ((days * 24 * 60 * 60) + (hours * 60 * 60) + (minutes * 60));
    return { day: days, hour: hours, minute: minutes, second: seconds };
  }
}
