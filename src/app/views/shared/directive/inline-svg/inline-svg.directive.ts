// inline-svg.directive.ts
import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';

@Directive({
  selector: '[inlineSVG]'
})
export class InlineSvgDirective {
  @Input('inlineSVG') svgUrl: string;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    this.loadSvg();
  }

  private loadSvg() {
    fetch(this.svgUrl)
      .then(response => response.text())
      .then(svgText => {
        this.renderer.setProperty(this.el.nativeElement, 'innerHTML', svgText);
      });
  }
}