import {AfterViewInit, Component, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {DataTable} from "../shared/dataTable";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, SortDirection} from "@angular/material/sort";
import {ModalDirective} from "../shared/modal/modal.directive";
import {ActivatedRoute, Router} from "@angular/router";
import {ModalService} from "../shared/modal/modal.service";
import {Operations} from "../shared/operations";
import {BodyDeleteFailedComponent} from "../shared/body-delete-failed/body-delete-failed.component";
import {AuthPolicy} from "../auth/auth-policy";
import {Receiving, ReceivingStatus} from "../models/receiving";
import {ReceivingForSiteService} from "../services/receiving-for-site.service";
import {SourceType} from "../shared/source-type";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-receiving',
  templateUrl: './receiving.component.html'
})
export class ReceivingComponent implements OnInit, AfterViewInit, OnDestroy {
  protected readonly SourceType = SourceType;
  protected readonly AuthPolicy = AuthPolicy;
  protected readonly ReceivingStatus = ReceivingStatus;
  displayedColumns = ['CreateDate', 'RoNumber', 'CompanyName', 'ClassificationName', 'SourceType', 'Status'];
  dataSource: DataTable<Receiving>;
  sub: Subscription;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(ModalDirective) modal: ModalDirective;
  jsonData = {
    value: '',
    siteId: 0
  };

  constructor(public rfsService: ReceivingForSiteService,
              public router: Router,
              private route: ActivatedRoute,
              private modalService: ModalService) {
    if (this.route.snapshot.url[0].path === 'done') {
      this.jsonData.value = 'Done';
    }
    else {
      this.jsonData.value = 'Open';
      this.displayedColumns.splice(5, 0, 'DeliveryDate');
    }

    this.jsonData.siteId = 1; // get siteId from cookie;

    this.dataSource =
      new DataTable<Receiving>(this.displayedColumns,
        this.rfsService,
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

  ngOnInit(): void {
    this.sub = this.rfsService.receiveStatusChanged
      .subscribe(_ => this.dataSource.loadData());
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.dataSource.init();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  onOperate(operation: Operations) {
    switch (operation) {
      case Operations.Create:
        this.router?.navigate(['receiving', 'sponsor', 'create'], {
          queryParamsHandling: 'preserve'
        });
        break;
      case Operations.View:
        if (this.dataSource.row)
          this.router?.navigate(['receiving', this.dataSource.row?.roNumber], {
            queryParamsHandling: 'preserve'
          });
        break;
      case Operations.Edit:
        if (this.dataSource.row)
          this.router?.navigate(['receiving', this.dataSource.row?.roNumber, 'edit'], {
            queryParamsHandling: 'preserve'
          });
        break;
      case Operations.Delete:
        if (this.dataSource.row) {
          this.modalService.show(this.modal.viewContainerRef, {
            btnSuccess: true,
            successCallback: () => {
              this.dataSource.isLoading.next(true);

              this.rfsService.delete(this.dataSource.row?.roNumber)
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
}
