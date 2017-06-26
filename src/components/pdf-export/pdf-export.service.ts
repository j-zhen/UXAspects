import { Injectable } from '@angular/core';
import { PdfExportItemDirective } from './pdf-export-container.component';

@Injectable()
export class PdfExportService {

    private _items: PdfExportItemDirective[] = [];

    registerItem(item: PdfExportItemDirective): void {
        this._items.push(item);
    }

    unregisterItem(item: PdfExportItemDirective): void {
        let idx = this._items.indexOf(item);

        if (idx !== -1) {
            this._items.splice(idx, 1);
        }
    }

    getDocument(): HTMLDivElement[] {

        // group items by row
        let groupings: PDFExportGrouping[] = [];

        this._items.forEach(item => {

            let row = groupings.find(group => group.row === item.row);

            if (!row) {
                groupings.push({ row: item.row, items: [{ columns: item.columns, element: this.clone(item.getElement()) }] });
            } else {
                row.items.push({ columns: item.columns, element: this.clone(item.getElement()) });
            }
        });

        // map to an html structure
        let rows = groupings.map(rowData => {
            let row = document.createElement('div');
            row.classList.add('row');

            rowData.items.forEach(item => {
                let column = document.createElement('div');

                if (item.columns) {
                    column.classList.add(`col-md-${item.columns}`);
                }

                row.appendChild(column);
            });

            return row;
        });

        return rows;
    }

    private clone(element: HTMLElement): HTMLElement {
        return element instanceof HTMLCanvasElement ? this.cloneCanvas(element) : this.cloneElement(element);
    }

    private cloneCanvas(canvas: HTMLCanvasElement): HTMLImageElement {

        // extract canvas image
        let imageUrl = canvas.toDataURL();
        let imgElement = document.createElement('img');
        imgElement.src = imageUrl;

        this.applyStyles(canvas, imgElement);

        return imgElement;
    }

    private cloneElement(element: HTMLElement): HTMLElement {

        // create a duplicate of the element
        let clone = element.cloneNode(true) as HTMLElement;

        // get all the styles applied to the element and inline them
        this.applyStyles(element, clone);

        return clone;
    }

    private applyStyles(source: HTMLElement, target: HTMLElement): void {

        // iterate each style on the source element and apply it to the target
        for (let style of Object.keys(source.style)) {
            target.style[style] = source.style[style];
        }

        // apply styles to all children too
        for (let childIdx = 0; childIdx < source.children.length; childIdx++) {
            this.applyStyles(source.children.item(childIdx) as HTMLElement, target.children.item(childIdx) as HTMLElement);
        }
    }

}

export interface PDFExportGrouping {
    row: number;
    items: [{
        columns: number;
        element: HTMLElement;
    }];
}