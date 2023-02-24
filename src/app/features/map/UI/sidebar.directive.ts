import { Directive, ElementRef, inject, Input, OnChanges, Renderer2, SimpleChanges } from '@angular/core';

@Directive({
  selector: '[appSidebar]',
  standalone: true
})
export class SidebarDirective implements OnChanges{

  @Input() isOpen: boolean = false;

  render: Renderer2 = inject(Renderer2);
  elementRef: ElementRef = inject(ElementRef);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['isOpen']) {
      this.toggleSidebar();
    }
  }

  toggleSidebar() {
    this.isOpen ? this.render.addClass(this.elementRef.nativeElement, 'open') :
      this.render.removeClass(this.elementRef.nativeElement, 'open');
    }
}
