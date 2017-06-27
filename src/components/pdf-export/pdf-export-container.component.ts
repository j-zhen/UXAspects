import { Component, Directive, ContentChildren, QueryList, ElementRef, OnInit, OnDestroy, Input, ViewChild, TemplateRef, ViewChildren, ViewContainerRef } from '@angular/core';
import { PdfExportService } from './pdf-export.service';

@Directive({
    selector: '[pdfExportItem]'
})
export class PdfExportItemDirective implements OnInit, OnDestroy {

    @Input() row: number;
    @Input() columns: number;

    constructor(private _elementRef: ElementRef, private _pdfExportService: PdfExportService, 
        private _viewContainerRef: ViewContainerRef, private _templateRef: TemplateRef<any>) { 

        // this has a second variable that is for data, look it up :)
        
        // embededView.rootNodes // this is the nodes which are never on the page (this will get moved to the getElement function)

    }

    ngOnInit(): void {
        this._pdfExportService.registerItem(this);
    }

    ngOnDestroy(): void {
        this._pdfExportService.unregisterItem(this);
    }

    getElement(): HTMLElement {

        // this isnt going to work properly becuase of all the clone stuff so it may require some reworking on monday.

        let embededView = this._viewContainerRef.createEmbeddedView(this._templateRef);
        let nodes: any;
        if (embededView) {
            nodes = embededView.rootNodes;
            for (let i = 0; i < nodes.lenght; i++) {
                let node = nodes[i];
                if (node instanceof HTMLElement) {
                    return node;
                }
            }
        } else {
            return this._elementRef.nativeElement as HTMLElement;
        }
    }
}

// @Component({
//     selector: 'ux-pdf-export-container',
//     templateUrl: './pdf-export-container.component.html'
// })
// export class PdfExportContainerComponent { 
    
//     @ContentChildren(PdfExportItemDirective) contentChildren: QueryList<PdfExportItemDirective>;=

//     content: string = '';
//     styles: string[] = [];
//     iframe: any;
//     fullHtml: string = '';
//     link = '';
//     boxOpening: string = '';
//     boxClosing: string = '';

//     ngAfterContentInit() {
//         this.createIframe(); 
//     }


//     getContent() {
//         this.content = this.boxOpening;
//         // get computed styles and add to content
//         this.contentChildren.forEach(child => {
//             let childElement = child.getElement().cloneNode(true) as HTMLElement;
//             let height = childElement.style.height || '';
//             let width = childElement.style.width || '';
//             for (let prop of child.getElement().style as any) {
//                 childElement.style[prop] = child.getElement().style[prop];
//             }
//             childElement.style.height = width;
//             childElement.style.width = height;

//             let children = childElement.getElementsByTagName('*');
//             let originalChildren = child.getElement().querySelectorAll('*');

//             for (let i = 0; i < children.length; i++) {
//                 if (children[i].tagName === 'CANVAS') {
//                     // convert canvas to an image
//                     let parentElement = children[i].parentNode;
//                     let image = (<HTMLCanvasElement>originalChildren[i]).toDataURL();
//                     let imageElement = document.createElement('img');
//                     imageElement.src = image;
//                     parentElement.replaceChild(imageElement, children[i]);
//                 }

//                 let element = originalChildren.item(0) as HTMLElement;
//                 let childHeight = (<HTMLElement>originalChildren[i]).style.height || '';
//                 let childWidth = (<HTMLElement>originalChildren[i]).style.width || '';

//                 for (let prop of element.style as any) {
//                     let chld = children.item(i) as HTMLElement;
//                     chld.style[prop] = element.style[prop];
//                 }

//                 (<HTMLElement>children[i]).style.height = width;
//                 (<HTMLElement>children[i]).style.width = height;

//             }
//             this.content += childElement.outerHTML + '\n';
//         });

//         this.content += this.boxClosing;
//         this.content += `<script type="text/javascript" src="polyfills.js"></script><script type="text/javascript" src="vendor.js"></script><script type="text/javascript" src="app.js"></script>`;
//         this.link = `<link rel="shortcut icon" href="favicon.ico"><link href="styles.css" rel="stylesheet">`;      
        
//         // get full HTML
//         this.fullHtml = `<head>` + this.link + `</head><body>` + this.content + `</body>`;
//     }

//     createIframe() {
//         // create iframe ( dont know if we want this all yet)
//         this.link = `<link rel="shortcut icon" href="favicon.ico"><link href="styles.css" rel="stylesheet">`; 
//         this.iframe = document.createElement('iframe');
//         this.iframe.setAttribute('hidden', 'true');
//         document.body.appendChild(this.iframe);
//         let linkElement = document.createElement('span');
//         linkElement.innerHTML = this.link;
//         // need the timeout for firefox
//         setTimeout(() => {
//             this.iframe.contentDocument.head.appendChild(linkElement);
//         });
//     }

//     showIframe() {
//         this.iframe.removeAttribute('hidden');         
//         this.getContent();
//         let contentElement = document.createElement('span');
//         contentElement.innerHTML = this.content;
//         setTimeout(() => {
//             this.iframe.contentDocument.body.appendChild(contentElement);
//         });
//     }

//     openWindow() {
//         this.getContent();
//         window.open('about:blank', '', '_blank').document.write(this.fullHtml);
//     }

    
// }