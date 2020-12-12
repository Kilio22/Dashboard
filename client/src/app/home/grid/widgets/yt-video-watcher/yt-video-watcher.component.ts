import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardService } from '../../../../shared/services/dashboard.service';
import { interval, Subscription } from 'rxjs';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { DashboardWidget } from '../dashboard-widgets';
import { faComment, faThumbsDown, faThumbsUp } from '@fortawesome/free-solid-svg-icons';
import { mergeMap } from 'rxjs/operators';
import { YtVideo } from '../../../../shared/interfaces/yt-video';

@Component({
    selector: 'app-yt-video-watcher',
    templateUrl: './yt-video-watcher.component.html',
    styleUrls: [ './yt-video-watcher.component.scss' ]
})
export class YtVideoWatcherComponent implements OnInit,
                                                OnDestroy,
                                                DashboardWidget {
    id: string;
    refreshRate: number;

    isGoogleAuthed = false;
    isLoading = true;
    searchBuffer = '';
    search = '';
    video: YtVideo = null;
    request: Subscription;
    faGoogle = faGoogle;
    faThumbUp = faThumbsUp;
    faThumbDown = faThumbsDown;
    faComment = faComment;

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
        this.video = null;
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
        this.getVideoInfos();
        this.saveConfig();
    }

    getVideoInfos(): void {
        this.isLoading = true;
        this.dashboardService.getYoutubeVideoInfos(this.search)
            .subscribe(
                (video) => this.getVideoNextCb(video),
                (error) => this.getVideoErrorCb(error)
            );
    }

    getVideoNextCb(video): void {
        if (!video) {
            this.reset();
        } else {
            this.video = video;
            this.isLoading = false;
        }
    }

    getVideoErrorCb(error): void {
        if (error && error.status === 403) {
            this.isGoogleAuthed = false;
        }
        this.reset();
    }

    startRequest(): void {
        this.clearRequest();
        this.request = interval(this.refreshRate * 1000).pipe(mergeMap(() => {
            return this.dashboardService.getYoutubeVideoInfos(this.search);
        })).subscribe(
            (video) => this.getVideoNextCb(video),
            (error) => this.getVideoErrorCb(error)
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
