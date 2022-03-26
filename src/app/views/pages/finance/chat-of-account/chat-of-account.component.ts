import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CreateLevel3Component } from './level3/create-level3/create-level3.component';
import { MatDialog } from '@angular/material/dialog';
import { CreateLevel4Component } from './level4/create-level4/create-level4.component';
import { ChartOfAccountService } from './service/chart-of-account.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';

/**
 * Each node has a name and an optional list of children.
 */
 interface AccountsNode {
  id: number,
  name: string;
  children?: AccountsNode[];
}

/** Flat node with expandable and level information */
interface FlatNode {
  expandable: boolean;
  id: number,
  name: string;
  level: number;
}



@Component({
  selector: 'kt-chat-of-account',
  templateUrl: './chat-of-account.component.html',
  styleUrls: ['./chat-of-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatOfAccountComponent implements OnInit {
 
  constructor(
    private chartOfAccService: ChartOfAccountService,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef) {

  }
  _transformer = (node: AccountsNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      id: node.id,
      level,
    };
  }
  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level, node => node.expandable
  );
  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.children
  );

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);



  ngOnInit(): void {
    this.chartOfAccService.getChartOfAccount().subscribe((data) => {
      this.dataSource.data = data.result;
      console.log('this.dataSource.data', this.dataSource.data);
      this.cdRef.detectChanges();
    });
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

  addNewItem(node: FlatNode) {
    console.log(node);
    // if (node.level == 1) {
    //   const dialogRef = this.dialog.open(CreateLevel3Component, {
    //     width: '800px',
    //     data: {parentId: node.id}
    //   });
    //   // Recalling getBankAccounts function on dialog close
    //   dialogRef.afterClosed().subscribe(() => {
    //     this.chartOfAccService.getChartOfAccount().subscribe((res) => {
    //       this.dataSource.data = res.result;
    //       this.cdRef.detectChanges();
    //     })
    //   });
    // }
    if (node.level == 2) {
      const dialogRef = this.dialog.open(CreateLevel4Component, {
        width: '800px',
        data: {parentId: node.id}
      });
      dialogRef.afterClosed().subscribe(() => {
        this.chartOfAccService.getChartOfAccount().subscribe((res) => {
          this.dataSource.data = res.result;
          this.cdRef.detectChanges();
        })
      });
    }
    // const parentNode = this.flatNodeMap.get(node);
    // this._database.insertItem(parentNode!, '');
    // this.treeControl.expand(node);
  }

  editItem(node) {
    // if (node.level === 2 && node.id) {
    //   const dialogRef = this.dialog.open(CreateLevel3Component, {
    //     width: '800px',
    //     data: {modelId: node.id}
    //   });
    //   // Recalling getBankAccounts function on dialog close
    //   dialogRef.afterClosed().subscribe(() => {
    //     this.chartOfAccService.getChartOfAccount().subscribe((res) => {
    //       this.dataSource.data = res.result;
    //       this.cdRef.detectChanges();
    //     })
    //   });
    // }
    if (node.level === 3 && node.id) {
      console.log('nodeId : ', node.id)
      const dialogRef = this.dialog.open(CreateLevel4Component, {
        width: '800px',
        data: {modelId: node.id}
      });
      dialogRef.afterClosed().subscribe(() => {
        this.chartOfAccService.getChartOfAccount().subscribe((res) => {
          this.dataSource.data = res.result;
          this.cdRef.detectChanges();
        })
      });
    }
  }
}


