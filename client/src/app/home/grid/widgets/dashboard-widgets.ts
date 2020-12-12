import { YtChannelWatcherComponent } from './yt-channel-watcher/yt-channel-watcher.component';
import { YtVideoWatcherComponent } from './yt-video-watcher/yt-video-watcher.component';
import { TtvUserWatcherComponent } from './ttv-user-watcher/ttv-user-watcher.component';
import { TtvStreamWatcherComponent } from './ttv-stream-watcher/ttv-stream-watcher.component';
import { MsCalendarComponent } from './ms-calendar/ms-calendar.component';
import { MsMailComponent } from './ms-mail-component/ms-mail.component';
import { SpotifyArtistComponent } from './spotify-artist/spotify-artist.component';
import { RdSubredditWatcherComponent } from './rd-subreddit-watcher/rd-subreddit-watcher.component';
import { WeatherComponent } from './weather/weather.component';

export interface WidgetProps {
    id: string;
    name: string;
    desc: string;
    cols: number;
    rows: number;
}

export interface DashboardWidget {
    id: string;

    setRefreshRate(rate: number): void;
}

export const widgetComponents = {
    msCalendar: MsCalendarComponent,
    msMail: MsMailComponent,
    rdSubredditWatcher: RdSubredditWatcherComponent,
    spotifyArtist: SpotifyArtistComponent,
    ttvStreamWatcher: TtvStreamWatcherComponent,
    ttvUserWatcher: TtvUserWatcherComponent,
    weather: WeatherComponent,
    ytChannelWatcher: YtChannelWatcherComponent,
    ytVideoWatcher: YtVideoWatcherComponent
};
