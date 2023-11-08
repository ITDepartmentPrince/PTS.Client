import {AfterViewInit, Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {NgForm} from "@angular/forms";
import {BodyDirective} from "../directives/body.directive";

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html'
})
export class ModalComponent implements AfterViewInit {
  @Input() title? = 'Confirmation';
  @Input() btnCloseLabel? = 'Close';
  @Input() btnSuccessLabel? = 'Yes';
  @Input() btnSuccess? = true;
  @Input() btnClose? = false;
  @Input() modalSize?: string;
  @Output() closed = new EventEmitter<void>();
  @Output() succeed  = new EventEmitter<NgForm>();
  @Output() formCreated = new EventEmitter<BodyDirective>();
  @ViewChild(BodyDirective) body: BodyDirective;
  @ViewChild('f') form: NgForm;

  ngAfterViewInit(): void {
    this.formCreated.emit(this.body);
  }

  onClose() {
    this.closed.emit();
  }

  onSuccess() {
    this.succeed.emit(this.form);
  }
}
