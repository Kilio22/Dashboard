import { Injectable } from '@angular/core';
import { GridsterConfig, GridsterItem, GridsterItemComponentInterface } from 'angular-gridster2';
import { DashboardService } from '../../shared/services/dashboard.service';
import { Id } from '../../shared/interfaces/id';
import { WidgetGridConfig } from '../../shared/interfaces/widget-grid-config';

export const gridConfigKey = 'gridConfig';

@Injectable({
    providedIn: 'root'
})
export class GridService {

    options: GridsterConfig = {
        displayGrid: 'onDrag&Resize',
        draggable: {
            enabled: true,
            ignoreContent: true,
            stop: this.onDragStop.bind(this)
        },
        gridType: 'scrollVertical',
        setGridSize: true,
        minCols: 15,
        maxCols: 15,
        minRows: 10,
        maxRows: 10,
        resizable: {
            enabled: false
        },
        scrollToNewItems: true
    };

    public gridItems: GridsterItem[] = [];

    constructor(private dashboardService: DashboardService) {
    }

    reset(): void {
        this.gridItems = [];
    }

    onDragStop(item: GridsterItem, itemComponent: GridsterItemComponentInterface, event: MouseEvent): void {
        const index = this.gridItems.indexOf(item);

        if (index >= 0) {
            this.gridItems[index].x = itemComponent.$item.x;
            this.gridItems[index].y = itemComponent.$item.y;
        }
        this.saveItems();
    }

    saveItems(): void {
        const config: WidgetGridConfig[] = this.gridItems.map(value => {
            return {
                id: value.id,
                type: value.widgetId,
                x: value.x,
                y: value.y,
                refreshRate: value.refreshRate
            };
        });

        this.dashboardService.saveGridConfig(config).subscribe({
            error: err => {
                console.error(err);
            }
        });
    }

    removeItems(ids: Id[]): void {
        this.dashboardService.removeWidgets(ids).subscribe({
            error: err => {
                console.error(err);
            }
        });
    }

}
