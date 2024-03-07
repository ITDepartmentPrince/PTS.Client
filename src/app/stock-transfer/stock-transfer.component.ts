import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataTable} from "../shared/dataTable";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, SortDirection} from "@angular/material/sort";
import {ModalDirective} from "../shared/modal/modal.directive";
import {ActivatedRoute, Router} from "@angular/router";
import {ModalService} from "../shared/modal/modal.service";
import {Operations} from "../shared/operations";
import {BodyDeleteFailedComponent} from "../shared/body-delete-failed/body-delete-failed.component";
import {Subscription} from "rxjs";
import {StockTransfer} from "../models/stock-transfer";
import {StockTransferService} from "../services/stock-transfer-service";
import {PrintLabelsService} from "../print-labels/print-labels.service";
import {RolesConstant} from "../auth/roles-constant";

@Component({
  selector: 'app-stock-transfer',
  templateUrl: './stock-transfer.component.html'
})
export class StockTransferComponent implements OnInit, AfterViewInit, OnDestroy {
  displayedColumns = ['Number', 'CreateDate', 'OriginSite', 'DestinationSite', 'Status'];
  dataSource: DataTable<StockTransfer>;
  sub: Subscription;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(ModalDirective) modal: ModalDirective;

  constructor(public stService: StockTransferService,
              public router: Router,
              private route: ActivatedRoute,
              private modalService: ModalService,
              private printLabelsService: PrintLabelsService) {

    this.dataSource =
      new DataTable<StockTransfer>(this.displayedColumns,
        this.stService,
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

  ngOnInit(): void {
    /*this.sub = this.stockTransferService.receiveStatusChanged
      .subscribe(_ => this.dataSource.loadData());*/
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.init();
  }

  ngOnDestroy(): void {
    // this.sub.unsubscribe();
  }

  onOperate(operation: Operations) {
    switch (operation) {
      case Operations.Create:
        this.router?.navigate(['stock-transfer', 'create'], {
          queryParamsHandling: 'preserve'
        });
        break;
      case Operations.View:
        if (this.dataSource.row)
          this.router?.navigate(['stock-transfer', this.dataSource.row?.number], {
            queryParamsHandling: 'preserve'
          });
        break;
      case Operations.Edit:
        if (this.dataSource.row)
          this.router?.navigate(['stock-transfer', this.dataSource.row?.number, 'edit'], {
            queryParamsHandling: 'preserve'
          });
        break;
      case Operations.Delete:
        if (this.dataSource.row) {
          this.modalService.show(this.modal.viewContainerRef, {
            btnSuccess: true,
            successCallback: () => {
              this.dataSource.isLoading.next(true);

              this.stService.delete(this.dataSource.row?.number)
                .subscribe({
                  next: _ => {
                    this.dataSource.loadData();
                    this.dataSource.row = null;
                  },
                  error: _ => {
                    this.modalService.show(this.modal.viewContainerRef,
                      {btnSuccess: false},
                      BodyDeleteFailedComponent);

                    this.dataSource.isLoading.next(false);
                  }
                });
            }
          });
        }
        break;
    }
  }

  onShipped(stockTransfer: StockTransfer) {
    this.stService.shipped(stockTransfer.number)
      .subscribe(res => {
        this.dataSource.isLoading.next(true);
        this.dataSource.loadData();
        this.dataSource.row = null;

        this.printLabelsService.data = res;
        this.printLabelsService.printDocument('items-label');
      });
  }

  protected readonly RolesConstant = RolesConstant;
}
