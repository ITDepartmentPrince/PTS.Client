import {AfterViewInit, Component, ElementRef, EventEmitter, Input, OnDestroy, Output, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {BodyDirective} from "../directives/body.directive";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html'
})
export class ModalComponent implements AfterViewInit, OnDestroy {
  @Input() title?: string;
  @Input() btnCloseLabel?: string;
  @Input() btnSuccessLabel?: string;
  @Input() btnSuccess?: boolean;
  @Input() btnClose?: boolean
  @Input() modalSize?: string;
  @Input() appendTo?: string;
  @Output() closed = new EventEmitter<void>();
  @Output() succeed  = new EventEmitter<NgForm>();
  @Output() formCreated = new EventEmitter<BodyDirective>();
  @ViewChild(BodyDirective) body: BodyDirective;
  @ViewChild('f') form: NgForm;
  @ViewChild('modal') modal: ElementRef;

  ngAfterViewInit(): void {
    if (this.appendTo)
      document.querySelector(this.appendTo)?.appendChild(this.modal.nativeElement);

    this.formCreated.emit(this.body);
  }

  onClose() {
    this.closed.emit();
  }

  onSuccess() {
    this.succeed.emit(this.form);
  }

  ngOnDestroy(): void {
    if (this.appendTo)
      document.querySelector(this.appendTo)?.removeChild(this.modal.nativeElement);
  }
}
