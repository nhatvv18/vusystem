import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { APP_BASE_HREF, CommonModule, HashLocationStrategy, LocationStrategy } from '@angular/common';

// Application Components
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppMainComponent } from './layout/main/app.main.component';
import { AppMenuComponent } from './layout/menu/app.menu.component';
import { AppMenuitemComponent } from './layout/menu/app.menuitem.component';
import { AppBreadcrumbComponent } from './layout/breadcrumb/app.breadcrumb.component';
import { AppTopBarComponent } from './layout/top-bar/app.topbar.component';
import { AppFooterComponent } from './layout/footer/app.footer.component';


import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { ReactiveFormsModule } from '@angular/forms';

// Application services
import { BreadcrumbService } from './layout/breadcrumb/breadcrumb.service';
import { MenuService } from './layout/menu/app.menu.service';

import { AngularEditorModule } from '@kolkov/angular-editor';


import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { HomeComponent } from './home/home.component';
import { SharedModule } from '@shared/shared.module';

import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';

import { KeyFilterModule } from 'primeng/keyfilter';

import { LoginUrlComponent } from './login-url/login-url.component';
import { FormSetDisplayColumnComponent } from './form-general/form-set-display-column/form-set-display-column/form-set-display-column.component';
import { UploadImageComponent } from './components-general/upload-image/upload-image.component';

import * as index from './index'
import { FullCalendarModule } from '@fullcalendar/angular';

FullCalendarModule.registerPlugins([
    dayGridPlugin,
    timeGridPlugin,
    interactionPlugin
]);

@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        HttpClientModule,
        ...index.modules,
    ],

    declarations: [
        AppComponent,
        AppMainComponent,
        AppMenuComponent,
        AppMenuitemComponent,
        AppTopBarComponent,
        AppFooterComponent,
        AppBreadcrumbComponent,
        HomeComponent,
        UploadImageComponent,
        LoginUrlComponent,
        FormSetDisplayColumnComponent,
    ],

    entryComponents: [
    ],

    providers: [
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        MenuService,
        BreadcrumbService,
        DialogService,
    ],
    
    bootstrap: [AppComponent]
})
export class AppModule {
}
