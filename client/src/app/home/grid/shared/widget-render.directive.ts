import {
    ComponentFactoryResolver,
    ComponentRef,
    Directive,
    Input,
    OnChanges,
    SimpleChanges,
    ViewContainerRef
} from '@angular/core';
import { DashboardWidget, widgetComponents } from '../widgets/dashboard-widgets';

@Directive({
    selector: '[appWidgetRender]'
})
export class WidgetRenderDirective implements OnChanges {

    @Input() componentRef: string;
    @Input() widgetId: string;
    @Input() widgetRefreshRate: number;

    component: ComponentRef<DashboardWidget>;

    constructor(private container: ViewContainerRef, private resolver: ComponentFactoryResolver) {
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.componentRef?.isFirstChange() === true) {
            const component = widgetComponents[this.componentRef];

            if (component && !this.component) {
                const factory = this.resolver.resolveComponentFactory<DashboardWidget>(component);

                this.component = this.container.createComponent(factory);
                this.component.instance.id = this.widgetId;
                this.component.instance.setRefreshRate(this.widgetRefreshRate);
            }
        }
        if (changes.widgetRefreshRate?.isFirstChange() === false) {
            this.component.instance.setRefreshRate(this.widgetRefreshRate);
        }
    }

}
