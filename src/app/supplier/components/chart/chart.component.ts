import { Component } from '@angular/core';
import * as Highcharts from 'highcharts';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent {


  constructor() {

  }
  Highcharts: typeof Highcharts = Highcharts;

  chartOptions1: Highcharts.Options = {
    series: [
      {

        type: 'line',
        data: [1, 2, 3, 4, 5],
      },
      {
        type: 'line',
        data: [2, 1, 4, 4, 5]
      }
    ],
    colors: ['#058DC7', '#50B432', '#ED561B', '#DDDF00', '#24CBE5', '#64E572',
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




  chartOptions2: Highcharts.Options = {
    series: [
      {

        type: 'pie',
        data: [1, 2, 3, 4, 5],
      },
    ],
    title: {
      text: 'Revenue'
    },
    xAxis: {


    },

    yAxis: {
      title: {
        text: 'VND'
      }
    },
  };

}
