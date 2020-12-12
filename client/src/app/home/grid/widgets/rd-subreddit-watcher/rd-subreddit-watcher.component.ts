import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardService } from '../../../../shared/services/dashboard.service';
import { interval, Subscription } from 'rxjs';
import { faReddit } from '@fortawesome/free-brands-svg-icons';
import { DashboardWidget } from '../dashboard-widgets';
import { mergeMap } from 'rxjs/operators';
import { Subreddit } from '../../../../shared/interfaces/subreddit';

interface SubredditCreationFormatted {
    created: string;
}

@Component({
    selector: 'app-rd-subreddit-watcher',
    templateUrl: './rd-subreddit-watcher.component.html',
    styleUrls: [ './rd-subreddit-watcher.component.scss' ]
})
export class RdSubredditWatcherComponent implements OnInit,
                                                    OnDestroy,
                                                    DashboardWidget {

    id: string;
    refreshRate: number;

    isRedditAuthed = false;
    isLoading = true;
    searchBuffer = '';
    search = '';
    subreddit: Subreddit & SubredditCreationFormatted = null;
    request: Subscription;
    faReddit = faReddit;

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
        this.dashboardService.isRedditLogged().subscribe(isAuthenticated => {
            this.isRedditAuthed = isAuthenticated.authenticated;
            if (!this.isRedditAuthed) {
                this.isLoading = false;
                return;
            }
            this.loadConfig();
        }, _ => {
            this.isLoading = false;
            this.isRedditAuthed = false;
        });
    }

    ngOnDestroy(): void {
        this.clearRequest();
    }

    onLoginClick(): void {
        window.location.href = '/api/connect/reddit';
    }

    reset(): void {
        this.clearRequest();
        this.search = '';
        this.isLoading = false;
        this.subreddit = null;
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
        this.getSubredditInfos();
        this.saveConfig();
    }

    getSubredditInfos(): void {
        this.isLoading = true;
        this.dashboardService.getSubredditInfos(this.search)
            .subscribe(
                (stream) => this.getSubredditNextCb(stream),
                (error) => this.getSubredditErrorCb(error)
            );
    }

    getSubredditNextCb(subreddit): void {
        if (!subreddit) {
            this.reset();
        } else {
            this.subreddit = {
                ...subreddit,
                created: new Date(subreddit.created_utc * 1000).toLocaleDateString()
            };
            this.isLoading = false;
        }
    }

    getSubredditErrorCb(error): void {
        if (error && error.status === 403) {
            this.isRedditAuthed = false;
        }
        this.reset();
    }

    startRequest(): void {
        this.clearRequest();
        this.request = interval(this.refreshRate * 1000).pipe(mergeMap(() => {
            return this.dashboardService.getSubredditInfos(this.search);
        })).subscribe(
            (subreddit) => this.getSubredditNextCb(subreddit),
            (error) => this.getSubredditErrorCb(error)
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
