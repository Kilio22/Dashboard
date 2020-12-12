import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardWidget } from '../dashboard-widgets';
import { DashboardService } from '../../../../shared/services/dashboard.service';
import { interval, Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { Weather } from '../../../../shared/interfaces/weather';

@Component({
    selector: 'app-weather',
    templateUrl: './weather.component.html',
    styleUrls: [ './weather.component.scss' ]
})
export class WeatherComponent implements OnInit,
                                         OnDestroy,
                                         DashboardWidget {
    id: string;
    refreshRate: number;

    isLoading = true;
    searchBuffer = '';
    search = '';
    weather: Weather = null;
    request: Subscription;

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
        this.loadConfig();
    }

    ngOnDestroy(): void {
        this.clearRequest();
    }

    reset(): void {
        this.clearRequest();
        this.search = '';
        this.isLoading = false;
        this.weather = null;
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
        this.getWeatherInfos();
        this.saveConfig();
    }

    getWeatherInfos(): void {
        this.isLoading = true;
        this.dashboardService.getWeatherInfosByCity(this.search)
            .subscribe(
                (channel) => this.getWeatherNextCb(channel),
                (error) => this.getWeatherErrorCb(error)
            );
    }

    getWeatherNextCb(weather): void {
        if (!weather) {
            this.reset();
        } else {
            this.weather = {
                ...weather[0],
                date: new Date(weather[0].date + ` ${weather[0].observationtime}`).toLocaleString()
            };
            this.isLoading = false;
        }
    }

    getWeatherErrorCb(error): void {
        this.reset();
    }

    startRequest(): void {
        this.clearRequest();
        this.request = interval(this.refreshRate * 1000).pipe(mergeMap(() => {
            return this.dashboardService.getWeatherInfosByCity(this.search);
        })).subscribe(
            (weather) => this.getWeatherNextCb(weather),
            (error) => this.getWeatherErrorCb(error)
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
