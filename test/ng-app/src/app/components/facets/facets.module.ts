import { NgModule } from '@angular/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { CommonModule } from '@angular/common';
import { ResizeModule } from '../../directives/resize/index';
import { OverflowTooltipModule } from '../../directives/overflow-tooltip/index';
import { FacetContainerComponent } from './facet-container.component';
import { FacetBaseComponent } from './base/facet-base/facet-base.component';
import { FacetHeaderComponent } from './base/facet-header/facet-header.component';
import { FacetCheckListComponent } from './facet-check-list/facet-check-list.component';

const DECLARATIONS = [
    FacetContainerComponent,
    FacetHeaderComponent,
    FacetBaseComponent,
    FacetCheckListComponent
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
