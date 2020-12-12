import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardService } from '../../../../shared/services/dashboard.service';
import { interval, Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { DashboardWidget } from '../dashboard-widgets';
import { faTwitch } from '@fortawesome/free-brands-svg-icons';
import { TtvStream } from '../../../../shared/interfaces/ttv-stream';

@Component({
    selector: 'app-ttv-stream-watcher',
    templateUrl: './ttv-stream-watcher.component.html',
    styleUrls: [ './ttv-stream-watcher.component.scss' ]
})
export class TtvStreamWatcherComponent implements OnInit,
                                                  OnDestroy,
                                                  DashboardWidget {

    id: string;
    refreshRate: number;

    isTwitchAuthed = false;
    isLoading = true;
    searchBuffer = '';
    search = '';
    stream: TtvStream = null;
    request: Subscription;
    faTwitch = faTwitch;

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
        this.dashboardService.isTwitchLogged().subscribe(isAuthenticated => {
            this.isTwitchAuthed = isAuthenticated.authenticated;
            if (!this.isTwitchAuthed) {
                this.isLoading = false;
                return;
            }
            this.loadConfig();
        }, _ => {
            this.isLoading = false;
            this.isTwitchAuthed = false;
        });
    }

    ngOnDestroy(): void {
        this.clearRequest();
    }

    onLoginClick(): void {
        window.location.href = '/api/connect/twitch';
    }

    reset(): void {
        this.clearRequest();
        this.search = '';
        this.isLoading = false;
        this.stream = null;
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
        this.getStreamInfos();
        this.saveConfig();
    }

    getStreamInfos(): void {
        this.isLoading = true;
        this.dashboardService.getTwitchStreamInfos(this.search)
            .subscribe(
                (stream) => this.getStreamNextCb(stream),
                (error) => this.getStreamErrorCb(error)
            );
    }

    getStreamNextCb(stream): void {
        if (!stream) {
            this.reset();
        } else {
            stream.started_at = new Date(stream.started_at).toLocaleDateString();
            this.stream = stream;
            this.isLoading = false;
        }
    }

    getStreamErrorCb(error): void {
        if (error && error.status === 403) {
            this.isTwitchAuthed = false;
        }
        this.reset();
    }

    startRequest(): void {
        this.clearRequest();
        this.request = interval(this.refreshRate * 1000).pipe(mergeMap(() => {
            return this.dashboardService.getTwitchStreamInfos(this.search);
        })).subscribe(
            (stream) => this.getStreamNextCb(stream),
            (error) => this.getStreamErrorCb(error)
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
