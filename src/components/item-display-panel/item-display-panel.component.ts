import { Component, Directive, Input, SimpleChange } from '@angular/core';
import { ModalModule } from 'ngx-bootstrap/modal';
import { Observable } from 'rxjs/Observable';

@Component({
    selector: 'ux-item-display-panel',
    templateUrl: './item-display-panel.component.html',
    exportAs: 'ux-item-display-panel'
})
export class ItemDisplayPanelComponent { 
    @Input() top: number;
    @Input() shadow: boolean;
    @Input() visible: boolean;
    @Input() title: string;

    height: string;

    ngOnChanges(changes: {[top: number]: SimpleChange}) {
        this.height = 'calc(100% - ' + this.top + 'px)';
    }

    show() {
        if (!this.visible) {
            this.visible = true;
        }
    }

    hide() {
        if (this.visible) {
            this.visible = false;
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