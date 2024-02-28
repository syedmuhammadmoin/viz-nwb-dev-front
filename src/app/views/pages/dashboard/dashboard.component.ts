// Angular
import { ChangeDetectorRef, Component, Injector, OnInit, ViewChild } from '@angular/core';
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
  ApexResponsive, ApexLegend, ApexFill, ApexTooltip, ApexPlotOptions
} from 'ng-apexcharts';
import { DynamicColorChangeService } from '../../shared/services/dynamic-color/dynamic-color-change.service';
import { DashboardService } from './service/dashboard.service';
import { finalize, take } from "rxjs/operators";
import { IsReloadRequired } from '../profiling/store/profiling.action';
import { NgxsCustomService } from '../../shared/services/ngxs-service/ngxs-custom.service';
import { EmployeeState } from '../payroll/employee/store/employee.state';
import { IApiResponse } from '../../shared/IApiResponse';
import { Permissions } from 'src/app/views/shared/AppEnum';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { AuthSingletonService } from '../auth/service/auth-singleton.service';

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


export type BarChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  stroke: ApexStroke;
};


@Component({
  selector: 'kt-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['dashboard.component.scss'],
})
export class DashboardComponent extends AppComponentBase implements OnInit {
  @ViewChild('pie-chart') pieChart: ChartComponent;
  public pieChartOptions: Partial<PieChartOptions>;

  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;

  @ViewChild("bar-chart") barchart: ChartComponent;
  public barchartOptions: Partial<BarChartOptions>;

  title: string;
  public permissions = Permissions;
  public userPermission :any;

  
  

  primarycolor: string;  
  secondarycolor:string = "#00e295";

  chartcolor: any;
  localsto: any;
  toastService: any;

  public expense: any
  public revenue: any
  public currentAsset: any;
  public noncurrentAsset: any;
  public currentLiability: any;
  public noncurrentLiability: any;
  public categories: any;
  public barChartd: any;

  public level3Curent: any;
  public level3NonCurent: any;
  public level3Currentlibilities: any;
  public level3NonCurrentlibilities: any;
  LocalPermission:any;





  constructor(
    private titleService: Title,
    public dynamicColorChanging: DynamicColorChangeService,
    private ref: ChangeDetectorRef,
    private dashboardService: DashboardService,
    public ngxsService: NgxsCustomService,
    private singletonService: AuthSingletonService,
    injector: Injector

  ) {
    super(injector);
    this.title = this.titleService.getTitle();
    console.log("Title is " + this.title);



  }


  showChart:boolean[] =[ false,false];

  ngOnInit(): void {
    this.LocalPermission = this.singletonService.getCurrentUserPermission();    
 console.log(this.LocalPermission,"local permission check ");
 
    this.getballanceSheetSummary();
console.log(this.permission,"Check");

    /// Bar Chart Show Grid 

    
    

    

    /// Line or Pie Chart ////
    this.dashboardService.getSummaryforLast12Month().toPromise().then((res: IApiResponse<any>) => {
      this.expense = res.result.filter(x => x.nature === "Expenses").map(i => i.balance);
      this.revenue = res.result.filter(x => x.nature === "Revenue").map(i => i.balance);
      this.ref.detectChanges();
    }).then(() => {
      this.dynamicColorChanging.global_color.subscribe((res: any) => {

        if (localStorage.getItem('global_color')) {
          this.localsto = JSON.parse(localStorage.getItem('global_color'));
          console.log(this.localsto);
          this.primarycolor = this.localsto.primary_color;          
          this.chartcolor = this.localsto.chart_color;

          this.chartOptions = {
            series: [
              {
                name: "Expense",
                data: this.expense
              },

              {
                name: "Revenue",
                data: this.revenue
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
              colors: [this.primarycolor,this.secondarycolor]
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
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec"
              ]
            }
          };

          this.pieChartOptions = {

            colors: this.chartcolor,
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

        else {
          this.localsto = res;
          this.primarycolor = this.localsto.primary_color;
          this.chartcolor = this.localsto.chart_color;

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
              colors: [this.primarycolor]
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

            colors: this.chartcolor,
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

        this.showChart[1] = true;

        this.ref.detectChanges()
      })
    });

    /// Line or Pie Chart ////
  }



  getballanceSheetSummary(){
    this.dashboardService.getSummary().toPromise().then((res: IApiResponse<any>) => {
      
      // Filter on level2 and sum ballance ammount of each category to show on dashboard top 
      this.currentAsset = res.result.filter(x => x.level1Name === "Assets" && x.level2Name === "Current Assets").reduce((sum, item) => sum + item.balance, 0);
      this.noncurrentAsset = res.result.filter(x => x.level1Name === "Assets" && x.level2Name === "Non - Current Assets").reduce((sum, item) => sum + item.balance, 0);
      this.currentLiability = res.result.filter(x => x.level1Name === "Liability" && x.level2Name === "Current Liabilities").reduce((sum, item) => sum + item.balance, 0);
      this.noncurrentLiability = res.result.filter(x => x.level1Name === "Liability" && x.level2Name === "Non - Current Liabilities").reduce((sum, item) => sum + item.balance, 0);
      // Filter on level2 and sum ballance ammount of each category to show on dashboard top 


      const columns = res.result.map(item => ({ level3Name: item.level3Name, balance: item.balance, level2Name: item.level2Name })) // Print the resulting array of objects

      ///// Filter On Level3 to show on grid on dashboard
      this.level3Curent = columns.filter(x => x.level2Name === "Current Assets");
      this.level3NonCurent = columns.filter(x => x.level2Name === "Non - Current Assets");
      Math.abs(this.level3Currentlibilities = columns.filter(x => x.level2Name === "Current Liabilities"));
      Math.abs(this.level3NonCurrentlibilities = columns.filter(x => x.level2Name === "Non - Current Liabilities"));
      ///// Filter On Level3 to show on grid on dashboard
             
      this.level3Currentlibilities.forEach(x => {
          x.balance = Math.abs(x.balance)
         });

console.log(this.level3Currentlibilities + "loging balance");

      this.ref.detectChanges();
    });
  }

  checkPermission(permission: string): boolean {
    return this.LocalPermission?.includes(permission);    
    
  }
}
