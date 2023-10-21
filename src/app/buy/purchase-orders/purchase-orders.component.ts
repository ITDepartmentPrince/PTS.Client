import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';
import {DataTable} from "../../shared/dataTable";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, SortDirection} from "@angular/material/sort";
import {ModalDirective} from "../../shared/modal/modal.directive";
import {ActivatedRoute, Router} from "@angular/router";
import {ModalService} from "../../shared/modal/modal.service";
import {Operations} from "../../shared/operations";
import {BodyDeleteFailedComponent} from "../../shared/body-delete-failed/body-delete-failed.component";
import {AuthPolicy} from "../../auth/auth-policy";
import {PurchaseOrder} from "../../models/purchase-order";
import {PurchaseOrdersService} from "../../services/purchase-orders.service";

@Component({
  selector: 'app-purchase-orders',
  templateUrl: './purchase-orders.component.html'
})
export class PurchaseOrdersComponent implements AfterViewInit {
  protected readonly AuthPolicy = AuthPolicy;
  displayedColumns = ['CreateDate', 'PoNumber', 'Status'];
  dataSource: DataTable<PurchaseOrder>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(ModalDirective) modal: ModalDirective;
  deliveryColHeader: string;
  jsonData = {
    value: ''
  };

  constructor(private purchaseOrdersService: PurchaseOrdersService,
              private router: Router,
              private route: ActivatedRoute,
              private modalService: ModalService) {
    if (this.route.snapshot.url[0].path === 'done') {
      this.jsonData.value = 'Done';
      this.deliveryColHeader = 'Delivered date';
    }
    else {
      this.jsonData.value = 'Open';
      this.deliveryColHeader = 'Expected arrival';
    }

    this.dataSource =
      new DataTable<PurchaseOrder>(this.displayedColumns,
        this.purchaseOrdersService,
        this.router,
        this.route,
        JSON.stringify(this.jsonData));
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
      case Operations.Delete:
        if (this.dataSource.row) {
          this.modalService.show(this.modal.viewContainerRef, {
            successCallback: () => {
              this.dataSource.isLoading.next(true);

              this.purchaseOrdersService.delete(this.dataSource.row?.poNumber)
                .subscribe({
                  next: _ => {
                    this.dataSource.loadData();
                    this.dataSource.row = null;
                  },
                  error: _ => {
                    this.modalService.show(this.modal.viewContainerRef,
                      {btnSuccess: true},
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
}
