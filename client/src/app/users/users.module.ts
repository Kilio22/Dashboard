import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {
    NbActionsModule,
    NbCardModule,
    NbContextMenuModule,
    NbFormFieldModule,
    NbIconModule,
    NbLayoutModule,
    NbMenuModule,
    NbSidebarModule,
    NbSpinnerModule,
    NbUserModule
} from '@nebular/theme';
import { GridModule } from '../home/grid/grid.module';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { HomeModule } from '../home/home.module';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';


@NgModule({
    declarations: [ UsersComponent ],
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
        NbEvaIconsModule,
        HomeModule,
        NbSpinnerModule,
        NbCardModule,
        FontAwesomeModule,
        NbFormFieldModule
    ]
})
export class UsersModule {
}
