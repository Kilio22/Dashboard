import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GridComponent } from './grid.component';
import {
    NbButtonModule,
    NbCardModule,
    NbDialogModule,
    NbFormFieldModule,
    NbIconModule,
    NbInputModule,
    NbLayoutModule,
    NbPopoverModule,
    NbProgressBarModule,
    NbSelectModule,
    NbSpinnerModule,
    NbThemeModule
} from '@nebular/theme';
import { GridsterModule } from 'angular-gridster2';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { MsCalendarComponent } from './widgets/ms-calendar/ms-calendar.component';
import { MsMailComponent } from './widgets/ms-mail-component/ms-mail.component';
import { TtvUserWatcherComponent } from './widgets/ttv-user-watcher/ttv-user-watcher.component';
import { TtvStreamWatcherComponent } from './widgets/ttv-stream-watcher/ttv-stream-watcher.component';
import { YtChannelWatcherComponent } from './widgets/yt-channel-watcher/yt-channel-watcher.component';
import { YtVideoWatcherComponent } from './widgets/yt-video-watcher/yt-video-watcher.component';
import { WidgetRenderDirective } from './shared/widget-render.directive';
import { GridHeaderComponent } from './grid-header/grid-header.component';
import { RefreshRateInputDialogComponent } from './grid-header/refresh-rate-input-dialog/refresh-rate-input-dialog.component';
import { SpotifyArtistComponent } from './widgets/spotify-artist/spotify-artist.component';
import { RdSubredditWatcherComponent } from './widgets/rd-subreddit-watcher/rd-subreddit-watcher.component';
import { WeatherComponent } from './widgets/weather/weather.component';

/**
 * The Grid module.
 *
 * Declares all necessary components to render the widget grid and imports all necessary modules.
 */
@NgModule({
    declarations: [
        GridComponent,
        GridHeaderComponent,
        RefreshRateInputDialogComponent,
        MsCalendarComponent,
        MsMailComponent,
        TtvUserWatcherComponent,
        TtvStreamWatcherComponent,
        YtChannelWatcherComponent,
        YtVideoWatcherComponent,
        WidgetRenderDirective,
        SpotifyArtistComponent,
        RdSubredditWatcherComponent,
        WeatherComponent
    ],
    exports: [
        GridComponent
    ],
    imports: [
        CommonModule,
        NbLayoutModule,
        NbThemeModule,
        NbIconModule,
        GridsterModule,
        NbSelectModule,
        FontAwesomeModule,
        NbCardModule,
        NgbModule,
        NbButtonModule,
        NbPopoverModule,
        NbInputModule,
        NbDialogModule.forRoot(),
        NbSpinnerModule,
        NbFormFieldModule,
        FormsModule,
        NbProgressBarModule
    ]
})
export class GridModule {
}
