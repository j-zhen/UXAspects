import { Component } from '@angular/core';
import { Facet } from '../../components/facets/index';

@Component({
    selector: 'my-home',
    templateUrl: './home.component.html'
})
export class HomeComponent {

    facets: Facet[] = [];

    fileTypes: Facet[] = [
        new Facet('.doc', {}, 8),
        new Facet('.html', {}, 5),
        new Facet('.pdf', {}, 15),
        new Facet('.ppt', {}, 11),
        new Facet('.xls', {}, 9),
        new Facet('.docx', {}, 8),
        new Facet('.dhtml', {}, 5),
        new Facet('.pdfs', {}, 15),
        new Facet('.pptx', {}, 11),
        new Facet('.xlsx', {}, 9)
    ];
}