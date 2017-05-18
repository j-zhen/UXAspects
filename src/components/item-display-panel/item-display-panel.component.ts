import { Component, Directive, Input } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';

@Component({
    selector: 'ux-item-display-panel',
    templateUrl: './item-display-panel.component.html',
    exportAs: 'ux-item-display-panel'
})
export class ItemDisplayPanelComponent { 
    @Input() top: number;
    @Input() shadow: boolean;

    height: string;

    ngAfterViewInit() {
        debugger;
        if (this.top) {
            this.height = 'calc(100% - ' + this.top + 'px)';
            // this.height = '200px';
        }
    }
}

@Directive({
    selector: 'ux-item-display-panel-content'
})
export class ItemDisplayPanelContentDirective { }

@Directive({
    selector: 'ux-item-display-panel-footer'
})
export class ItemDisplayPanelFooterDirective { }