import {AfterViewInit, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import { BarcodeFormat } from '@zxing/library';
import {ModalService} from "../shared/modal/modal.service";
import {ZXingScannerComponent} from "@zxing/ngx-scanner";

@Component({
  selector: 'app-activate-camera',
  templateUrl: './activate-camera.component.html'
})
export class ActivateCameraComponent implements AfterViewInit {
  allowedFormats = [ BarcodeFormat.QR_CODE, BarcodeFormat.CODE_128, BarcodeFormat.EAN_13, BarcodeFormat.DATA_MATRIX ];
  @ViewChild('scanner') scanner: ZXingScannerComponent;
  @Output() itemScanned = new EventEmitter<string>();
  @Input() isModalRequired = true;
  scanned = false;
  isLoading = true;
  camNotFound = false;
  video: HTMLElement;

  constructor(private modalService: ModalService) {
  }

  ngAfterViewInit(): void {
    this.video = document.querySelector('zxing-scanner video') as HTMLElement;
    this.video.style.height = '200px';
    this.video.style.border = '2px solid #154e9d';
    this.video.style.borderRadius = '5px';
    this.video.onplay = _ => {
      this.isLoading = false;
    }
  }

  onCodeRead(result: string) {
    if (this.scanned)
      return;

    if (result) {
      this.scanned = true;
      const audio = new Audio('/assets/sound/code_scan_sound.mp3');
      audio.play().then();
      audio.onended = _ => {
        this.isLoading = true;
        this.scanner.enable = false;

        if (this.isModalRequired)
          this.modalService.succeed.emit(result);
        else {
          this.itemScanned.emit(result);
          setTimeout(_ => {
            this.scanner.enable = true;
            this.scanned = false;

            this.video.onplay = _ => {
              this.isLoading = false;
            }
          });
        }
      }
    }
  }

  onCamNotFound() {
    this.camNotFound = true;
    this.isLoading = false;
  }
}
