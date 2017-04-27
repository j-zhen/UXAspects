import { NgModule } from '@angular/core';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FacetContainerComponent } from './facet-container.component';
import { CommonModule } from '@angular/common';

@NgModule({
    imports: [
        CommonModule,
        TooltipModule.forRoot()
    ],
    exports: [FacetContainerComponent],
    declarations: [FacetContainerComponent]
})
export class FacetsModule { }
