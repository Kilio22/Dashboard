import { TestBed } from '@angular/core/testing';
import { DashboardService } from './dashboard.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WidgetConfig } from '../interfaces/widget-config';
import { UUID } from 'angular2-uuid';

describe('DashboardService', () => {
    let service: DashboardService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ HttpClientTestingModule ]
        });
        service = TestBed.inject(DashboardService);
        httpTestingController = TestBed.inject(HttpTestingController);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should call getWidgetConfig endpoint', () => {
        const expectedConfig: WidgetConfig = { id: 'check', query: 'check', refreshRate: 10, type: '.', x: 2, y: 11 };
        const widgetId = UUID.UUID();

        service.getWidgetConfig(widgetId).subscribe(config => {
            expect(config).toBe(expectedConfig);
        });

        const req = httpTestingController.expectOne('/api/user/widgets/' + widgetId);

        expect(req.request.method).toEqual('GET');
        req.flush(expectedConfig);
        httpTestingController.verify();
    });
});
