import { Directive, ViewContainerRef, Renderer, ElementRef, Input, Renderer2 } from '@angular/core';
import { TooltipDirective, TooltipConfig } from 'ngx-bootstrap/tooltip';
import { ComponentLoaderFactory } from 'ngx-bootstrap/component-loader';
import { ResizeService } from '../resize/index';
import 'rxjs/add/operator/debounceTime';

@Directive({
    selector: '[uxOverflowTooltip]'
})
export class OverflowTooltipDirective extends TooltipDirective {

    @Input('uxOverflowTooltip') tooltip: string;

    private nativeElement: HTMLElement;

    constructor(viewContainerRef: ViewContainerRef, renderer: Renderer, elementRef: ElementRef,
        cis: ComponentLoaderFactory, config: TooltipConfig, resizeService: ResizeService, renderer2: Renderer2) {
        super(viewContainerRef, renderer, elementRef, cis, config);

        // store the element for later use
        this.nativeElement = elementRef.nativeElement;

        // watch for any resize events
        resizeService.addResizeListener(elementRef.nativeElement, renderer2).debounceTime(200).subscribe(_ => {
            this.checkForOverflow();
        });
    }

    private checkForOverflow() {
        this.isDisabled = this.nativeElement.scrollWidth <= this.nativeElement.clientWidth &&
                          this.nativeElement.scrollHeight <= this.nativeElement.clientHeight;
    }
}