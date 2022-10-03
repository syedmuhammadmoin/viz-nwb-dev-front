import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { CreateLevel3Component } from './level3/create-level3/create-level3.component';
import { MatDialog } from '@angular/material/dialog';
import { CreateLevel4Component } from './level4/create-level4/create-level4.component';
import { ChartOfAccountService } from './service/chart-of-account.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { AccountType, Permissions } from 'src/app/views/shared/AppEnum';
import { finalize, take } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

/**
 * Each node has a name and an optional list of children.
 */
 interface AccountsNode {
  id: number,
  name: string;
  accountType: number,
  children?: AccountsNode[];
}

/** Flat node with expandable and level information */
interface FlatNode {
  expandable: boolean;
  id: number,
  name: string;
  level: number;
  accountType: number;
}



@Component({
  selector: 'kt-chat-of-account',
  templateUrl: './chat-of-account.component.html',
  styleUrls: ['./chat-of-account.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatOfAccountComponent extends AppComponentBase implements OnInit {

  public permissions = Permissions;

  isLoading : boolean = false;

  //for checking level4 account type
  accountType: AccountType

  environment = environment;
 
  constructor(
    private chartOfAccService: ChartOfAccountService,
    public dialog: MatDialog,
    private cdRef: ChangeDetectorRef,
    injector: Injector
    ) { super(injector) }
  _transformer = (node: AccountsNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      id: node.id,
      accountType: node.accountType,
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
    this.isLoading = true;
    this.chartOfAccService.getChartOfAccount()
    .pipe(
      take(1),
       finalize(() => {
        this.isLoading = false;
        this.cdRef.detectChanges();
       })
     )
    .subscribe((data) => {
     
      this.dataSource.data = data.result;
      //console.log('this.dataSource.data', this.dataSource.data);
      this.cdRef.detectChanges();
    });
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

  addNewItem(node: FlatNode) {
    //console.log(node);
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
        this.chartOfAccService.getChartOfAccount()
        .pipe(
          take(1),
           finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
           })
         )
        .subscribe((res) => {
          this.dataSource.data = res.result;
          this.expandParents(node)
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
      //console.log('nodeId : ', node.id)
      const dialogRef = this.dialog.open(CreateLevel4Component, {
        width: '800px',
        data: {modelId: node.id}
      });
      dialogRef.afterClosed().subscribe(() => {
        this.chartOfAccService.getChartOfAccount()
        .pipe(
          take(1),
           finalize(() => {
            this.isLoading = false;
            this.cdRef.detectChanges();
           })
         )
        .subscribe((res) => {
          this.dataSource.data = res.result;
          this.expandParents(node)
          this.cdRef.detectChanges();
        })
      });
    }
  }

  expandParents(node: FlatNode) {
    const parent = this.getParent(node);
    this.treeControl.expand(parent);

    if (parent && parent.level > 0) {
      this.expandParents(parent);
    }
  }


  getParent(node: FlatNode) {
    
    const currentLevel = this.treeControl.getLevel(node);

    if (currentLevel < 1) {
      return null;
    }

    // const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;
    const startIndex = this.treeControl.dataNodes.indexOf(this.treeControl.dataNodes.find(x => x.id === node.id)) - 1;

    for (let i = startIndex; i >= 0; i--) {
      const currentNode = this.treeControl.dataNodes[i];
     
      if (this.treeControl.getLevel(currentNode) < currentLevel) {
        return currentNode;
      }
    }
  }
}


