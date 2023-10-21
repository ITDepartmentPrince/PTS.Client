import {ComponentRef, Injectable, Type, ViewContainerRef} from "@angular/core";
import {ModalComponent} from "./modal.component";
import {BodyDeleteComponent} from "../body-delete/body-delete.component";
import {NgForm} from "@angular/forms";

interface ISuccessCallback {
  (form: NgForm): void;
}

type FunctionOptions = {
  title?: string,
  btnCloseLabel?: string,
  btnSuccessLabel?: string,
  btnSuccess?: boolean,
  btnClose?: boolean,
  modalSize?: string,
  successCallback?: ISuccessCallback,
  closeCallback?: any
}

// const assertion to create readonly values
const defaultOptions = {
  title: 'Confirmation',
  btnCloseLabel: 'Close',
  btnSuccessLabel: 'Yes',
  btnSuccess: false,
  btnClose: false,
  modalSize: '',
  successCallback: () => {},
  closeCallback: () => {}
} as const;

@Injectable({providedIn: 'root'})
export class ModalService {
  show(modalContainer: ViewContainerRef,
       options: FunctionOptions = defaultOptions,
       bodyComponent: Type<any> = BodyDeleteComponent) {

    let bodyRef: ComponentRef<any>;
    const modalRef = modalContainer.createComponent(ModalComponent);

    modalRef.instance.title = options?.title;
    modalRef.instance.btnCloseLabel = options?.btnCloseLabel;
    modalRef.instance.btnSuccessLabel = options?.btnSuccessLabel;
    modalRef.instance.btnSuccess = options?.btnSuccess;
    modalRef.instance.btnClose = options?.btnClose;
    modalRef.instance.modalSize = options?.modalSize;

    modalRef.instance.formCreated.subscribe(body => {
      bodyRef = body.viewContainerRef.createComponent(bodyComponent);
      bodyRef.changeDetectorRef.detectChanges();

      modalRef.instance.succeed.subscribe(form => {
        options.successCallback?.(form);

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
