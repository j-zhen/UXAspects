import { Component} from '@angular/core';

@Component({
    selector: 'ux-column-sorting',
    templateUrl: './column-sorting.component.html',
    styleUrls: ['./column-sorting.component.less'],
    host: {
        '(click)': 'toggle()'
    }
})
export class ColumnSortingComponent {

    iconVisible = false;
    ascending = true;

    toggle() {
        if (!this.ascending) {
            this.ascending = true;
            this.iconVisible = false;
        } else if (!this.iconVisible) {
            this.iconVisible = true;
        } else {
            this.ascending = false;
        }
    }
}
