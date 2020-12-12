import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardService } from '../../../../shared/services/dashboard.service';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { interval, Subscription } from 'rxjs';
import { DashboardWidget } from '../dashboard-widgets';
import { mergeMap } from 'rxjs/operators';
import { YtChannel } from '../../../../shared/interfaces/yt-channel';

@Component({
    selector: 'app-yt-subscriber-count',
    templateUrl: './yt-channel-watcher.component.html',
    styleUrls: [ './yt-channel-watcher.component.scss' ]
})
export class YtChannelWatcherComponent implements OnInit,
                                                  OnDestroy,
                                                  DashboardWidget {
    id: string;
    refreshRate: number;

    isGoogleAuthed = false;
    isLoading = true;
    searchBuffer = '';
    search = '';
    channel: YtChannel = null;
    request: Subscription;
    faGoogle = faGoogle;

    setRefreshRate(rate: number): void {
        if (this.refreshRate === rate) {
            return;
        }
        this.refreshRate = rate;
        if (this.search.trim()) {
            this.startRequest();
        }
    }

    constructor(private dashboardService: DashboardService) {
    }

    ngOnInit(): void {
        this.dashboardService.isGoogleLogged().subscribe(isAuthenticated => {
            this.isGoogleAuthed = isAuthenticated.authenticated;
            if (!this.isGoogleAuthed) {
                this.isLoading = false;
                return;
            }
            this.loadConfig();
        }, _ => {
            this.isLoading = false;
            this.isGoogleAuthed = false;
        });
    }

    ngOnDestroy(): void {
        this.clearRequest();
    }

    onLoginClick(): void {
        window.location.href = '/api/connect/google';
    }

    reset(): void {
        this.clearRequest();
        this.search = '';
        this.isLoading = false;
        this.channel = null;
        this.saveConfig();
    }

    clearRequest(): void {
        if (this.request && !this.request.closed) {
            this.request.unsubscribe();
            this.request = null;
        }
    }

    onSubmit(): void {
        if (this.searchBuffer.trim() === '') {
            this.reset();
            return;
        }

        this.search = this.searchBuffer;
        if (!this.request) {
            this.startRequest();
        }
        this.getChannelInfos();
        this.saveConfig();
    }

    getChannelInfos(): void {
        this.isLoading = true;
        this.dashboardService.getYoutubeChannelInfos(this.search)
            .subscribe(
                (channel) => this.getChannelNextCb(channel),
                (error) => this.getChannelErrorCb(error)
            );
    }

    getChannelNextCb(channel): void {
        if (!channel) {
            this.reset();
        } else {
            this.channel = channel;
            this.isLoading = false;
        }
    }

    getChannelErrorCb(error): void {
        if (error && error.status === 403) {
            this.isGoogleAuthed = false;
        }
        this.reset();
    }

    startRequest(): void {
        this.clearRequest();
        this.request = interval(this.refreshRate * 1000).pipe(mergeMap(() => {
            return this.dashboardService.getYoutubeChannelInfos(this.search);
        })).subscribe(
            (channel) => this.getChannelNextCb(channel),
            (error) => this.getChannelErrorCb(error)
        );
    }

    loadConfig(): void {
        this.isLoading = true;
        this.dashboardService.getWidgetConfig(this.id).subscribe(config => {
            this.searchBuffer = config.query;
            this.onSubmit();
        }, _ => {
            this.isLoading = false;
        });
    }

    saveConfig(): void {
        this.dashboardService.saveQueryConfig({id: this.id, query: this.search.trim()}).subscribe({
            error: err => {
                console.error(err);
            }
        });
    }

}
