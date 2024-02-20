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
import {PurchaseDocComponent} from "../purchase-doc/purchase-doc/purchase-doc.component";
import {jsPDF} from "jspdf";
import {ComponentToStringService} from "../../services/component-to-string.service";
import {VendorDocComponent} from "../purchase-doc/vendor-doc/vendor-doc.component";
import {map, mergeMap, of} from "rxjs";
import {
  VendorEmailSuccessComponent
} from "../purchase-doc/vendor-doc/vendor-email-success/vendor-email-success.component";
import {UserService} from "../../services/user.service";

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
        const notes = JSON.parse(JSON.stringify(form.value.notes));

        switch (poStatus) {
          case PoStatus.Approved:
            this.poService.approvePo(po, notes)
              .subscribe({
                next: res => {
                  if (!res.reqExecApproval) {
                    this.emailPo(po.poNumber, notes);
                  }
                  else {
                    this.dataSource.loadData();
                    this.dataSource.row = null;
                  }
                },
                error: _ => {
                  this.dataSource.isLoading.next(false);
                }
              });
            break;
          case PoStatus.Disapproved:
            this.poService.disApprovePo(po, notes)
              .subscribe({
                next: _ => {
                  this.dataSource.loadData();
                  this.dataSource.row = null;
                },
                error: _ => this.dataSource.isLoading.next(false),
              });
            break;
          case PoStatus.ExecApproved:
            this.poService.execApprovePo(po)
              .subscribe({
                next: _ => {
                  this.emailPo(po.poNumber, notes);
                },
                error: _ => {
                  this.dataSource.isLoading.next(false);
                }
              });
            break;
        }
      }
    }, BodyNotesComponent);
  }

  onViewPo(event: MouseEvent) {
    if (!this.dataSource.row) {
      event.stopPropagation();
    }
    else {
      this.dataSource.isLoading.next(true);
      this.poService.getPoWithRefs(this.dataSource.row.poNumber)
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
              purchaseReq: res.purchaseReq,
              title: 'purchase order',
              orderAbbr: 'po',
              orderNumber: res.poNumber,
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
                  doc.save(`PO ${this.dataSource.row?.poNumber}`);
                  this.comToStrService.destroy();
                  this.dataSource.isLoading.next(false);
                }
              });
            })
        });
    }
  }

  private emailPo(poNumber: string, notes: string) {
    this.poService.getPoWithRefs(poNumber)
      .pipe(mergeMap(res => {
        if (!res.approveUserId)
          return of(res);

        return this.userService.get(res.approveUserId)
          .pipe(map(user => {
            res.approveUser = user;
            return res;
          }));
      }))
      .pipe(mergeMap(res => {
        return this.userService.get(<number>res.purchaseReq.approveUserId)
          .pipe(map(user => {
            res.purchaseReq.approveUser = user;
            return res;
          }));
      }))
      .subscribe(res => {
        this.comToStrService
          .toString(this.modal.viewContainerRef, PurchaseDocComponent, {
            purchaseReq: res.purchaseReq,
            title: 'purchase order',
            orderAbbr: 'po',
            orderNumber: res.poNumber,
            createDate: res.createDate,
            approvedBy: res.approveUser?.fullName,
            approvedDate: res.approveDate,
            approvedByPhone: res.approveUser?.phoneNumber,
            approvedByEmail: res.approveUser?.email
          })
          .then(purchaseHtml => {
            this.comToStrService.toString(this.modal.viewContainerRef, VendorDocComponent, {
              vendorFirstName: res.purchaseReq.vendorContact.firstName + ' ' +
                res.purchaseReq.vendorContact.lastName,
              poNumber: res.poNumber,
              purchaseType: res.classification.classificationName.includes('Materials')
                ? 'materials'
                : res.classification.classificationName,
              prApproverName: res.purchaseReq.approveUser?.fullName,
              prApproverEmail: res.purchaseReq.approveUser?.email,
              prApproverPhone: res.purchaseReq.approveUser?.phoneNumber
            })
              .then(vendorHtml => {
                const doc = new jsPDF({
                  orientation: 'p',
                  unit: 'px',
                  format: 'a4',
                  compress: true
                });

                doc.html(purchaseHtml, {
                  html2canvas: {
                    scale: 0.57
                  },
                  callback: (doc: jsPDF) => {
                    this.poService.emailPo(poNumber, notes, btoa(doc.output()), vendorHtml)
                      .subscribe(_ => {
                        this.comToStrService.destroy();
                        this.dataSource.loadData();
                        this.dataSource.row = null;

                        this.modalService.show(
                          this.modal.viewContainerRef,
                          {
                            title: 'Success',
                            btnSuccess: false
                          },
                          VendorEmailSuccessComponent,
                          {
                            poNumber: poNumber,
                            vendor: res.purchaseReq.vendor.companyName
                          });
                      });
                  }
                });
              });
          });
      });
  }
}
