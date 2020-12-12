import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundComponent } from './not-found.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

/**
 * The NotFound module.
 *
 * Just declares {@link NotFoundComponent}.
 */
@NgModule({
    declarations: [
        NotFoundComponent
    ],
    imports: [
        CommonModule,
        NgbModule
    ]
})
export class NotFoundModule {
}
