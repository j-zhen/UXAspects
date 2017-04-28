import { Component } from '@angular/core';
import { Facet } from '../../components/facets/index';

@Component({
    selector: 'my-home',
    templateUrl: './home.component.html'
})
export class HomeComponent {

    facets: Facet[] = [
        {
            title: '.doc'
        },
        {
            title: '.ppt'
        }
    ];

    click() {
        let a = this.facets;
        debugger;
    }
}