import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardWidget } from '../dashboard-widgets';
import { faSpotify } from '@fortawesome/free-brands-svg-icons';
import { DashboardService } from '../../../../shared/services/dashboard.service';
import { NgForm } from '@angular/forms';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { interval, Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { SpotifyArtist } from '../../../../shared/interfaces/spotify-artist';

@Component({
    selector: 'app-spotify-artist',
    templateUrl: './spotify-artist.component.html',
    styleUrls: [ './spotify-artist.component.scss' ]
})
export class SpotifyArtistComponent implements OnInit, OnDestroy, DashboardWidget {

    id: string;
    refreshRate: number;

    isAuthenticated = false;
    isLoading = true;

    fetchArtistDataRequest: Subscription;

    artistQuery = '';
    currentArtist: SpotifyArtist;
    errorMsg = '';

    icons = {
        faSpotify,
        faTimes
    };

    setRefreshRate(rate: number): void {
        if (this.refreshRate !== rate) {
            this.refreshRate = rate;
        }
        if (this.artistQuery.length > 0) {
            this.repeatFetchArtistData();
        }
    }

    constructor(private dashboardService: DashboardService) {
    }

    async ngOnInit(): Promise<void> {
        try {
            const isLogged = await this.dashboardService.isSpotifyLogged().toPromise();

            this.isAuthenticated = isLogged.authenticated;
            if (this.isAuthenticated) {
                await this.loadConfig();
                if (this.artistQuery.length > 0) {
                    await this.fetchArtistData();
                }
            }
        } catch {
            this.isAuthenticated = false;
        }
        this.isLoading = false;
    }

    ngOnDestroy(): void {
        this.fetchArtistDataRequest?.unsubscribe();
    }

    saveConfig(): void {
        this.dashboardService.saveQueryConfig({id: this.id, query: this.artistQuery}).subscribe({
            error: err => {
                console.error(err);
            }
        });
    }

    async loadConfig(): Promise<void> {
        this.isLoading = true;
        try {
            const config = await this.dashboardService.getWidgetConfig(this.id).toPromise();

            this.artistQuery = config.query;
        } catch {
            this.errorMsg = 'Could not load widget config';
        }
        this.isLoading = false;
    }

    onLoginClick(): void {
        window.location.href = '/api/connect/spotify';
    }

    async onSubmit(formData: NgForm): Promise<void> {
        this.artistQuery = formData.value.search.trim();
        if (this.artistQuery.length > 0) {
            if (await this.fetchArtistData() === true) {
                this.saveConfig();
            }
        }
    }

    onExitClick(): void {
        this.clearSelection();
    }

    clearSelection(): void {
        this.artistQuery = '';
        this.currentArtist = null;
        this.errorMsg = '';
        this.fetchArtistDataRequest?.unsubscribe();
        this.saveConfig();
    }

    async fetchArtistData(): Promise<boolean> {
        this.isLoading = true;
        try {
            this.currentArtist = await this.dashboardService.getSpotifyArtist(this.artistQuery).toPromise();
            this.repeatFetchArtistData();
            this.isLoading = false;
            return true;
        } catch {
            this.artistQuery = '';
            this.errorMsg = 'Invalid artist ID.';
            this.isLoading = false;
            return false;
        }
    }

    repeatFetchArtistData(): void {
        if (this.fetchArtistDataRequest?.closed === false) {
            this.fetchArtistDataRequest.unsubscribe();
        }
        this.fetchArtistDataRequest = interval(this.refreshRate * 1000).pipe(mergeMap(() => {
            return this.dashboardService.getSpotifyArtist(this.artistQuery);
        })).subscribe(
            currentArtist => {
                this.currentArtist = currentArtist;
            }, _ => {
                this.isAuthenticated = false;
                this.clearSelection();
            }
        );
    }

}
