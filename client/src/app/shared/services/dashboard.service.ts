import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Weather } from '../interfaces/weather';
import { Authenticated } from '../interfaces/authenticated';
import { SpotifyArtist } from '../interfaces/spotify-artist';
import { MicrosoftMail } from '../interfaces/microsoft-mail';
import { MicrosoftMailbox } from '../interfaces/microsoft-mailbox';
import { MicrosoftCalendarEvent } from '../interfaces/microsoft-calendar-event';
import { MicrosoftCalendar } from '../interfaces/microsoft-calendar';
import { WidgetConfig } from '../interfaces/widget-config';
import { WidgetQueryConfig } from '../interfaces/widget-query-config';
import { Id } from '../interfaces/id';
import { WidgetGridConfig } from '../interfaces/widget-grid-config';
import { Subreddit } from '../interfaces/subreddit';
import { TtvStream } from '../interfaces/ttv-stream';
import { TtvUser } from '../interfaces/ttv-user';
import { YtChannel } from '../interfaces/yt-channel';
import { User } from '../interfaces/user';

@Injectable({
    providedIn: 'root'
})
export class DashboardService {

    constructor(private httpClient: HttpClient) {
    }

    getUserProfile(): Observable<HttpResponse<User>> {
        return this.httpClient.get<User>('/api/user/profile', {
            observe: 'response',
            withCredentials: true
        });
    }

    getUsers(): Observable<(User & Id)[]> {
        return this.httpClient.get<(User & Id)[]>('/api/users', {
            withCredentials: true
        });
    }

    deleteUser(id: string): Observable<(User & Id)[]> {
        return this.httpClient.delete<(User & Id)[]>('/api/users/' + id, {
            withCredentials: true
        });
    }

    getYoutubeChannelInfos(username: string): Observable<YtChannel> {
        username = username.trim();
        if (!username) {
            return of(null);
        }

        return this.httpClient.get<YtChannel>('/api/google/channels/' + username, {
            withCredentials: true
        });
    }

    getYoutubeVideoInfos(url: string): Observable<YtChannel> {
        url = url.trim();
        if (!url) {
            return of(null);
        }
        const parsedUrl = new URL(url);
        if (!parsedUrl) {
            return of(null);
        }
        const videoId = parsedUrl.searchParams.get('v');
        if (!videoId) {
            return of(null);
        }
        return this.httpClient.get<YtChannel>('/api/google/videos/' + videoId, {
            withCredentials: true
        });
    }

    isGoogleLogged(): Observable<Authenticated> {
        return this.httpClient.get<Authenticated>('/api/google/logged', {
            withCredentials: true
        });
    }

    getTwitchUserInfos(username: string): Observable<TtvUser> {
        username = username.trim();
        if (!username) {
            return of(null);
        }

        return this.httpClient.get<TtvUser>('/api/twitch/users/' + username, {
            withCredentials: true
        });
    }

    getTwitchStreamInfos(username: string): Observable<TtvStream> {
        username = username.trim();
        if (!username) {
            return of(null);
        }

        return this.httpClient.get<TtvStream>('/api/twitch/streams/' + username, {
            withCredentials: true
        });
    }

    isTwitchLogged(): Observable<Authenticated> {
        return this.httpClient.get<Authenticated>('/api/twitch/logged', {
            withCredentials: true
        });
    }

    getSubredditInfos(subreddit: string): Observable<Subreddit> {
        subreddit = subreddit.trim();
        if (!subreddit) {
            return of(null);
        }
        if (subreddit.substr(0, 2) === '/r') {
            subreddit = subreddit.substring(2);
        }

        return this.httpClient.get<Subreddit>('/api/reddit/subreddits/' + subreddit, {
            withCredentials: true
        });
    }

    isRedditLogged(): Observable<Authenticated> {
        return this.httpClient.get<Authenticated>('/api/reddit/logged', {
            withCredentials: true
        });
    }

    saveGridConfig(configs: WidgetGridConfig[]): Observable<WidgetConfig> {
        return this.httpClient.post<WidgetConfig>('/api/user/widgets/grid', configs, {
            withCredentials: true
        });
    }

    removeWidgets(ids: Id[]): Observable<WidgetConfig> {
        const options = {
            headers: new HttpHeaders({
                'Content-Type': 'application/json'
            }),
            body: ids
        };

        return this.httpClient.delete<WidgetConfig>('/api/user/widgets', options);
    }

    saveQueryConfig(configs: WidgetQueryConfig): Observable<WidgetConfig> {
        return this.httpClient.post<WidgetConfig>('/api/user/widgets/query', [ configs ], {
            withCredentials: true
        });
    }

    getWidgetsConfig(): Observable<WidgetConfig[]> {
        return this.httpClient.get<WidgetConfig[]>('/api/user/widgets', {
            withCredentials: true
        });
    }

    getWidgetConfig(id: string): Observable<WidgetConfig> {
        return this.httpClient.get<WidgetConfig>('/api/user/widgets/' + id, {
            withCredentials: true
        });
    }

    getMicrosoftCalendars(): Observable<MicrosoftCalendar[]> {
        return this.httpClient.get<MicrosoftCalendar[]>('/api/microsoft/calendars', {
            withCredentials: true
        });
    }

    getMicrosoftCalendarEvents(calendarId: string): Observable<MicrosoftCalendarEvent[]> {
        return this.httpClient.get<MicrosoftCalendarEvent[]>('/api/microsoft/calendars/' + calendarId, {
            withCredentials: true
        });
    }

    getMicrosoftMailboxes(): Observable<MicrosoftMailbox[]> {
        return this.httpClient.get<MicrosoftMailbox[]>('/api/microsoft/mail/folders', {
            withCredentials: true
        });
    }

    getMicrosoftMails(mailboxId: string): Observable<MicrosoftMail[]> {
        return this.httpClient.get<MicrosoftMail[]>('/api/microsoft/mail/folders/' + mailboxId, {
            withCredentials: true
        });
    }

    isMicrosoftLogged(): Observable<Authenticated> {
        return this.httpClient.get<Authenticated>('/api/microsoft/logged', {
            withCredentials: true
        });
    }

    getSpotifyArtist(artistId: string): Observable<SpotifyArtist> {
        return this.httpClient.get<SpotifyArtist>('/api/spotify/artists/' + artistId, {
            withCredentials: true
        });
    }

    isSpotifyLogged(): Observable<Authenticated> {
        return this.httpClient.get<Authenticated>('/api/spotify/logged', {
            withCredentials: true
        });
    }

    getWeatherInfosByCity(city): Observable<Weather[]> {
        city = city.trim();
        if (!city) {
            return of(null);
        }
        return this.httpClient.get<Weather[]>('/api/weather', {
            withCredentials: true,
            params: {
                q: city,
                degree: 'C'
            }
        });
    }
}
