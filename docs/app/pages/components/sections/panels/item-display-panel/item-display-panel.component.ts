import { Component } from '@angular/core';
import { DocumentationSectionComponent } from '../../../../../decorators/documentation-section-component';
import { BaseDocumentationSection } from '../../../../../components/base-documentation-section/base-documentation-section';
import 'chance';

@Component({
    selector: 'uxd-item-display-panel-component',
    templateUrl: './item-display-panel.component.html'
})
@DocumentationSectionComponent('ComponentsItemDisplayPanelComponent')
export class ComponentsItemDisplayPanelComponent {

    togglePanel() {
        console.log('togglePanel');
    }

    items = [{
                'name': chance.name(),
                'dateString': '3 Oct 2015',
                'document': 'Document 4.ppt',
                'extension': '.ppt',
                'storage': '95.25',
                'active': false,
                'panel': {
                    'title': 'Site Detail - UX Aspects (PPT)',
                    'main': 'modalPPT.html',
                    'footer': 'item-display-panel-ng1/modalFooter.html',
                    'modalColumns': 'col-lg-6 col-md-7 col-sm-9 col-xs-10',
                    'reference': 'uxd-navigation-bar',
                    'top': 53
                }
            }, {
                'name': chance.name(),
                'dateString': '3 Oct 2015',
                'document': 'Document 9.pdf',
                'extension': '.pdf',
                'storage': '15.25',
                'active': true,
                'panel': {
                    'title': 'Site Detail - UX Aspects (PDF)',
                    'main': 'modalPDF.html',
                    'footer': 'item-display-panel-ng1/modalFooter.html',
                    'modalColumns': 'col-lg-6 col-md-7 col-sm-9 col-xs-10',
                    'reference': 'uxd-navigation-bar',
                    'top': 53
                }
            }, {
                'name': chance.name(),
                'dateString': '3 Oct 2015',
                'document': 'Document 14.doc',
                'extension': '.doc',
                'storage': '25.25',
                'active': false,
                'panel': {
                    'title': 'Site Detail - UX Aspects (DOC)',
                    'main': 'modalDOC.html',
                    'footer': 'item-display-panel-ng1/modalFooter.html',
                    'modalColumns': 'col-lg-6 col-md-7 col-sm-9 col-xs-10',
                    'reference': 'uxd-navigation-bar',
                    'top': 53
                }
            }, {
                'name': chance.name(),
                'dateString': '3 Oct 2015',
                'document': 'Document 29.pdf',
                'extension': '.pdf',
                'storage': '15.25',
                'active': true,
                'panel': {
                    'title': 'Site Detail - UX Aspects (PDF)',
                    'main': 'modalPDF.html',
                    'footer': 'item-display-panel-ng1/modalFooter.html',
                    'modalColumns': 'col-lg-6 col-md-7 col-sm-9 col-xs-10',
                    'reference': 'uxd-navigation-bar',
                    'top': 53
                }
            }, {
                'name': chance.name(),
                'dateString': '3 Oct 2015',
                'document': 'Document 34.pdf',
                'extension': '.pdf',
                'storage': '15.25',
                'active': false,
                'panel': {
                    'title': 'Site Detail - UX Aspects (PDF)',
                    'main': 'modalPDF.html',
                    'footer': 'item-display-panel-ng1/modalFooter.html',
                    'modalColumns': 'col-lg-6 col-md-7 col-sm-9 col-xs-10',
                    'reference': 'uxd-navigation-bar',
                    'top': 53
                }
            }];

}
