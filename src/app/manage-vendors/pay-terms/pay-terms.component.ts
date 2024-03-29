import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, SortDirection} from "@angular/material/sort";
import {ActivatedRoute, Router} from "@angular/router";
import {ModalDirective} from "../../shared/modal/modal.directive";
import {ModalService} from "../../shared/modal/modal.service";
import {Operations} from "../../shared/operations";
import {DataTable} from "../../shared/dataTable";
import {BodyDeleteFailedComponent} from "../../shared/body-delete-failed/body-delete-failed.component";
import {PayTerm} from "../../models/pay-term";
import {PayTermsService} from "../../services/pay-terms.service";
import {RolesConstant} from "../../auth/roles-constant";

@Component({
  selector: 'app-pay-terms',
  templateUrl: './pay-terms.component.html'
})
export class PayTermsComponent implements AfterViewInit {
  displayedColumns = ['Name', 'CreateDate', 'CreatedBy', 'LastUpdate', 'UpdatedBy'];
  dataSource: DataTable<PayTerm>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(ModalDirective) modal: ModalDirective;

  constructor(private ptService: PayTermsService,
              private router: Router,
              private route: ActivatedRoute,
              private modalService: ModalService) {
    this.dataSource =
      new DataTable<PayTerm>(this.displayedColumns,
        this.ptService,
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
      case Operations.Create:
        this.router?.navigate(['create'], {
          relativeTo: this.route,
          queryParamsHandling: 'preserve'
        });
        break;
      case Operations.View:
        if (this.dataSource.row)
          this.router?.navigate([this.dataSource.row?.id], {
            relativeTo: this.route,
            queryParamsHandling: 'preserve'
          });
        break;
      case Operations.Edit:
        if (this.dataSource.row)
          this.router?.navigate([this.dataSource.row?.id, 'edit'], {
            relativeTo: this.route,
            queryParamsHandling: 'preserve'
          });
        break;
      case Operations.Delete:
        if (this.dataSource.row) {
          this.modalService.show(this.modal.viewContainerRef, {
            btnSuccess: true,
            successCallback: () => {
              this.dataSource.isLoading.next(true);

              this.ptService.delete(this.dataSource.row?.id)
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
                })
            }
          });
        }
        break;
    }
  }

  protected readonly RolesConstant = RolesConstant;
}
