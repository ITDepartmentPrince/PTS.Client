import {Injectable, Type, ViewContainerRef} from "@angular/core";
import {Subscription} from "rxjs";

@Injectable({providedIn: "root"})
export class ComponentToStringService {
  container: ViewContainerRef;
  sub: Subscription;

  toString(container: ViewContainerRef, component: Type<any>, model: any): Promise<string> {
    this.container = container;
    const componentRef = this.container.createComponent(component);
    componentRef.location.nativeElement.style.display = 'none';
    componentRef.instance.model = model;

    return new Promise<string>(resolve => {
      if (componentRef.instance.imagesLoaded) {
        this.sub = componentRef.instance.imagesLoaded
          .subscribe((value: boolean) => {
            if (value)
              resolve(componentRef.location.nativeElement.innerHTML);
          });
      }
      else {
        componentRef.instance.viewLoaded
          .subscribe(() => {
            resolve('<!DOCTYPE html>' + componentRef.location.nativeElement.innerHTML);
          });
      }
    });
  }

  destroy() {
    this.sub.unsubscribe();
    this.container.clear();
  }
}
