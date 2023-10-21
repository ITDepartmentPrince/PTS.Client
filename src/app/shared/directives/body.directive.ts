import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[appBody]'
})
export class BodyDirective {
  constructor(public viewContainerRef: ViewContainerRef) { }
}
