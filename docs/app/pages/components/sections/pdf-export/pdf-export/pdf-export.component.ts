import { Component, ViewChild } from '@angular/core';
import { DocumentationSectionComponent } from '../../../../../decorators/documentation-section-component';
import { BaseChartDirective } from 'ng2-charts';
import { ColorService, DashboardOptions } from '../../../../../../../src/index';
import { Chart } from 'chart.js';
import { PdfExportService } from '../../../../../../../src/components/pdf-export/index';
import 'chance';

@Component({
    selector: 'uxd-components-pdf-export',
    templateUrl: './pdf-export.component.html',
    styleUrls: ['./pdf-export.component.less']
})
@DocumentationSectionComponent('ComponentsPdfExportComponent')
export class ComponentsPdfExportComponent {

    // configure the directive data
    lineChartData: Chart.ChartData = [{
        data: [],
        borderWidth: 2,
        fill: false
    },
    {
        data: [],
        borderWidth: 2,
        fill: false
    }];

    lineChartOptions: Chart.ChartOptions = {
        maintainAspectRatio: false,
        responsive: true,
        elements: {
            line: {
                tension: 0
            },
            point: {
                radius: 0
            }
        },
        scales: {
            xAxes: [{
                gridLines: {
                    color: 'transparent'
                },
                ticks: {
                    min: 0,
                    max: 49,
                    maxRotation: 0
                } as Chart.LinearTickOptions
            }],
            yAxes: [{
                gridLines: {
                    color: '#ddd'
                },
                ticks: {
                    beginAtZero: true,
                    stepSize: 100
                } as Chart.LinearTickOptions,
            }]
        },
    };

    lineChartLabels: string[] = [];
    lineChartLegend: boolean = false;
    lineChartColors = [
        {
            borderColor: this.colorService.getColor('vibrant1').toHex(),
        },
        {
            borderColor: this.colorService.getColor('vibrant2').toHex(),
        }];

    options: DashboardOptions = {
        columns: 4,
        padding: 10,
        rowHeight: 220,
        emptyRow: false,
        minWidth: 187
    };

    constructor(public colorService: ColorService, private _pdfExportService: PdfExportService) {

        // generate the chart data
        for (let idx = 0; idx < 50; idx++) {

            let label = '';

            if (idx === 0) {
                label = 'Jan 1, 2017';
            }

            if (idx === 49) {
                label = 'Mar 30, 2017';
            }

            this.lineChartLabels.push(label);

            this.lineChartData[0].data.push({
                x: idx,
                y: chance.integer({ min: 280, max: 460 })
            });

            this.lineChartData[1].data.push({
                x: idx,
                y: chance.integer({ min: 50, max: 250 })
            });
        }
    }


    // // access the chart directive properties
    // @ViewChild(BaseChartDirective) baseChart: BaseChartDirective;

    // // configure the directive data
    // barChartData: Chart.ChartData = [{
    //     data: [34, 25, 19, 34, 32, 44, 50, 67],
    //     borderWidth: 1
    // }];

    // barChartLabels: string[] = ['.doc', '.ppt', '.pdf', '.xls', '.html', '.txt', '.csv', '.mht'];
    // barChartOptions: Chart.ChartOptions;
    // barChartLegend: boolean = false;
    // barChartColors: any;

    // constructor(colorService: ColorService, private _pdfExportService: PdfExportService) {

    //     // Prepare colors used in chart
    //     let borderColor = colorService.getColor('grey2').setAlpha(0.5).toRgba();
    //     let barBackgroundColor = colorService.getColor('chart1').setAlpha(0.1).toRgba();
    //     let barHoverBackgroundColor = colorService.getColor('chart1').setAlpha(0.2).toRgba();
    //     let barBorderColor = colorService.getColor('chart1').toHex();
    //     let tooltipBackgroundColor = colorService.getColor('grey2').toHex();

    //     this.barChartOptions = {
    //         maintainAspectRatio: false,
    //         responsive: true,
    //         scales: {
    //             xAxes: [{
    //                 barPercentage: 0.5,
    //                 categoryPercentage: 1,
    //                 gridLines: {
    //                     display: true,
    //                     zeroLineColor: borderColor,
    //                     color: 'transparent'
    //                 }
    //             }],
    //             yAxes: [{
    //                 type: 'linear',
    //                 gridLines: {
    //                     zeroLineColor: borderColor
    //                 },
    //                 ticks: {
    //                     min: 0,
    //                     max: 80,
    //                     stepSize: 20
    //                 } as Chart.LinearTickOptions
    //             }]
    //         },
    //         tooltips: {
    //             backgroundColor: tooltipBackgroundColor,
    //             cornerRadius: 0,
    //             callbacks: {
    //                 title: (item: Chart.ChartTooltipItem[]) => {
    //                     return;
    //                 },
    //                 label: (item: Chart.ChartTooltipItem) => {
    //                     return `x: ${ item.xLabel }, y: ${ item.yLabel }`;
    //                 }
    //             },
    //             displayColors: false
    //         } as any
    //     };

    //     this.barChartColors = [
    //         {
    //             backgroundColor: barBackgroundColor,
    //             hoverBackgroundColor: barHoverBackgroundColor,
    //             borderColor: barBorderColor
    //         }
    //     ];

    // }

    // ngAfterViewInit() {

    //     // get instance of the chart
    //     let chartInstance = this.baseChart.chart;

    //     // create reference to Chart with type of any
    //     let chartJs = Chart as any;

    //     // Added dashed borders to forecast data
    //     chartJs.helpers.each(chartInstance.getDatasetMeta(0).data, (bar: any, index: number) => {

    //         // only alter the bars that are forecast data
    //         if (index >= 6) {
    //             bar.draw = function () {
    //                 chartInstance.chart.ctx.save();
    //                 chartInstance.chart.ctx.setLineDash([2, 2]);
    //                 chartJs.elements.Rectangle.prototype.draw.apply(this, arguments);
    //                 chartInstance.chart.ctx.restore();
    //             };
    //         }
    //     });
    // }

    getDocument() {
        let output = this._pdfExportService.getDocument();
        debugger;
        window.open('about:blank', '', '_blank').document.write(output.outerHTML);
        console.log(output);
    }

    openWindow() {

    }

}