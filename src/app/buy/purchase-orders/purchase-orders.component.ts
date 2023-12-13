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
import {BodyNotesComponent} from "../../shared/body-notes/body-notes.component";

export enum PoStatus {
  Approved = 1,
  Disapproved = 2,
  ExecApproved = 3,
}

@Component({
  selector: 'app-purchase-orders',
  templateUrl: './purchase-orders.component.html'
})
export class PurchaseOrdersComponent implements AfterViewInit {
  protected readonly AuthPolicy = AuthPolicy;
  displayedColumns = ['CreateDate', 'PoNumber', 'CompanyName', 'TotalPurchaseValue', 'PrNumber',
    'DeliveryDate', 'Status'];
  dataSource: DataTable<PurchaseOrder>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(ModalDirective) modal: ModalDirective;
  poStatus = PoStatus;
  deliveryColHeader: string;
  jsonData = {
    value: ''
  };

  constructor(private poService: PurchaseOrdersService,
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
        this.poService,
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
            btnSuccess: true,
            successCallback: () => {
              this.dataSource.isLoading.next(true);

              this.poService.delete(this.dataSource.row?.poNumber)
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

  onPoStatusChange(po: PurchaseOrder, poStatus: PoStatus) {
    this.modalService.show(this.modal.viewContainerRef, {
      btnSuccess: true,
      successCallback: (form) => {
        this.dataSource.isLoading.next(true);

        switch (poStatus) {
          case PoStatus.Approved:
            this.poService.approvePo(po, form.value.notes)
              .subscribe({
                next: _ => {
                  this.dataSource.loadData();
                  this.dataSource.row = null;
                },
                error: _ => {this.dataSource.isLoading.next(false);},
              });
            break;
          case PoStatus.Disapproved:
            this.poService.disApprovePo(po, form.value.notes)
              .subscribe({
                next: _ => {
                  this.dataSource.loadData();
                  this.dataSource.row = null;
                },
                error: _ => {this.dataSource.isLoading.next(false);},
              });
            break;
          case PoStatus.ExecApproved:
            this.poService.execApprovePo(po, form.value.notes)
              .subscribe({
                next: _ => {
                  this.dataSource.loadData();
                  this.dataSource.row = null;
                },
                error: _ => {this.dataSource.isLoading.next(false);},
              });
            break;
        }
      }
    }, BodyNotesComponent);
  }
}
