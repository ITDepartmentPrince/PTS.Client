import {Injectable} from "@angular/core";
import {IService} from "../shared/interface/IService";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {QueryParams} from "../models/query-params";
import {Observable, Subject} from "rxjs";
import {DatatableResponse} from "../models/datatable-response";
import {AuthConstant} from "../auth/auth.constant";
import {Receiving, ReceivingStatus} from "../models/receiving";
import {RecvdItemLotBatch} from "../models/recvdItemLotBatch";
import {ReceivingItem} from "../models/receivingItem";
import {CreateUser} from "../models/create-user";
import {ReceiveItemsLotsBatchesComponent}
  from "../receiving/receive-items-lots-batches/receive-items-lots-batches.component";
import {SourceType} from "../shared/source-type";
import {ModalService} from "../shared/modal/modal.service";
import {ModalDirective} from "../shared/modal/modal.directive";
import {RecvdItemsLotsBatchesService} from "./recvd-items-lots-batches.service";
import {TaxRate} from "../models/tax-rate";
import {BatchesLotsService} from "./batches-lots.service";
import {SitesService} from "./sites.service";
import {ItemLabelComponent} from "../receiving/item-label/item-label.component";
import {ItemLabelService} from "./item-label.service";
import {PrintLabelsService} from "../print-labels/print-labels.service";

@Injectable({providedIn: 'root'})
export class ReceivingForSiteService implements IService<Receiving> {
  private _receiving: Receiving;
  receiveStatusChanged = new Subject<void>();
  receivingItems: Array<ReceivingItem>;
  receivedItems: Array<ReceivingItem>;
  groupByRecvdBlockNos: Array<GroupByRecvdBlockNo>;

  constructor(private httpClient: HttpClient,
              private modalService: ModalService,
              private recvdItemsLb: RecvdItemsLotsBatchesService,
              private batchesLotsService: BatchesLotsService,
              private sitesService: SitesService,
              private itemLabelService: ItemLabelService,
              private printLabelsService: PrintLabelsService) {
    if (this.sitesService.localSite === 0)
      throw new Error('Location not set.');

    /*this.printLabelsService.data = [49];
    this.printLabelsService.printDocument('items-label');*/
  }

  set receiving(receiving: Receiving) {
    this._receiving = receiving;

    this.setReceivingItems();
    this.setReceivedItems();
  }

  get receiving() {
    return this._receiving;
  }

  getRequired(queryParams: QueryParams): Observable<DatatableResponse<Receiving>> {
    return this.httpClient
      .post<DatatableResponse<Receiving>>(
        AuthConstant.apiRoot + `/Sites/${this.sitesService.localSite}/Receiving/GetRequired`,
        queryParams,
        { headers: new HttpHeaders().set('Content-Type', 'application/json') });
  }

  get(roNumber: string): Observable<Receiving> {
    return this.httpClient.get<Receiving>(AuthConstant.apiRoot +
      `/Sites/${this.sitesService.localSite}/Receiving/${roNumber}`);
  }

  delete(roNumber: string | undefined): Observable<any> {
    return this.httpClient.delete(AuthConstant.apiRoot +
        `/Sites/${this.sitesService.localSite}/Receiving/${roNumber}`);
  }

  isNotReceived(receiving?: Receiving): boolean {
    let rec: Receiving;

    if (receiving)
      rec = receiving as Receiving;
    else
      rec = this.receiving;

    return rec.receivingItems
      .filter(item => 0 === item.recvdItemLotsBatches
        ?.reduce((acc, curr) => acc + curr.rlbQty, 0))
      .length === rec.receivingItems.length;
  }

  isReceivedAll(receiving?: Receiving): boolean {
    let rec: Receiving;

    if (receiving)
      rec = receiving as Receiving;
    else
      rec = this.receiving;

    return rec.receivingItems
      .filter(item => item.orderedQty === item.recvdItemLotsBatches
        ?.reduce((acc, curr) => acc + curr.rlbQty, 0))
      .length === rec.receivingItems.length;
  }

