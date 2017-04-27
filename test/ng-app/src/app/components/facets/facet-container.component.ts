import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { FacetEvent, FacetSelect, FacetDeselect, FacetDeselectAll } from './events';

@Component({
    selector: 'ux-facet-container',
    templateUrl: './facet-container.component.html'
})
export class FacetContainerComponent {

    @Input() selectedText: string = 'Selected:';
    @Input() clearText: string = 'Clear All';
    @Input() emptyText: string = 'No Items';

    @Output() events: EventEmitter<FacetEvent> = new EventEmitter<FacetEvent>();

    selectedFacets: Facet[] = [
        {
            title: '.doc'
        },
        {
            title: '.txt'
        }
    ];

    selectFacet(facet: Facet): void {
        // push the facet on to the list
        this.selectedFacets.push(facet);

        // broadcast the event through the observable
        this.triggerEvent(new FacetSelect(facet));
    }

    deselectFacet(facet: Facet): void {

        // find the index of the item in the selected array
        let idx = this.selectedFacets.findIndex(selectedFacet => facet === selectedFacet);

        // if match was found then remove it
        if (idx > -1) {
            this.selectedFacets.splice(idx, 1);

            // broadcast event to the observale
            this.triggerEvent(new FacetDeselect(facet));
        }
    }

    deselectAllFacets(): void {
        // send the deselect all event through the observable
        this.triggerEvent(new FacetDeselectAll(this.selectedFacets));

        // empty the selected array
        this.selectedFacets = [];
    }

    triggerEvent(e: FacetEvent) {
        this.events.next(e);
    }
}

export interface Facet {
    title: string;
    count?: number;
}