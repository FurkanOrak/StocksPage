import { Component } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { forkJoin, map, Observable, tap } from "rxjs";
import { DateTime } from "luxon";

import { ApexOptions } from "src/@vex/components/chart/chart.component";
import { defaultChartOptions } from "src/@vex/utils/default-chart-options";

import { ApiService } from "src/app/shared/api.service";

export interface StocksRequestParams {
    function: string;
    symbol: string;
}

interface FilteredTimeSeries {
    labels: string[];
    data: number[];
}

@Component({
    selector: 'app-stock-analysis',
    templateUrl: './stock-analysis.component.html',
    styleUrls: ['./stock-analysis.component.scss']
})
export class StockAnalysisComponent {
    stocksList: string[] = ['IBM', 'AAPL', 'MSFT', 'AMZN', 'GOOG'];

    // Form Elements
    stocksForm: FormGroup = new FormGroup({
        stocks: new FormControl("", Validators.required),
        startDate: new FormControl("", Validators.required),
        endDate: new FormControl("", Validators.required)
    });

    // ApexCharts
    stocksSeries: ApexAxisChartSeries = [];
    stocksOptions: ApexOptions = defaultChartOptions({
        grid: {
            show: true,
            strokeDashArray: 3,
            padding: {
                left: 8,
                right: 8
            }
        },
        chart: {
            type: 'line',
            height: 384,
            sparkline: {
                enabled: false
            },
            zoom: {
                enabled: false
            }
        },
        colors: ['#008ffb', '#ff9800'],
        labels: [],
        xaxis: {
            type: "category",
            labels: {
                show: true
            }
        },
        yaxis: {
            labels: {
                show: true
            }
        },
        markers: {
            size: 4,
            strokeColors: '#fff',
            strokeWidth: 2,
            strokeOpacity: 0.9,
            strokeDashArray: 0,
            fillOpacity: 1,
            shape: "circle",
            radius: 2,
            offsetX: 0,
            offsetY: 0,
            showNullDataPoints: true,
            hover: {
                sizeOffset: 3
            }
        },
        stroke: {
            curve: "straight"
        },
        legend: {
            show: true,
            itemMargin: {
                horizontal: 4,
                vertical: 4
            }
        }
    });
    private filteredLabels: string[];

    // Table
    displayedColumns: string[] = [];
    stocksDataSource = [];

    // Datepicker [dateFilter]
    stocksDateFilter = (d: Date | null): boolean => {
        const day = (d || new Date()).getDay();
        const today = new Date();
        const priorDate = new Date(new Date().setMonth(today.getMonth() - 2));

        return (today.getTime() > d.getTime()
            && d.getTime() > priorDate.getTime())
            && (day !== 0 && day !== 6);
    }

    constructor(private apiService: ApiService) {}

    getStocksInfos() {
        const stocks = this.stocksForm.value["stocks"];
        const sources: Observable<[]> = stocks.map((item: string) => {
            const params: StocksRequestParams = {
                "function": "TIME_SERIES_DAILY_ADJUSTED",
                "symbol": item
            }

            return this.apiService.getData(params);
        });

        forkJoin(sources).pipe(
            map(stocks => {
                return stocks.map(stock => {
                    return {
                        name: stock["Meta Data"]["2. Symbol"],
                        data: this.stocksDates(stock["Time Series (Daily)"])
                    }
                });
            }),
            tap((mappedData: ApexAxisChartSeries) => {
                this.stocksSeries = mappedData;
                this.stocksOptions = { ...this.stocksOptions, labels: this.filteredLabels };
                this.prepareDataTable(this.filteredLabels, this.stocksSeries);
            })
        ).subscribe();
    }

    private stocksDates(timeSeries) {
        const startDate: Date = this.stocksForm.value["startDate"];
        const endDate: Date = this.stocksForm.value["endDate"];

        const filteredTimeSeries: FilteredTimeSeries = {
            labels: [],
            data: []
        };

        Object.keys(timeSeries).forEach(key => {
            const formattedKey = DateTime.fromISO(key).toJSDate();

            if (startDate <= formattedKey && endDate >= formattedKey) {
                filteredTimeSeries.labels.push(key);
                filteredTimeSeries.data.push(+timeSeries[key]["4. close"]);
            }
        });

        this.filteredLabels = filteredTimeSeries.labels;
        return filteredTimeSeries.data;
    }

    private prepareDataTable(filteredLabels: string[], stocksSeries) {
        this.displayedColumns = ["name", ...filteredLabels];

        if (this.stocksDataSource.length > 0) {
            this.stocksDataSource = [];
        }

        stocksSeries.forEach((item) => {
            this.stocksDataSource.push({
                name: item.name,
                ...item.data
            });
        });
    }

    onSubmit() {
        this.getStocksInfos();
    }
}