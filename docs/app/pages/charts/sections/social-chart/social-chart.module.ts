import { NgModule, ComponentFactoryResolver } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { ChartsSocialChartNg1Component } from './social-chart-ng1/social-chart-ng1.component';
import { ResolverService } from '../../../../services/resolver/resolver.service';
import { DocumentationComponentsModule } from '../../../../components/components.module';
import { WrappersModule } from '../../../../wrappers.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { DocumentationCategoryComponent } from '../../../../components/documentation-category/documentation-category.component';

const SECTIONS = [
    ChartsSocialChartNg1Component
];

const ROUTES = [
    {
        path: '**',
        component: DocumentationCategoryComponent,
        data: {
            category: {
                title: 'Social Chart',
                link: 'social-chart',
                sections: [
                    {
                        title: 'Social Chart',
                        component: 'ChartsSocialChartNg1Component',
                        version: 'AngularJS'
                    }
                ]
            }
        }
    }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        TabsModule,
        WrappersModule,
        DocumentationComponentsModule,
        RouterModule.forChild(ROUTES)
    ],
    exports: SECTIONS,
    declarations: SECTIONS,
    entryComponents: SECTIONS
})
export class SocialChartModule {

    constructor(componentFactoryResolver: ComponentFactoryResolver, resolverService: ResolverService) {
        resolverService.registerResolver(componentFactoryResolver);
    }
}
