// Angular
import {Component, OnInit, ViewChild} from '@angular/core';
import { Title } from '@angular/platform-browser';
// Chart
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexGrid,
  ApexStroke,
  ApexTitleSubtitle,
  ChartComponent,
  ApexNonAxisChartSeries,
  ApexResponsive, ApexLegend, ApexFill, ApexTooltip
} from 'ng-apexcharts';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

export type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  labels: any;
  legend: ApexLegend;
  fill: ApexFill;
  title: ApexTitleSubtitle;
  dataLabels: ApexDataLabels;
  tooltip: ApexTooltip;
  colors: any;
};


@Component({
  selector: 'kt-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  @ViewChild('pie-chart') pieChart: ChartComponent;
  public pieChartOptions: Partial<PieChartOptions>;

  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  title : string;

  constructor(private titleService: Title) {
    this.title = this.titleService.getTitle();
        console.log("Title is " + this.title);
    
    if(this.title == 'SBBU'){

      this.chartOptions = {
        series: [
          {
            data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
          }
        ],
        chart: {
          height: 350,
          type: 'line',
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight',
          colors: ['#1a6b85'],
        },
        title: {
          text: 'sales Trends by Month',
          align: 'left'
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          }
        },
        xaxis: {
          categories: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep'
          ]
        }
      };
  

      this.pieChartOptions = {
      
        colors: ['#1a6b85', '#1a6b85', '#5390a3', '#5390a3'],
        series: [44, 55, 13, 43],
        fill: {
          type: 'gradient',
          /*colors: [
            '#039be5', '#0288d1', '#03a9f4', '#4fc3f7'
          ]*/
        },
        dataLabels: {
          /*style: {
            colors: ['#039be5', '#0288d1', '#03a9f4', '#4fc3f7']
          },*/
          enabled: false
        },
        title: {
          text: 'Quarterly Income Segregation',
          align: 'left'
        },
        legend: {
          show: true,
          horizontalAlign: 'center',
          position: 'bottom',
          /*markers: {
            fillColors: ['#039be5', '#0288d1', '#03a9f4', '#4fc3f7']
          }*/
        },
        tooltip: {
          style: {
            fontSize: '20px'
          },
          /*marker: {
            fillColors: ['#039be5', '#0288d1', '#03a9f4', '#4fc3f7']
          }*/
        },
        chart: {
          toolbar: {
            show: true
          },
          type: 'donut',
          height: 350,
        },
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        responsive: [
          /*{
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: 'bottom'
              }
            }
          }*/
        ]
      };
    }

    if(this.title == 'EDINFINI'){

      this.chartOptions = {
        series: [
          {
            data: [10, 41, 35, 51, 49, 62, 69, 91, 148]
          }
        ],
        chart: {
          height: 350,
          type: 'line',
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'straight',
          colors: ['#65c18c'],
        },
        title: {
          text: 'sales Trends by Month',
          align: 'left'
        },
        grid: {
          row: {
            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
            opacity: 0.5
          }
        },
        xaxis: {
          categories: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep'
          ]
        }
      };
  

      this.pieChartOptions = {
      
        colors: ['#65c18c', '#65c18c', '#69a381', '#69a381'],
        series: [44, 55, 13, 43],
        fill: {
          type: 'gradient',
          /*colors: [
            '#039be5', '#0288d1', '#03a9f4', '#4fc3f7'
          ]*/
        },
        dataLabels: {
          /*style: {
            colors: ['#039be5', '#0288d1', '#03a9f4', '#4fc3f7']
          },*/
          enabled: false
        },
        title: {
          text: 'Quarterly Income Segregation',
          align: 'left'
        },
        legend: {
          show: true,
          horizontalAlign: 'center',
          position: 'bottom',
          /*markers: {
            fillColors: ['#039be5', '#0288d1', '#03a9f4', '#4fc3f7']
          }*/
        },
        tooltip: {
          style: {
            fontSize: '20px'
          },
          /*marker: {
            fillColors: ['#039be5', '#0288d1', '#03a9f4', '#4fc3f7']
          }*/
        },
        chart: {
          toolbar: {
            show: true
          },
          type: 'donut',
          height: 350,
        },
        labels: ['Q1', 'Q2', 'Q3', 'Q4'],
        responsive: [
          /*{
            breakpoint: 480,
            options: {
              chart: {
                width: 200
              },
              legend: {
                position: 'bottom'
              }
            }
          }*/
        ]
      };
    }
    
  }

  ngOnInit(): void {
    
  }
}
