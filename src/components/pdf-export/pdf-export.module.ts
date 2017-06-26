import { NgModule } from '@angular/core';
import { PdfExportContainerComponent, PdfExportItemDirective, PdfExportBoxDirective } from './pdf-export-container.component';
import { PdfExportService } from './pdf-export.service';

const DECLARATIONS = [
    PdfExportContainerComponent,
    PdfExportItemDirective,
    PdfExportBoxDirective
];

@NgModule({
    exports: DECLARATIONS,
    declarations: DECLARATIONS,
    providers: [PdfExportService]
})
export class PdfExportModule {}