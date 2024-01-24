import {Component, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Operations} from "../../../shared/operations";
import {AuthPolicy} from "../../../auth/auth-policy";
import {Router} from "@angular/router";
import {VendorContactsService} from "../../../services/vendor-contacts.service";
import {PurchaseReqCharges} from "../../../models/purchase-req-charges";
import {OtherCharge} from "../../../models/other-charge";
import {PurchaseReqsService} from "../../../services/purchase-reqs.service";
import {ModalService} from "../../../shared/modal/modal.service";
import {ModalDirective} from "../../../shared/modal/modal.directive";
import {BodyNotesComponent} from "../../../shared/body-notes/body-notes.component";
import {PrStatus} from "../purchase-reqs.component";
import {ItemType} from "../../../shared/item-type";
import {delay, zip} from "rxjs";
import {MatlClassificationsService} from "../../../services/matl-classifications.service";
import {VendorsService} from "../../../services/vendors.service";
import {OtherChargesService} from "../../../services/other-charges.service";
import {DepartmentsService} from "../../../services/departments.service";
import {PayTermsService} from "../../../services/pay-terms.service";
import {ShippingsService} from "../../../services/shippings.service";
import {SitesService} from "../../../services/sites.service";
import {MatlClassification} from "../../../models/matl-classification";
import {Vendor} from "../../../models/vendor";
import {Department} from "../../../models/department";
import {PayTerm} from "../../../models/pay-term";
import {Shipping} from "../../../models/shipping";
import {Site} from "../../../models/site";
import {VendorContact} from "../../../models/vendor-contact";
import {UserService} from "../../../services/user-service";

@Component({
  selector: 'app-purchase-reqs-form',
  templateUrl: './purchase-reqs-form.component.html'
})
export class PurchaseReqsFormComponent implements OnInit {
  operations = Operations;
  controlState: boolean;
  @Input() isLoading = true;
  @Input() action: Operations;
  @Output() submitted = new EventEmitter<void>();
  @ViewChild(ModalDirective) modal: ModalDirective;
  prStatus = PrStatus;
  protected readonly AuthPolicy = AuthPolicy;
  protected readonly ItemType = ItemType;
  classifications: Array<MatlClassification>;
  vendors: Array<Vendor>;
  otherCharges: Array<OtherCharge>;
  departments: Array<Department>;
  payTerms: Array<PayTerm>;
  shippings: Array<Shipping>;
  sites: Array<Site>;
  vendorContacts: Array<VendorContact>;

  constructor(public prService: PurchaseReqsService,
              public router: Router,
              private modalService: ModalService,
              private contactsService: VendorContactsService,
              private mcService: MatlClassificationsService,
              private vendorService: VendorsService,
              private ocService: OtherChargesService,
              private depService: DepartmentsService,
              private ptService: PayTermsService,
              private shipService: ShippingsService,
              private siteService: SitesService,
              private userService: UserService) {
  }

  ngOnInit(): void {
    this.controlState = this.action === this.operations.View ||
      this.action === this.operations.Delete;

    zip(this.mcService.getAll(),
      this.vendorService.getAll(),
      this.ocService.getAll(),
      this.depService.getAll(),
      this.ptService.getAll(),
      this.shipService.getAll(),
      this.siteService.getAll(),
      this.contactsService.getAll())
      .pipe(delay(200))
      .subscribe(res => {
        this.classifications = res[0].filter(e => e.classificationName.toLowerCase() !== 'finished goods');
        this.vendors = res[1];
        this.otherCharges = res[2];
        this.departments = res[3];
        this.payTerms = res[4];
        this.shippings = res[5];
        this.sites = res[6].filter(e => e.siteName.toLowerCase() !== 'all locations');
        this.vendorContacts = res[7];

        if (this.action === Operations.Create && !this.prService.isDuplicate)
          this.prService.purchaseReq.classificationId = this.classifications
            ?.find(c => c.classificationName.toLowerCase() === 'raw materials')
            ?.classificationId as number;

        if (this.prService.purchaseReq?.approveUserId)
          this.userService.get(this.prService.purchaseReq.approveUserId)
            .subscribe(res => {
              this.prService.purchaseReq.approveUser = res;
            });

        this.isLoading = false;
      });
  }

  onSubmit() {
    this.submitted.emit();
  }

  onClassificationChange() {
    this.prService.purchaseReq.purchaseReqItems = [];
    this.prService.changeItems.next();
  }

  onVendorChange() {
    this.prService.purchaseReq.contactId = null;
    this.contactsService
      .getContactsByVendorId(this.prService.purchaseReq.vendorId)
      .subscribe(contacts => this.vendorContacts = contacts);

    this.onClassificationChange();
  }

  onAddCharge(chargeId: any, amount: any, ocDd: any) {
    if (!chargeId && !amount)
      return;

    const charge = new PurchaseReqCharges();
    charge.otherChargeId = chargeId as number;
    charge.otherCharge = this.otherCharges.find(oc =>
      oc.otherChargeId === charge.otherChargeId) as OtherCharge;
    charge.amount = amount as number;
    this.prService.purchaseReq.purchaseReqCharges.push(charge);
    ocDd.classList.remove('show');
  }

  onRemoveCharge(charge: PurchaseReqCharges) {
    this.prService.purchaseReq.purchaseReqCharges
      .splice(this.prService.purchaseReq.purchaseReqCharges.indexOf(charge), 1);
  }

  onPrStatusChange(status: PrStatus) {
    if (status === PrStatus.Submitted) {
      this.modalService.show(this.modal.viewContainerRef, {
        btnSuccess: true,
        successCallback: (form) => {
          this.isLoading = true;

          this.prService.submitPr(this.prService.purchaseReq.prNumber, form.value.notes)
            .subscribe({
              next: _ => {this.router?.navigate(['/purchase-requisitions']);},
              error: _ => {this.isLoading = false;},
            });
        }
      }, BodyNotesComponent);
    }

    if (status === PrStatus.Approved) {
      if (!this.prService.purchaseReq.approveUserId) {
        this.modalService.show(this.modal.viewContainerRef, {
          btnSuccess: true,
          successCallback: (form) => {
            this.isLoading = true;

            this.prService.approvePr(this.prService.purchaseReq.prNumber, form.value.notes)
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

          this.prService.disApprovePr(this.prService.purchaseReq.prNumber, form.value.notes)
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
    return !!this.classifications.find(c =>
      c.classificationId === classificationId
      && c.classifiedAs === classifiedAs)
      && !!vendorId;
  }

  onDuplicate() {
    this.prService.isDuplicate = true;
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

    this.router?.navigate(['/purchase-requisitions/create']);
  }

  onCreateDateChange(event: any) {
    this.prService.purchaseReq.createDate = event.target.value;
  }

  onDeliveryDateChange(event: any) {
    this.prService.purchaseReq.deliveryDate = event.target.value;
  }
}
