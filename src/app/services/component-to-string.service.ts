import {Injectable, Type, ViewContainerRef} from "@angular/core";

@Injectable({providedIn: "root"})
export class ComponentToStringService {
  container: ViewContainerRef;

  toString(container: ViewContainerRef, component: Type<any>, model: any): Promise<string> {
    this.container = container;
    const componentRef = this.container.createComponent(component);
    componentRef.location.nativeElement.style.display = 'none';
    componentRef.instance.model = model;

    return new Promise<string>(resolve => {
      if (componentRef.instance.imagesLoaded) {
        componentRef.instance.imagesLoaded
          .subscribe(() => {
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
    this.container.clear();
  }
}
