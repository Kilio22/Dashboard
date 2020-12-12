import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardWidget } from '../dashboard-widgets';
import { DashboardService } from '../../../../shared/services/dashboard.service';
import { MicrosoftCalendar } from '../../../../shared/interfaces/microsoft-calendar';
import { MicrosoftCalendarEvent } from '../../../../shared/interfaces/microsoft-calendar-event';
import { faMicrosoft } from '@fortawesome/free-brands-svg-icons';
import { interval, Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

@Component({
    selector: 'app-ms-calendar',
    templateUrl: './ms-calendar.component.html',
    styleUrls: [ './ms-calendar.component.scss' ]
})
export class MsCalendarComponent implements OnInit, OnDestroy, DashboardWidget {

    id: string;
    refreshRate: number;

    isAuthenticated = false;
    isLoading = true;

    fetchCalendarListRequest: Subscription;
    fetchEventListRequest: Subscription;

    calendarList: MicrosoftCalendar[];
    selectedCalendar: MicrosoftCalendar;
    eventList: MicrosoftCalendarEvent[];
    errorMsg = '';

    icons = {
        faMicrosoft
    };

    setRefreshRate(rate: number): void {
        if (this.refreshRate !== rate) {
            this.refreshRate = rate;
        }
        if (this.isAuthenticated) {
            this.repeatFetchCalendarList();
        }
        if (this.selectedCalendar) {
            this.repeatFetchEventList();
        }
    }

    constructor(private dashboardService: DashboardService) {
    }

    async ngOnInit(): Promise<void> {
        try {
            const isLogged = await this.dashboardService.isMicrosoftLogged().toPromise();

            this.isAuthenticated = isLogged.authenticated;
            if (this.isAuthenticated) {
                await this.fetchCalendarList();
                await this.loadConfig();
            }
            if (this.selectedCalendar) {
                await this.fetchEventList();
            }
        } catch {
            this.isAuthenticated = false;
        }
        this.isLoading = false;
    }

    ngOnDestroy(): void {
        this.fetchCalendarListRequest?.unsubscribe();
        this.fetchEventListRequest?.unsubscribe();
    }

    saveConfig(): void {
        this.dashboardService.saveQueryConfig({id: this.id, query: this.selectedCalendar?.id || ''}).subscribe({
            error: err => {
                console.error(err);
            }
        });
    }

    async loadConfig(): Promise<void> {
        this.isLoading = true;

        try {
            const config = await this.dashboardService.getWidgetConfig(this.id).toPromise();

            this.selectedCalendar = this.calendarList.find(cal => cal.id === config.query);
        } catch {
            this.errorMsg = 'Could not load widget config';
        }
        this.isLoading = false;
    }

    async onCalendarSelected(selectedCalendar: MicrosoftCalendar): Promise<void> {
        this.selectedCalendar = selectedCalendar;
        this.saveConfig();
        await this.fetchEventList();
    }

    onLoginClick(): void {
        window.location.href = '/api/connect/microsoft';
    }

    async fetchCalendarList(): Promise<void> {
        this.isLoading = true;
        try {
            this.calendarList = await this.dashboardService.getMicrosoftCalendars().toPromise();
            if (this.calendarList.length === 0) {
                this.errorMsg = 'No calendars found.';
            } else {
                this.errorMsg = '';
            }
            this.repeatFetchCalendarList();
        } catch {
            this.isAuthenticated = false;
        }
        this.isLoading = false;
    }

    async fetchEventList(): Promise<void> {
        this.isLoading = true;
        try {
            this.eventList = await this.dashboardService.getMicrosoftCalendarEvents(this.selectedCalendar.id)
                                       .toPromise();
            if (this.eventList.length === 0) {
                this.errorMsg = 'No events found.';
            } else {
                this.errorMsg = '';
            }
            this.repeatFetchEventList();
        } catch {
            this.selectedCalendar = null;
            this.errorMsg = 'Could not get events from calendar.';
        }
        this.isLoading = false;
    }

    getEventStartTime(event: MicrosoftCalendarEvent): string {
        return new Date(event.start.dateTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    }

    getEventEndTime(event: MicrosoftCalendarEvent): string {
        return new Date(event.end.dateTime).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
    }

    clearSelection(save: boolean): void {
        this.selectedCalendar = null;
        this.eventList = null;
        this.fetchCalendarListRequest?.unsubscribe();
        this.fetchCalendarListRequest = null;
        this.fetchEventListRequest?.unsubscribe();
        this.fetchEventListRequest = null;
        if (save === true) {
            this.saveConfig();
        }
    }

    repeatFetchCalendarList(): void {
        if (this.fetchCalendarListRequest?.closed === false) {
            this.fetchCalendarListRequest.unsubscribe();
        }
        this.fetchCalendarListRequest = interval(this.refreshRate * 1000).pipe(mergeMap(() => {
            return this.dashboardService.getMicrosoftCalendars();
        })).subscribe(
            calendarList => {
                this.calendarList = calendarList;
                if (this.selectedCalendar && !this.calendarList.find(cal => cal.id === this.selectedCalendar.id)) {
                    this.clearSelection(true);
                }
                if (this.calendarList.length === 0) {
                    this.errorMsg = 'No calendars found.';
                } else {
                    this.errorMsg = '';
                }
            }, _ => {
                this.isAuthenticated = false;
                this.clearSelection(false);
            }
        );
    }

    repeatFetchEventList(): void {
        if (this.fetchEventListRequest?.closed === false) {
            this.fetchEventListRequest.unsubscribe();
        }
        this.fetchEventListRequest = interval(this.refreshRate * 1000).pipe(mergeMap(() => {
            return this.dashboardService.getMicrosoftCalendarEvents(this.selectedCalendar.id);
        })).subscribe(
            eventList => {
                this.eventList = eventList;
                if (this.eventList.length === 0) {
                    this.errorMsg = 'No events found.';
                } else {
                    this.errorMsg = '';
                }
            }, _ => {
                this.selectedCalendar = null;
                this.eventList = null;
                this.fetchEventListRequest?.unsubscribe();
                this.fetchEventListRequest = null;
                this.errorMsg = '';
            }
        );
    }

}
