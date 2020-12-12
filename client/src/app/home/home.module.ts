import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { HomeComponent } from './home.component';
import { GridModule } from './grid/grid.module';
import {
    NbActionsModule,
    NbContextMenuModule,
    NbIconModule,
    NbLayoutModule,
    NbMenuModule,
    NbSidebarModule,
    NbUserModule
} from '@nebular/theme';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NbEvaIconsModule } from '@nebular/eva-icons';

/**
 * The Home module.
 *
 * Declares components of Home page and imports necessary modules.
 */
@NgModule({
    declarations: [
        HeaderComponent,
        FooterComponent,
        HomeComponent
    ],
    exports: [
        FooterComponent,
        HeaderComponent
    ],
    imports: [
        CommonModule,
        GridModule,
        NbLayoutModule,
        NbSidebarModule,
        NbMenuModule,
        NgbModule,
        NbActionsModule,
        NbUserModule,
        NbContextMenuModule,
        NbIconModule,
        NbEvaIconsModule
    ]
})
export class HomeModule {
}
