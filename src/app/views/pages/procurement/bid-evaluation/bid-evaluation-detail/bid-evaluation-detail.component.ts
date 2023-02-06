import { Component, Injector, OnInit } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params} from '@angular/router';
import { ActionButton, DocType, DocumentStatus, Permissions } from 'src/app/views/shared/AppEnum';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { finalize, take } from 'rxjs/operators';
import { BidEvaluationService } from '../service/bid-evaluation.service';
import { BID_EVALUATION } from 'src/app/views/shared/AppRoutes';
import { FirstDataRenderedEvent, GridOptions, ValueFormatterParams } from 'ag-grid-community';


@Component({
  selector: 'kt-bid-evaluation-detail',
  templateUrl: './bid-evaluation-detail.component.html',
  styleUrls: ['./bid-evaluation-detail.component.scss']
})

export class BidEvaluationDetailComponent extends AppComponentBase implements OnInit {

  permissions = Permissions

  bidEvaluationMaster: any;
  bidEvaluationLines: any;

  public BID_EVALUATION = BID_EVALUATION;

  docStatus = DocumentStatus
  gridOptions: GridOptions;

  //for busy loading
  isLoading: boolean

  action = ActionButton;
  docType = DocType;

  //Defining Bid Evaluation Columns
  columnDefs = [
    {
      headerName: 'Bidder Name', 
      field: 'nameOfBider',
      cellStyle: {'font-size': '12px'}
    },
    {
      headerName: 'Technical Total', 
      field: 'technicalTotal', 
      cellStyle: {'font-size': '12px'}
    },
    {
      headerName: 'Technical Obtain', 
      field: 'technicalObtain', 
      cellStyle: {'font-size': '12px'}
    },
    {
      headerName: 'Financial Total', 
      field: 'financialTotal', 
      cellStyle: {'font-size': '12px'}
    },
    {
      headerName: 'Financial Obtain', 
      field: 'financialObtain', 
      cellStyle: {'font-size': '12px'}
    },
    {
      headerName: 'Evaluated Cost', 
      field: 'evaluatedCost',  
      cellStyle: {'font-size': '12px'},
      valueFormatter: (params: ValueFormatterParams) => {
        return this.valueFormatter(params.value);
      }
    },
    {
      headerName: 'Rule', 
      field: 'rule', 
      cellStyle: {'font-size': '12px'}
    }
  ];
 
    constructor( private bidEvaluationService: BidEvaluationService,
                 private route: ActivatedRoute,
                 public  dialog: MatDialog,
                 private cdRef: ChangeDetectorRef,
                 injector: Injector
               ) {
                   super(injector)
                   this.gridOptions = ({} as GridOptions);
                 }
  
    ngOnInit() {
      this.route.paramMap.subscribe((params: Params) => {
        const id = +params.get('id');
        if (id) {
          this.isLoading = true;
          this.getBidEvaluationData(id);
          this.cdRef.markForCheck();
        }
      })

      this.gridOptions.rowHeight = 30;
      this.gridOptions.headerHeight = 35;
    }

    //First time rendered ag grid
    onFirstDataRendered(params: FirstDataRenderedEvent) {
      params.api.sizeColumnsToFit();
    }
  
    //Getting Bid Evaluation Master data
    getBidEvaluationData(id: number) {
      this.bidEvaluationService.getBidEvaluationById(id)
      .pipe(
        take(1),
         finalize(() => {
          this.isLoading = false;
          this.cdRef.detectChanges();
         })
       )
      .subscribe(
        (res) => {
          this.bidEvaluationMaster = res.result;
          this.bidEvaluationLines = res.result.bidEvaluationLines; 
        
          this.cdRef.markForCheck();
        })
  }
}
