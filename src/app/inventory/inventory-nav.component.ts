import {Component, OnInit, ViewChild} from '@angular/core';
import {SitesService} from "../services/sites.service";
import {BatchesLotsService} from "../services/batches-lots.service";
import {ShelfNotAvailableComponent} from "./shelf-not-available/shelf-not-available.component";
import {ShelvesService} from "../services/shelves.service";
import {ModalService} from "../shared/modal/modal.service";
import {ModalDirective} from "../shared/modal/modal.directive";
import {ItemLabelService} from "../services/item-label.service";
import {ActivateCameraComponent} from "../activate-camera/activate-camera.component";

@Component({
  selector: 'app-inventory-nav',
  templateUrl: './inventory-nav.component.html'
})
export class InventoryNavComponent implements OnInit {
  isLoading: boolean;
  @ViewChild(ModalDirective) modal: ModalDirective;

  constructor(public sitesService: SitesService,
              public blService: BatchesLotsService,
              private shelvesService: ShelvesService,
              private modalService: ModalService,
              private itemLabelService: ItemLabelService) {
  }

  ngOnInit(): void {
    this.blService.siteId = this.sitesService.localSite;
  }

  onShelfNumChange(input: HTMLInputElement) {
    this.isLoading = true;

    this.shelvesService.isShelfAvailable(input.value)
      .subscribe({
        next: res => {
          this.isLoading = false;

          if (!res) {
            this.shelfNotAvailable();
          }
          else {
            this.itemLabelService.shelfCode = input.value;

            this.modalService.show(this.modal.viewContainerRef, {
              title: `Add items to shelf # ${input.value} (scan QR code)`,
              btnSuccess: false,
              successCallback: (code: any) => {
                this.itemLabelService
                  .addShelfCode(JSON.parse(code).id, this.itemLabelService.shelfCode)
                  .subscribe(_ => this.itemLabelService.shelfCodeAdded.next());
              }
            }, ActivateCameraComponent);
          }

          input.value = '';
        },
        error: _ => {
          this.shelfNotAvailable();
        }
      });
  }

  activateCamera(codeInput: HTMLInputElement) {
    this.modalService.show(this.modal.viewContainerRef, {
      title: 'Scan shelf #',
      btnSuccess: false,
      successCallback: (code: any) => {
        codeInput.value = code;
        this.onShelfNumChange(codeInput);
      }
    }, ActivateCameraComponent);
  }

  private shelfNotAvailable() {
    this.modalService.show(this.modal.viewContainerRef, {
      title: 'Not available',
      btnSuccess: false
    }, ShelfNotAvailableComponent);
  }
}
