import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {IFormModel} from "../../../shared/interface/IFormModel";
import {NgForm} from "@angular/forms";
import {PurchaseReq} from "../../../models/purchase-req";
import {AuthPolicy} from "../../../auth/auth-policy";
import {Router} from "@angular/router";
import {VendorContactsService} from "../../../services/vendor-contacts.service";
import {PurchaseReqCharges} from "../../../models/purchase-req-charges";
import {OtherCharge} from "../../../models/other-charge";
import {PurchaseReqsService} from "../../../services/purchase-reqs.service";
import {ModalService} from "../../../shared/modal/modal.service";
import {ModalDirective} from "../../../shared/modal/modal.directive";
import {BodyNotesComponent} from "../../../shared/body-notes/body-notes.component";
import {ToPatch} from "../../../models/to-patch";
import {PrStatus} from "../purchase-reqs.component";
import {ItemType} from "../../../shared/item-type";

@Component({
  selector: 'app-purchase-reqs-form',
  templateUrl: './purchase-reqs-form.component.html'
})
export class PurchaseReqsFormComponent implements OnInit {
  operations = Operations;
  controlState: boolean;
  @Input() isLoading = false;
  @Input() action: Operations;
  @Input() model: PurchaseReq;
  @Output() submitted = new EventEmitter<IFormModel<PurchaseReq>>();
  @ViewChild('f') form: NgForm;
  @ViewChild(ModalDirective) modal: ModalDirective;
  prStatus = PrStatus;
  protected readonly AuthPolicy = AuthPolicy;
  protected readonly ItemType = ItemType;

  constructor(public prService: PurchaseReqsService,
              public router: Router,
              private modalService: ModalService,
              private contactsService: VendorContactsService) {
  }

  ngOnInit(): void {
    this.controlState = this.action === this.operations.View ||
      this.action === this.operations.Delete;
  }

  onSubmit() {
    this.model.deliveryDate = this.form.value.deliveryDate;
    this.model.createDate = this.form.value.createDate;

    this.submitted.emit({
      action: this.action,
      model: this.model
    });
  }

  onClassificationChange() {
    this.prService.purchaseReq.purchaseReqItems = [];
    this.prService.changeItems.next();
  }

  onVendorChange() {
    this.model.contactId = null;
    this.contactsService
      .getContactsByVendorId(this.model.vendorId)
      .subscribe(contacts => this.model.vendorContacts = contacts);

    this.prService.purchaseReq.purchaseReqItems = [];
    this.prService.changeItems.next();
  }

  onAddCharge(chargeId: any, amount: any, ocDd: any) {
    if (!chargeId && !amount)
      return;

    const charge = new PurchaseReqCharges();
    charge.otherChargeId = chargeId as number;
    charge.otherCharge = this.model.otherCharges.find(oc =>
      oc.otherChargeId === charge.otherChargeId) as OtherCharge;
    charge.amount = amount as number;
    this.model.purchaseReqCharges.push(charge);
    ocDd.classList.remove('show');
  }

  onRemoveCharge(charge: PurchaseReqCharges) {
    this.model.purchaseReqCharges
      .splice(this.model.purchaseReqCharges.indexOf(charge), 1);
  }

  onPrStatusChange(status: PrStatus) {
    if (status === PrStatus.Submitted) {
      this.modalService.show(this.modal.viewContainerRef, {
        btnSuccess: true,
        successCallback: (form) => {
          this.isLoading = true;

          this.prService.submitPr(this.model.prNumber,
            new Array<ToPatch>(
              new ToPatch('replace', 'isSubmitted', (!this.model.isSubmitted).toString()),
              new ToPatch('replace', 'insideNotes', form.value.notes)))
            .subscribe({
              next: _ => {this.router?.navigate(['/purchase-requisitions']);},
              error: _ => {this.isLoading = false;},
            });
        }
      }, BodyNotesComponent);
    }

    if (status === PrStatus.Approved) {
      if (!this.model.approveUserId) {
        this.modalService.show(this.modal.viewContainerRef, {
          btnSuccess: true,
          successCallback: (form) => {
            this.isLoading = true;

            this.prService.approvePr(this.model.prNumber, form.value.notes)
              .subscribe({
                next: _ => {this.router?.navigate(['/purchase-requisitions']);},
                error: _ => {this.isLoading = false;},
              });
          }
        }, BodyNotesComponent);
      }
    }

    if (status === PrStatus.Disapproved) {
      this.modalService.show(this.modal.viewContainerRef, {
        btnSuccess: true,
        successCallback: (form) => {
          this.isLoading = true;

          this.prService.disApprovePr(this.model.prNumber, form.value.notes)
            .subscribe({
              next: _ => {this.router?.navigate(['/purchase-requisitions']);},
              error: _ => {this.isLoading = false;},
            });
        }
      }, BodyNotesComponent);
    }
  }

  isClassifiedAs(classificationId: number,
                 vendorId: number | null,
                 classifiedAs: ItemType): boolean {
    return !!this.model.classifications.find(c =>
      c.classificationId === classificationId
      && c.classifiedAs === classifiedAs)
      && !!vendorId;
  }

  onDuplicate() {
    this.prService.purchaseReq = this.model;
    this.prService.purchaseReq.prNumber = '';
    this.prService.purchaseReq.purchaseOrder = null;
    this.prService.purchaseReq.totalPurchaseValue = 0;
    this.prService.purchaseReq.isSubmitted = false;
    this.prService.purchaseReq.submitUserId = undefined;
    this.prService.purchaseReq.approveDate = undefined;
    this.prService.purchaseReq.approveUserId = undefined;
    this.prService.purchaseReq.inActive = false;
    for (const item of this.prService.purchaseReq.purchaseReqItems) {
      item.prNumber = '';
      item.itemId = 0;
    }
    for (const item of this.prService.purchaseReq.purchaseReqCharges)
      item.prNumber = '';

    this.router?.navigate(['/purchase-requisitions/create'], {state: {duplicate: true}});
  }
}
