import {ComponentRef, EventEmitter, Injectable, Type, ViewContainerRef} from "@angular/core";
import {ModalComponent} from "./modal.component";
import {BodyDeleteComponent} from "../body-delete/body-delete.component";
import {NgForm} from "@angular/forms";
import {Subscription, take} from "rxjs";

interface ISuccessCallback {
  (form: NgForm | any, data?: any): void;
}

type FunctionOptions = {
  title?: string,
  btnCloseLabel?: string,
  btnSuccessLabel?: string,
  btnSuccess?: boolean,
  btnClose?: boolean,
  modalSize?: string,
  appendTo?: string,
  successCallback?: ISuccessCallback,
  closeCallback?: any
}

@Injectable({providedIn: 'root'})
export class ModalService {
  succeed = new EventEmitter<NgForm | any>();
  sub: Subscription;

  show(modalContainer: ViewContainerRef,
       options: FunctionOptions,
       bodyComponent: Type<any> = BodyDeleteComponent,
       bodyComponentData: any = null) {

    let bodyRef: ComponentRef<any>;
    const modalRef = modalContainer.createComponent(ModalComponent);

    modalRef.instance.title = options?.title ?? 'Confirmation';
    modalRef.instance.btnCloseLabel = options?.btnCloseLabel ?? 'Close';
    modalRef.instance.btnSuccessLabel = options?.btnSuccessLabel ?? 'Yes';
    modalRef.instance.btnSuccess = options?.btnSuccess ?? true;
    modalRef.instance.btnClose = options?.btnClose ?? true;
    modalRef.instance.modalSize = options?.modalSize;
    modalRef.instance.appendTo = options.appendTo;

    modalRef.instance.formCreated.subscribe(body => {
      bodyRef = body.viewContainerRef.createComponent(bodyComponent);
      if (bodyComponentData)
        bodyRef.instance.bodyData = bodyComponentData;

      bodyRef.changeDetectorRef.detectChanges();

      this.succeed
        .pipe(take(1))
        .subscribe(form => {
          options.successCallback?.(form, bodyComponentData);

          bodyRef.destroy();
          modalRef.destroy();
          modalContainer.clear();
        });
    });

    modalRef.instance.closed.subscribe(_ => {
      options.closeCallback?.();
      bodyRef.destroy();
      modalRef.destroy();
      modalContainer.clear();
    });
  }
}
