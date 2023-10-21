import {Directive, ElementRef, OnInit, Renderer2} from '@angular/core';

@Directive({
  selector: '[highlightOnSearch]'
})
export class HighlightOnSearchDirective implements OnInit {
  private icon: Element | null;
  private input: Element | null;

  constructor(private renderer: Renderer2, private el: ElementRef) {
  }

  ngOnInit(): void {
    this.icon = (this.el.nativeElement as HTMLElement)
      .querySelector('.column-search-icon');
    this.input = (this.el.nativeElement as HTMLElement)
      .querySelector('.column-search-input');

    this.renderer.listen(this.input, 'input', this.onInput);
  }

  private onInput = () => {
    ((this.el.nativeElement as HTMLElement)
      .closest('table') as HTMLElement)
      .querySelectorAll('.column-search-icon')
      .forEach(icon => {
        this.renderer.setStyle(icon, 'fill', 'currentColor');
        this.renderer.removeClass(icon, 'searching');
      });

    if ((this.input as HTMLInputElement).value.trim().length > 0) {
      this.renderer.setStyle(this.icon, 'fill', 'var(--bs-danger)');
      this.renderer.addClass(this.icon, 'searching');
    }
  }
}