  isPartiallyReceived(receiving?: Receiving): boolean {
    let rec: Receiving;

    if (receiving)
      rec = receiving as Receiving;
    else
      rec = this.receiving;

    const length = rec.receivingItems
      .filter(item => item.orderedQty !== item.recvdItemLotsBatches
        ?.reduce((acc, curr) => acc + curr.rlbQty, 0))
      .length;

    return !this.isNotReceived(rec) && length > 0 && length <= rec.receivingItems.length;
  }

  itemQtyReceived(recvdItemLotBatches: Array<RecvdItemLotBatch>): number {
    return recvdItemLotBatches?.reduce((acc, curr) => acc + curr.rlbQty, 0) ?? 0;
  }

  onRoStatusChange(roStatus: ReceivingStatus,
                   modal: ModalDirective,
                   receiving?: Receiving) {
    if (receiving) {
      this.receivingItems = [];
      this.receivedItems = [];
      this.receiving = receiving as Receiving;
    }

    let title = `Receive items from RO ${this.receiving.roNumber}, caused by `;
    switch (this.receiving.source.sourceType) {
      case SourceType["Prince Po"]:
        title += `PO ${this.receiving.source.poNumber}`;
        break;
      case SourceType.Sponsor:
        title += `sponsor ${this.receiving.source.sponsor.companyName}`;
    }

    switch (roStatus) {
      case ReceivingStatus.ReceivedAll:
        this.modalService.show(modal.viewContainerRef, {
          modalSize: 'modal-xl',
          btnSuccessLabel: 'Receive',
          btnCloseLabel: 'Cancel',
          title: title,
          successCallback: _ => {
            this.recvdItemsLb
              .create(this.receiving.roNumber, this.receiving.siteId, this.receiving.notes,
                this.receivingItems
                  .flatMap(ri => ri.recvdItemLotsBatches
                    .filter(rilb => rilb.rlbQty > 0)))
              .subscribe(res => {
                this.receiveStatusChanged.next();
                this.itemLabelService.recvdItemLotsBatches = res;

                this.modalService.show(modal.viewContainerRef, {
                  modalSize: 'modal-xl',
                  btnSuccessLabel: 'Print',
                  title: `Create labels for received items RO ${this.receiving.roNumber}`,
                  successCallback: _ => {
                    this.itemLabelService.create()
                      .subscribe(res => {
                        this.printLabelsService.data = res;
                        this.printLabelsService.printDocument('items-label');
                      });
                  }
                }, ItemLabelComponent);
              });
          }
        }, ReceiveItemsLotsBatchesComponent);
        break;
      case ReceivingStatus.NotReceived:
        this.recvdItemsLb.delete(this.receiving.roNumber, this.receiving.siteId)
          .subscribe(_ => this.receiveStatusChanged.next());
        break;
    }
  }

  getTotalQty(rItems: Array<ReceivingItem>) {
    return rItems.reduce((acc, curr) =>
      acc + curr.orderedQty, 0);
  }

  getTotalPricePerQty(rItems: Array<ReceivingItem>) {
    return rItems.reduce((acc, crr) =>
      acc + crr.pricePerOrderedQty, 0);
  }

  getTotal(rItems: Array<ReceivingItem>) {
    return rItems.reduce((acc, curr) =>
      acc + (curr.orderedQty * curr.pricePerOrderedQty), 0);
  }

  getTotalTaxRate(rItems: Array<ReceivingItem>, taxRates: Array<TaxRate>) {
    return rItems.reduce((acc, curr) => {
      let rate = taxRates
        ?.find(tr => tr.taxId === curr.taxId)
        ?.rate;

      if (!rate)
        rate = 0;

      return acc + (curr.orderedQty * curr.pricePerOrderedQty * rate / 100.0)
    }, 0);
  }

