import { Directive, ElementRef, Input, OnChanges, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appStockBajo]',
  standalone: true
})
export class StockBajoDirective implements OnChanges {

  @Input() appStockBajo = 0;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnChanges() {
    if (this.appStockBajo <= 1) {
      this.renderer.addClass(this.el.nativeElement, 'low-stock');
    } else {
      this.renderer.removeClass(this.el.nativeElement, 'low-stock');
    }
  }
}