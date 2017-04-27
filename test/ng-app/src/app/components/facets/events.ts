import { Facet } from './facet-container.component';

export class FacetSelect {
    constructor(public facet: Facet) {}
}

export class FacetDeselect {
    constructor(public facet: Facet) {}
}

export class FacetDeselectAll {
    constructor(public facets: Facet[]) {}
}

export type FacetEvent = FacetSelect | FacetDeselect | FacetDeselectAll;
