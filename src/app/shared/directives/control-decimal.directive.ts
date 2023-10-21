import {Directive, ElementRef, HostListener, Input} from '@angular/core';

@Directive({
  selector: '[controlDecimal]'
})
export class ControlDecimalDirective {
  @Input('controlDecimal') scale: number;

  constructor(private el: ElementRef) { }

  @HostListener('input', ['$event'])
  onKeyDown() {
    const beforeDecimal = this.el.nativeElement.value.split('.')[0];
    const afterDecimal = this.el.nativeElement.value.split('.')[1];

    if (afterDecimal?.length >= this.scale) {
      let digits = [];

      for (let i = 0; i < this.scale; i++)
        digits.push(afterDecimal[i]);

      this.el.nativeElement.value = `${beforeDecimal}.${digits.join('')}`
    }
  }
}
