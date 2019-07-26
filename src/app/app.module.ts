import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { DateModule } from './DateModule';
import { NumberModule } from './NumberModule';
import { DialogModule } from './Dialog';
import { TabbedViewModule } from './TabbedView';
import { OrganisationalUnitSelectorModule } from './OrganisationalUnitSelector';
import { OrganisationalUnitSelectorModuleV2 } from './OrganisationalUnitSelectorV2';
import { ErrorModule } from './ErrorModule';
import { TextModel } from './TextModel';
import { AssessmentViewer } from './AssessmentViewer';
import { AppComponent }  from './app.component';
import { TestTab } from './TestTab';

@NgModule(
{
    imports:
    [
        BrowserModule,
        FormsModule,
        DateModule,
        NumberModule,
        DialogModule,
        TabbedViewModule,
        OrganisationalUnitSelectorModule,
        OrganisationalUnitSelectorModuleV2,
        ErrorModule
    ],
    declarations:
    [
        AppComponent,
        TextModel,
        TestTab,
        AssessmentViewer
    ],
    entryComponents:
    [
        TestTab
    ],
    bootstrap:
    [
        AppComponent
    ]
})
export class AppModule
{ }
