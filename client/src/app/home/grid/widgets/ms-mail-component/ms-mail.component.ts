import { Component, OnDestroy, OnInit } from '@angular/core';
import { DashboardWidget } from '../dashboard-widgets';
import { faMicrosoft } from '@fortawesome/free-brands-svg-icons';
import { DashboardService } from '../../../../shared/services/dashboard.service';
import { interval, Subscription } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { MicrosoftMail } from '../../../../shared/interfaces/microsoft-mail';
import { MicrosoftMailbox } from '../../../../shared/interfaces/microsoft-mailbox';

@Component({
    selector: 'app-ms-mail-component',
    templateUrl: './ms-mail.component.html',
    styleUrls: [ './ms-mail.component.scss' ]
})
export class MsMailComponent implements OnInit, OnDestroy, DashboardWidget {

    id: string;
    refreshRate: number;

    isAuthenticated = false;
    isLoading = true;

    fetchMailboxListRequest: Subscription;
    fetchMailListRequest: Subscription;

    mailboxList: MicrosoftMailbox[];
    selectedMailbox: MicrosoftMailbox;
    mailList: MicrosoftMail[];
    errorMsg = '';

    icons = {
        faMicrosoft
    };

    setRefreshRate(rate: number): void {
        if (this.refreshRate !== rate) {
            this.refreshRate = rate;
        }
        if (this.isAuthenticated) {
            this.repeatFetchMailboxList();
        }
        if (this.selectedMailbox) {
            this.repeatFetchMailList();
        }
    }

    constructor(private dashboardService: DashboardService) {
    }

    async ngOnInit(): Promise<void> {
        try {
            const isLogged = await this.dashboardService.isMicrosoftLogged().toPromise();

            this.isAuthenticated = isLogged.authenticated;
            if (this.isAuthenticated) {
                await this.fetchMailboxList();
                await this.loadConfig();
            }
            if (this.selectedMailbox) {
                await this.fetchMailList();
            }
        } catch {
            this.isAuthenticated = false;
        }
        this.isLoading = false;
    }

    ngOnDestroy(): void {
        this.fetchMailboxListRequest?.unsubscribe();
        this.fetchMailListRequest?.unsubscribe();
    }

    saveConfig(): void {
        this.dashboardService.saveQueryConfig({id: this.id, query: this.selectedMailbox?.id || ''}).subscribe({
            error: err => {
                console.error(err);
            }
        });
    }

    async loadConfig(): Promise<void> {
        this.isLoading = true;

        try {
            const config = await this.dashboardService.getWidgetConfig(this.id).toPromise();

            this.selectedMailbox = this.mailboxList.find(box => box.id === config.query);
        } catch {
            this.errorMsg = 'Could not load widget config';
        }
        this.isLoading = false;
    }

    onLoginClick(): void {
        window.location.href = '/api/connect/microsoft';
    }

    async onMailboxSelected(selectedMailbox: MicrosoftMailbox): Promise<void> {
        this.selectedMailbox = selectedMailbox;
        this.saveConfig();
        await this.fetchMailList();
    }

    async fetchMailboxList(): Promise<void> {
        this.isLoading = true;
        try {
            this.mailboxList = await this.dashboardService.getMicrosoftMailboxes().toPromise();
            if (this.mailboxList.length === 0) {
                this.errorMsg = 'No mailbox found.';
            } else {
                this.errorMsg = '';
            }
            this.repeatFetchMailboxList();
        } catch {
            this.isAuthenticated = false;
        }
        this.isLoading = false;
    }

    async fetchMailList(): Promise<void> {
        this.isLoading = true;
        try {
            this.mailList = await this.dashboardService.getMicrosoftMails(this.selectedMailbox.id).toPromise();
            if (this.mailList.length === 0) {
                this.errorMsg = 'No mails found.';
            } else {
                this.errorMsg = '';
            }
            this.repeatFetchMailList();
        } catch {
            this.selectedMailbox = null;
            this.errorMsg = 'Could not get mails from mailbox.';
        }
        this.isLoading = false;
    }

    getFormattedMailSendTime(mail: MicrosoftMail): string {
        const date = new Date(mail.receivedDateTime);

        return `${date.toLocaleDateString('fr-FR')}, ${date.toLocaleTimeString('fr-FR')}`;
    }

    clearSelection(): void {
        this.selectedMailbox = null;
        this.mailList = null;
        this.fetchMailboxListRequest?.unsubscribe();
        this.fetchMailboxListRequest = null;
        this.fetchMailListRequest?.unsubscribe();
        this.fetchMailListRequest = null;
        this.saveConfig();
    }

    repeatFetchMailboxList(): void {
        if (this.fetchMailboxListRequest?.closed === false) {
            this.fetchMailboxListRequest.unsubscribe();
        }
        this.fetchMailboxListRequest = interval(this.refreshRate * 1000).pipe(mergeMap(() => {
            return this.dashboardService.getMicrosoftMailboxes();
        })).subscribe(
            mailboxList => {
                this.mailboxList = mailboxList;
                if (this.selectedMailbox && !this.mailboxList.find(box => box.id === this.selectedMailbox.id)) {
                    this.clearSelection();
                }
                if (this.mailboxList.length === 0) {
                    this.errorMsg = 'No calendars found.';
                } else {
                    this.errorMsg = '';
                }
            }, _ => {
                this.isAuthenticated = false;
                this.clearSelection();
            }
        );
    }

    repeatFetchMailList(): void {
        if (this.fetchMailListRequest?.closed === false) {
            this.fetchMailListRequest.unsubscribe();
        }
        this.fetchMailListRequest = interval(this.refreshRate * 1000).pipe(mergeMap(() => {
            return this.dashboardService.getMicrosoftMails(this.selectedMailbox.id);
        })).subscribe(
            mailList => {
                this.mailList = mailList;
                if (this.mailList.length === 0) {
                    this.errorMsg = 'No events found.';
                } else {
                    this.errorMsg = '';
                }
            }, _ => {
                this.selectedMailbox = null;
                this.mailList = null;
                this.fetchMailListRequest?.unsubscribe();
                this.fetchMailListRequest = null;
                this.errorMsg = '';
            }
        );
    }

}
