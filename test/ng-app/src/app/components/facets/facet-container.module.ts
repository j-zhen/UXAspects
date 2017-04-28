import { NgModule } from '@angular/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FacetContainerComponent } from './facet-container.component';
import { CommonModule } from '@angular/common';
import { FacetHeaderComponent } from './base/facet-header/facet-header.component';
import { ResizeModule } from '../../directives/resize/index';
import { OverflowTooltipModule } from '../../directives/overflow-tooltip/index';


const DECLARATIONS = [
    FacetContainerComponent,
    FacetHeaderComponent
];

@NgModule({
    imports: [
        CommonModule,
        ResizeModule,
        OverflowTooltipModule,
        TooltipModule.forRoot()
    ],
    exports: DECLARATIONS,
    declarations: DECLARATIONS
})
export class FacetsModule { }