  private groupBy(arr: Array<any>, key: string) {
    return arr.reduce((acc, cur) => {
      (acc[cur[key]] = acc[cur[key]] || []).push(cur);
      return acc;
    }, {});
  }

  private toArray(obj: any) {
    return Object.keys(obj).map(k => obj[k]);
  }

  private setReceivingItems() {
    const removeItemsIndex: Array<number> = [];
    this.receivingItems = JSON.parse(JSON.stringify(this._receiving.receivingItems));

    for (const item of this.receivingItems) {
      if (item.recvdItemLotsBatches.length > 0)
        item.orderedQty -= this.itemQtyReceived(item.recvdItemLotsBatches);

      item.recvdItemLotsBatches = [];

      if (item.orderedQty > 0) {
        const rilb = new RecvdItemLotBatch();
        rilb.rilbReceivingItemId = item.receivingItemId;
        rilb.pricePerRlbQty = item.pricePerOrderedQty;
        rilb.rlbConversionRate = item.orderedConversionRate;

        new Promise(resolve => {
          this.batchesLotsService
            .GetBatchesLotsByMaterialWithInventory(item.riSiteId, item.materialId)
            .subscribe(res => {
              rilb.batchLots = res;
              item.recvdItemLotsBatches.push(rilb);
              resolve(null);
            });
        }).then();
      }

      if (item.orderedQty === 0)
        removeItemsIndex.push(this.receivingItems.indexOf(item));
    }

    while(removeItemsIndex.length)
      this.receivingItems.splice(removeItemsIndex.pop() as number, 1);
  }

  private setReceivedItems() {
    this.groupByRecvdBlockNos = new Array<GroupByRecvdBlockNo>();
    this.receivedItems = JSON.parse(JSON.stringify(this._receiving.receivingItems));

    const groupedRilb = this.toArray(
      this.groupBy(
        this.receivedItems.flatMap(item =>
          item.recvdItemLotsBatches), 'recvdBlockNo')
    );

    for (const item of groupedRilb) {
      const groupRbn = new GroupByRecvdBlockNo();
      groupRbn.recvdBlockNo = item[0].recvdBlockNo;
      groupRbn.recvdBlockDate = item[0].recvdBlockDate;
      groupRbn.createUserId = item[0].createUserId;
      groupRbn.createUser = item[0].createUser;
      groupRbn.receivedItems = JSON.parse(JSON.stringify(this.receivedItems));

      for (const rItem of groupRbn.receivedItems) {
        rItem.recvdItemLotsBatches = item.filter((itm: any) =>
          itm.rilbReceivingItemId === rItem.receivingItemId)
          .map((itmRilb: any) => {
            new Promise(resolve => {
              this.batchesLotsService
                .get(itmRilb.batchLotId, itmRilb.batchLotSiteId)
                .subscribe(res => {
                  itmRilb.batchLot = res;
                  resolve(itmRilb);
                });
            })
            .then(res => res);

            return itmRilb;
          });

        if (rItem.recvdItemLotsBatches.length > 0) {
          const qtyReceived = this.itemQtyReceived(rItem.recvdItemLotsBatches);

          if (rItem.orderedQty !== qtyReceived)
            rItem.orderedQty = qtyReceived;

        }
        else
          groupRbn.removeItemsIndex.push(groupRbn.receivedItems.indexOf(rItem));
      }

      this.groupByRecvdBlockNos.push(groupRbn);
    }

    for (const item of this.groupByRecvdBlockNos)
      while (item.removeItemsIndex.length)
        item.receivedItems.splice(item.removeItemsIndex.pop() as number, 1);
  }
}

class GroupByRecvdBlockNo {
  recvdBlockNo: string;
  recvdBlockDate: Date;
  createUserId: number;
  createUser: CreateUser;
  receivedItems: Array<ReceivingItem>;
  removeItemsIndex: Array<number> = [];
}
