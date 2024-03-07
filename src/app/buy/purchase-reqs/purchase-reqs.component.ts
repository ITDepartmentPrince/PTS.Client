import {AfterViewInit, Component, Input, ViewChild} from '@angular/core';
import {DataTable} from "../../shared/dataTable";
import {PurchaseReq} from "../../models/purchase-req";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort, SortDirection} from "@angular/material/sort";
import {ModalDirective} from "../../shared/modal/modal.directive";
import {PurchaseReqsService} from "../../services/purchase-reqs.service";
import {ActivatedRoute, Router} from "@angular/router";
import {ModalService} from "../../shared/modal/modal.service";
import {Operations} from "../../shared/operations";
import {BodyDeleteFailedComponent} from "../../shared/body-delete-failed/body-delete-failed.component";
import {BodyNotesComponent} from "../../shared/body-notes/body-notes.component";
import {AuthPolicy} from "../../auth/auth-policy";
import {ComponentToStringService} from "../../services/component-to-string.service";
import {PurchaseDocComponent} from "../purchase-doc/purchase-doc/purchase-doc.component";
import {jsPDF} from "jspdf";
import {map, mergeMap, of} from "rxjs";
import {UserService} from "../../services/user.service";
import {RolesConstant} from "../../auth/roles-constant";

export enum PrStatus {
  Submitted = 1,
  Approved = 2,
  Disapproved = 3,
}

@Component({
  selector: 'app-purchase-reqs',
  templateUrl: './purchase-reqs.component.html'
})
export class PurchaseReqsComponent implements AfterViewInit {
  protected readonly AuthPolicy = AuthPolicy;
  displayedColumns = ['CreateDate', 'PrNumber', 'CompanyName', 'TotalPurchaseValue',
    'DeliveryDate', 'Status'];
  dataSource: DataTable<PurchaseReq>;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(ModalDirective) modal: ModalDirective;
  deliveryColHeader: string;
  prStatus = PrStatus;
  jsonData = {
    value: ''
  };

  constructor(private purchaseReqsService: PurchaseReqsService,
              private router: Router,
              protected route: ActivatedRoute,
              private modalService: ModalService,
              private comToStrService: ComponentToStringService,
              private userService: UserService) {
    if (this.route.snapshot.url[0].path === 'done') {
      this.jsonData.value = 'Done';
      this.deliveryColHeader = 'Delivered date';
    }
    else {
      this.jsonData.value = 'Open';
      this.deliveryColHeader = 'Expected arrival';
    }

    this.dataSource =
      new DataTable<PurchaseReq>(this.displayedColumns,
        this.purchaseReqsService,
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
      case Operations.Create:
        this.router?.navigate(['purchase-requisitions', 'create'], {
          queryParamsHandling: 'preserve'
        });
        break;
      case Operations.View:
        if (this.dataSource.row)
          this.router?.navigate(['purchase-requisitions', this.dataSource.row?.prNumber], {
            queryParamsHandling: 'preserve'
          });
        break;
      case Operations.Edit:
        if (this.dataSource.row)
          this.router?.navigate(['purchase-requisitions', this.dataSource.row?.prNumber, 'edit'], {
            queryParamsHandling: 'preserve'
          });
        break;
      case Operations.Delete:
        if (this.dataSource.row) {
          this.modalService.show(this.modal.viewContainerRef, {
            btnSuccess: true,
            successCallback: () => {
              this.dataSource.isLoading.next(true);

              this.purchaseReqsService.delete(this.dataSource.row?.prNumber)
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

  onPrStatusChange(row: PurchaseReq, status: PrStatus) {
    if (status === PrStatus.Submitted) {
      this.modalService.show(this.modal.viewContainerRef, {
        btnSuccess: true,
        successCallback: (form) => {
          this.dataSource.isLoading.next(true);

          this.purchaseReqsService.submitPr(row.prNumber, form.value.notes)
            .subscribe({
              next: _ => {
                row.isSubmitted = !row.isSubmitted;
                this.dataSource.isLoading.next(false);
              },
              error: _ => {this.dataSource.isLoading.next(false);},
            });
        }
      }, BodyNotesComponent);
    }

    if (status === PrStatus.Approved) {
      this.modalService.show(this.modal.viewContainerRef, {
        btnSuccess: true,
        successCallback: (form) => {
          this.dataSource.isLoading.next(true);

          this.purchaseReqsService.approvePr(row.prNumber, form.value.notes)
            .subscribe({
              next: _ => {
                this.dataSource.loadData();
                this.dataSource.row = null;
              },
              error: _ => {this.dataSource.isLoading.next(false);},
            });
        }
      }, BodyNotesComponent);
    }

    if (status === PrStatus.Disapproved) {
      this.modalService.show(this.modal.viewContainerRef, {
        btnSuccess: true,
        successCallback: (form) => {
          this.dataSource.isLoading.next(true);

          this.purchaseReqsService.disApprovePr(row.prNumber, form.value.notes)
            .subscribe({
              next: _ => {
                this.dataSource.loadData();
                this.dataSource.row = null;
              },
              error: _ => {this.dataSource.isLoading.next(false);},
            });
        }
      }, BodyNotesComponent);
    }
  }

  onViewPr(event: MouseEvent) {
    if (!this.dataSource.row) {
      event.stopPropagation();
    }
    else {
      this.dataSource.isLoading.next(true);
      this.purchaseReqsService.getPrWithRefs(this.dataSource.row?.prNumber)
        .pipe(mergeMap(res => {
          if (!res.approveUserId)
            return of(res);

          return this.userService.get(res.approveUserId)
            .pipe(map(user => {
              res.approveUser = user;
              return res;
            }));
        }))
        .subscribe(res => {
          this.comToStrService
            .toString(this.modal.viewContainerRef, PurchaseDocComponent, {
              purchaseReq: res,
              title: 'purchase requisition',
              orderAbbr: 'pr',
              orderNumber: res.prNumber,
              createDate: res.createDate,
              approvedBy: res.approveUser?.fullName,
              approvedDate: res.approveDate,
              approvedByPhone: res.approveUser?.phoneNumber,
              approvedByEmail: res.approveUser?.email
            })
            .then(html => {
              const doc = new jsPDF({
                orientation: 'p',
                unit: 'px',
                format: 'a4',
                compress: true
              });

              doc.html(html, {
                html2canvas: {
                  scale: 0.57
                },
                callback: (doc: jsPDF) => {
                  doc.save(`PR ${this.dataSource.row?.prNumber}`);
                  this.comToStrService.destroy();
                  this.dataSource.isLoading.next(false);
                }
              });
          });
        });
    }
  }

  protected readonly RolesConstant = RolesConstant;
}
