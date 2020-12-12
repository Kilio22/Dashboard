import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardWidget } from '../dashboard-widgets';
import { DashboardService } from '../../../../shared/services/dashboard.service';
import { interval, Subscription } from 'rxjs';
import { faTwitch } from '@fortawesome/free-brands-svg-icons';
import { mergeMap } from 'rxjs/operators';
import { TtvUser } from '../../../../shared/interfaces/ttv-user';

@Component({
    selector: 'app-ttv-user-watcher',
    templateUrl: './ttv-user-watcher.component.html',
    styleUrls: [ './ttv-user-watcher.component.scss' ]
})
export class TtvUserWatcherComponent implements OnInit,
                                                OnDestroy,
                                                DashboardWidget {
    id: string;
    refreshRate: number;

    isTwitchAuthed = false;
    isLoading = true;
    searchBuffer = '';
    search = '';
    user: TtvUser = null;
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
        this.user = null;
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
        this.getUserInfos();
        this.saveConfig();
    }

    getUserInfos(): void {
        this.isLoading = true;
        this.dashboardService.getTwitchUserInfos(this.search)
            .subscribe(
                (user) => this.getUserNextCb(user),
                (error) => this.getUserErrorCb(error)
            );
    }

    getUserNextCb(user): void {
        if (!user) {
            this.reset();
        } else {
            user.created_at = new Date(user.created_at).toLocaleDateString();
            this.user = user;
            this.isLoading = false;
        }
    }

    getUserErrorCb(error): void {
        if (error && error.status === 403) {
            this.isTwitchAuthed = false;
        }
        this.reset();
    }

    startRequest(): void {
        this.clearRequest();
        this.request = interval(this.refreshRate * 1000).pipe(mergeMap(() => {
            return this.dashboardService.getTwitchUserInfos(this.search);
        })).subscribe(
            (user) => this.getUserNextCb(user),
            (error) => this.getUserErrorCb(error)
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
