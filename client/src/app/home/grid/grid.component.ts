import { Component, OnDestroy, OnInit } from '@angular/core';
import { UUID } from 'angular2-uuid';
import { GridsterConfig, GridsterItem } from 'angular-gridster2';
import { GridService } from './grid.service';
import { WidgetProps } from './widgets/dashboard-widgets';
import { DashboardServiceProps, dashboardServices } from './shared/dashboard-services';
import { DashboardService } from '../../shared/services/dashboard.service';

@Component({
    selector: 'app-grid',
    templateUrl: './grid.component.html',
    styleUrls: [ './grid.component.scss' ]
})
export class GridComponent implements OnInit,
                                      OnDestroy {

    get options(): GridsterConfig {
        return this.gridService.options;
    }

    get gridItems(): GridsterItem[] {
        return this.gridService.gridItems;
    }

    get serviceList(): DashboardServiceProps[] {
        return dashboardServices;
    }

    constructor(private gridService: GridService, private dashboardService: DashboardService) {
    }

    ngOnInit(): void {
        this.dashboardService.getWidgetsConfig().subscribe(widgets => {
            for (const widget of widgets) {
                for (const service of this.serviceList) {
                    const foundWidget = service.widgets.find(item => item.id === widget.type);

                    if (foundWidget) {
                        this.addItem(foundWidget, false, widget.id, widget.x, widget.y, widget.refreshRate);
                    }
                }
            }
        }, error => {
            console.error(error);
        });
    }

    addItem(widgetProps: WidgetProps, shouldSave: boolean, uuid = UUID.UUID(), x = 0, y = 0, refreshRate: number = 5): void {
        this.gridService.gridItems.push({
            id: uuid,
            cols: widgetProps.cols,
            rows: widgetProps.rows,
            x,
            y,
            widgetId: widgetProps.id,
            name: widgetProps.name,
            refreshRate
        });
        if (shouldSave) {
            this.saveGridLayoutToLocalStorage();
        }
    }

    removeItem(id: string): void {
        const toRemoveFromGrid = this.gridItems.find(item => item.id === id);

        if (toRemoveFromGrid) {
            this.gridService.gridItems.splice(this.gridItems.indexOf(toRemoveFromGrid), 1);
            this.gridService.removeItems([
                {
                    id: toRemoveFromGrid.id
                }
            ]);
        }
    }

    countSelectedWidget(widgetProps: WidgetProps): number {
        return this.gridItems.reduce<number>((acc, curr) => {
            if (curr.widgetId === widgetProps.id) {
                return acc + 1;
            }
            return acc;
        }, 0);
    }

    removeAllWidgets(): void {
        const widgetsToRemove = this.gridService.gridItems.map(widget => {
            return {
                id: widget.id
            };
        });

        this.gridService.removeItems(widgetsToRemove);
        this.gridService.gridItems = [];
    }

    saveGridLayoutToLocalStorage(): void {
        this.gridService.saveItems();
    }

    ngOnDestroy(): void {
        this.gridService.reset();
    }

}
