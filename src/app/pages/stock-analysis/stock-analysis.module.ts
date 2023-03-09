import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import { StockAnalysisComponent } from "./stock-analysis.component";
import { StockAnalysisRoutingModule } from "./stock-analysis-routing.module";

// Angular Material
import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { MatNativeDateModule } from "@angular/material/core";
import { MatInputModule } from "@angular/material/input";
import { MatTableModule } from "@angular/material/table";

// Vex
import { PageLayoutModule } from "src/@vex/components/page-layout/page-layout.module";
import { SecondaryToolbarModule } from "src/@vex/components/secondary-toolbar/secondary-toolbar.module";
import { BreadcrumbsModule } from "src/@vex/components/breadcrumbs/breadcrumbs.module";
import { ChartModule } from "src/@vex/components/chart/chart.module";
import { WidgetLargeChartModule } from "src/@vex/components/widgets/widget-large-chart/widget-large-chart.module";

@NgModule({
    declarations: [
        StockAnalysisComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        StockAnalysisRoutingModule,
        PageLayoutModule,
        SecondaryToolbarModule,
        BreadcrumbsModule,
        ChartModule,
        WidgetLargeChartModule,

        MatCardModule,
        MatButtonModule,
        MatSelectModule,
        MatDatepickerModule,
        MatNativeDateModule,
        MatInputModule,
        MatTableModule
    ]
})
export class StockAnalysisModule {}