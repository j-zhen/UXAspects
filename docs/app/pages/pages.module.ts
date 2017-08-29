import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { LandingPageComponent } from './landing/landing.component';
import { OverviewPageComponent } from './overview/overview.component';
import { FeaturesPageComponent } from './features/features.component';
import { GettingStartedPageComponent } from './getting-started/getting-started.component';
import { ShowcasePageComponent } from './showcase/showcase.component';
import { TeamPageComponent } from './team/team.component';
import { BlogPageComponent } from './blog/blog.component';
import { LicensesPageComponent } from './licenses/licenses.component';
import { ChangeLogPageComponent } from './changelog/changelog.component';
import { DocumentationComponentsModule } from '../components/components.module';
import { DocumentationDirectivesModule } from '../directives/directives.module';
import { DocumentationProvidersModule } from '../services/services.module';
import { WrappersModule } from '../wrappers.module';

const DECLARATIONS = [
    LandingPageComponent,
    OverviewPageComponent,
    FeaturesPageComponent,
    GettingStartedPageComponent,
    ShowcasePageComponent,
    TeamPageComponent,
    BlogPageComponent,
    LicensesPageComponent,
    ChangeLogPageComponent,
];

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        FormsModule,
        DocumentationComponentsModule,
        DocumentationDirectivesModule,
        DocumentationProvidersModule,
        WrappersModule,
    ],
    declarations: DECLARATIONS
})
export class PagesModule {}
