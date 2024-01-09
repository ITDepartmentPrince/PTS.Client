import {AfterViewInit, Component, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-vendor-doc',
  templateUrl: './vendor-doc.component.html'
})
export class VendorDocComponent implements AfterViewInit {
  model: any;
  viewLoaded = new EventEmitter<void>();

  ngAfterViewInit(): void {
    this.viewLoaded.emit();
  }
}
