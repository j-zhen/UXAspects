import { NgModule } from '@angular/core';

import { OverflowTooltipDirective } from './overflow-tooltip.directive';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { ResizeModule } from '../resize/index';

@NgModule({
    imports: [
        ResizeModule,
        TooltipModule.forRoot()
    ],
    exports: [OverflowTooltipDirective],
    declarations: [OverflowTooltipDirective]
})
export class OverflowTooltipModule { }
