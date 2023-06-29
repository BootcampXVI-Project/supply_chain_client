import { Component, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { ViewProductService } from '../table-supplier/view-product.service';
import HighchartsMore from 'highcharts/highcharts-more';
import HighchartsExporting from 'highcharts/modules/exporting';
import HighchartsAccessibility from 'highcharts/modules/accessibility';

import { Chart } from 'highcharts';
import { ChartDateStatus, ChartProduct } from '../../models/chart-model';
import { ProductObj } from '../../models/product-model';

HighchartsMore(Highcharts);
HighchartsExporting(Highcharts);
HighchartsAccessibility(Highcharts);

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})


export class ChartComponent implements OnInit {

  chartDateStatus: ChartDateStatus = new ChartDateStatus()
  chartProduct: ChartProduct = new ChartProduct()

  chartProducts: ProductObj[] = []

  countByDate: { [date: string]: { CULTIVATED: number, HARVESTED: number } } = {};

  loadCount() {
    this.chartProducts = this.product
    this.chartProducts.forEach((product) => {
      product.dates.forEach((dateStatus) => {
        const date = dateStatus.time.split(" ")[0]; // Lấy phần ngày từ chuỗi thời gian
        if (!(this.countByDate)[date]) {
          (this.countByDate)[date] = { CULTIVATED: 0, HARVESTED: 0 };
        }
        if (dateStatus.status === "CULTIVATED") {
          (this.countByDate)[date].CULTIVATED++;
        } else if (dateStatus.status === "HARVESTED") {
          (this.countByDate)[date].HARVESTED++;
        }
      });
    });
    console.log("COUNTBYDAY", this.countByDate);
  }

  product!: any[];
  amountCultivate: number = 0
  ListCultivateDate: string[] = []
  ListHarvestDate: string[] = []

  chartData!: any[]
  chart: Highcharts.Chart | undefined;
  chartOptions2!: Highcharts.Options;
  barChart!: Highcharts.Options;
  areaChart!: Highcharts.Options;

  constructor(
    private productApi: ViewProductService
  ) {

  }
  randomColor(): string {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  ngOnInit() {

    this.productApi.getAllProduct().subscribe((res: any) => {
      this.product = res.data


      console.log("Statitics",this.product);
      this.loadCount()

      const apiResponse: any[] = [];
      apiResponse.length = 0; // Clear the existing values

      // Assign the data from the API to apiResponse
      for (let i = 0; i < this.product.length; i++) {
        apiResponse.push(this.product[i].price);
      }

      // this.areaChart = {
      //   chart: {
      //     styledMode: true,
      //   },
      //   plotOptions: {
      //     series: {
      //       marker: {
      //         enabled: false,
      //       },
      //     },
      //   },
      //   legend: {
      //     enabled: false,
      //   },
      //   credits: {
      //     enabled: false,
      //   },
      //   title: {
      //     text: 'Statistics',
      //   },
      //   yAxis: {
      //     visible: true,
      //   },
      //
      //   xAxis: {
      //     visible: false,
      //
      //     categories: this.product.map((item: any) => item.productName),
      //
      //   },
      //
      //   defs: {
      //     gradient0: {
      //       tagName: 'linearGradient',
      //       id: 'gradient-0',
      //       x1: 0,
      //       y1: 0,
      //       x2: 0,
      //       y2: 1,
      //       children: [
      //         {
      //           tagName: 'stop',
      //           offset: 0,
      //         },
      //         {
      //           tagName: 'stop',
      //           offset: 1,
      //         },
      //       ],
      //     },
      //   } as any,
      //
      //   series: [
      //     // {
      //     //   color: 'red',
      //     //   type: 'areaspline',
      //     //   keys: ['y', 'selected'],
      //     //   data: apiResponse.map(price => parseInt(price))
      //     // },
      //     {
      //       color: 'red',
      //       type: 'column',
      //       keys: ['y', 'selected'],
      //       data: [
      //         [29.9, false],
      //         [71.5, false],
      //         [106.4, false],
      //         [144.0, false],
      //         [176.0, false],
      //         [135.6, false],
      //         [148.5, false],
      //         [216.4, false],
      //         [194.1, false],
      //         [95.6, false],
      //         [54.4, false],
      //
      //       ],
      //
      //
      //     },
      //
      //   ],
      // };
      // this.barChart = {
      //   chart: {
      //     type: 'bar',
      //   },
      //   credits: {
      //     enabled: false,
      //   },
      //   title: {
      //     text: 'Bar',
      //   },
      //   yAxis: {
      //     visible: false,
      //     gridLineColor: '#fff',
      //   },
      //   legend: {
      //     enabled: false,
      //   },
      //   xAxis: {
      //     lineColor: '#fff',
      //     categories: this.product.map((item: any) => item.productName),
      //   },
      //
      //   plotOptions: {
      //     series: {
      //       borderRadius: 5,
      //     } as any,
      //   },
      //
      //   series: [
      //     {
      //       type: 'bar',
      //       color: '#506ef9',
      //       data: apiResponse.map(price => parseInt(price))
      //     },
      //   ],
      // };


      ////

      const data = Object.entries(this.countByDate).map(([date, values]) => ({
        date,
        cultivated: values.CULTIVATED,
        harvested: values.HARVESTED,
      }));

      const categories = data.map(entry => entry.date);

      const cultivatedData = data.map(entry => entry.cultivated);
      const harvestedData = data.map(entry => entry.harvested);


      this.chartOptions2 = {
        chart: {
          type: 'areaspline'
        },
        title: {
          text: 'Product Prices'
        },
        xAxis: {
          categories: categories,
          title: {}
        },
        yAxis: {
          title: {
            text: 'Price'
          }
        },
        series: [
          {
            type: 'spline',
            name: 'Harvest',
            data: harvestedData,
          },
          {
            type: 'spline',
            name: 'Cultivate',
            data: cultivatedData,
          },
        ],
        colors: ['#0FA9E6', '#BD3E3E', '#FFF263', '#6AF9C4'],
      };
      ////
      // this.chartOptions2 = {
      //   chart: {
      //     type: 'areaspline'
      //   },
      //   title: {
      //     text: 'Product Prices'
      //   },
      //   xAxis: {
      //     categories: this.countByDate.date,
      //     title: {
      //     }
      //   },
      //   yAxis: {
      //     title: {
      //       text: 'Price'
      //     }
      //   },
      //   series: [
      //     {
      //       type: 'spline',
      //       name: 'Harvest',
      //       data: [
      //         12000,
      //         50000,
      //         100000,
      //         430000,
      //         656450,
      //         130000,
      //         340000,
      //         540000,
      //         320004,
      //         170023,
      //         220343
      //
      //       ],
      //
      //     },
      //     {
      //       type: 'spline',
      //       name: 'Cultivate',
      //       data: apiResponse.map(price => parseInt(price)),
      //
      //     },
      //
      //   ],
      //   colors: ['#0FA9E6',
      //     '#BD3E3E', '#FFF263', '#6AF9C4'],
      // };

      this.chart = Highcharts.chart('chartContainer', this.chartOptions2);
    });







  }

  Highcharts: typeof Highcharts = Highcharts;

  chartOptions1: Highcharts.Options = {
    series: [
      {

        type: 'column',
        data: [1, 2, 3, 4, 5],
      },

    ],
    colors: ['#E9CC26', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572',
      '#FF9655', '#FFF263', '#6AF9C4'],
    title: {
      text: 'Revenue'
    },
    xAxis: {

      title: {
        text: 'month'
      }
    },
    yAxis: {
      title: {
        text: 'VND'
      }
    },

  };







}
