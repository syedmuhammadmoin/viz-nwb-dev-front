import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { GridOptions } from "ag-grid-community";
import { DomSanitizer } from "@angular/platform-browser";
import { AppComponentBase } from 'src/app/views/shared/app-component-base';
import { DynamicColorChangeService } from 'src/app/views/shared/services/dynamic-color/dynamic-color-change.service';
import { AccessManagementService } from '../../service/access-management.service';
import { AppConst } from 'src/app/views/shared/AppConst';


@Component({
  selector: 'kt-print-role-permissions',
  templateUrl: './print-role-permissions.component.html',
  styleUrls: ['./print-role-permissions.component.scss']
})

export class PrintRolePermissionsComponent extends AppComponentBase implements OnInit {

  gridOptions: GridOptions;
  isLoading: boolean = true;
  edinfini : boolean;
  sbbu : boolean;
  vizalys : boolean;
  roleClaims: any = [];
  filterData: any = [];
  localsto : any ;
  className : any;

  constructor( private accessManagementService: AccessManagementService,
               private cdRef: ChangeDetectorRef,
               public dynamicColorChanging : DynamicColorChangeService,
               public sanitizer: DomSanitizer,
               injector: Injector
             ) { super(injector) }

  ngOnInit(): void {
    
    //Get All Permissions 
    this.getClaims();
      
    this.dynamicColorChanging.global_color.subscribe((res: any) => {

      if (localStorage.getItem('global_color')) {
        this.localsto = JSON.parse(localStorage.getItem('global_color'))
      }
      else {
        this.localsto = res;
      }

      this.edinfini = this.localsto.edinfini_true;
      this.vizalys = this.localsto.vizalys_true;
      this.sbbu = this.localsto.nawabshah_true;

      if(this.edinfini){
        this.className = 'edinfini row'
      }
      else if(this.sbbu){
        this.className = 'sbbu row'
      }
      else if(this.vizalys){
        this.className = 'vizalys row'
      }

      this.cdRef.detectChanges()
    })

  }  

  printDiv(divName : any) {
    const printContents = document.getElementById(divName).innerHTML;
    window.document.body.innerHTML = printContents
    window.document.append('<link rel="stylesheet" href="src/styles.scss">')
    window.print();
    window.document.close();
  }

  getClaims(){

    this.accessManagementService.getClaims().subscribe((res) => {
      res.result.forEach(element => {
        if(!element.toLowerCase().includes('delete')){
          this.roleClaims.push(
            {
              value: element,
              viewValue: AppConst.PermissionsDisplayName[element]
            })
        }
      });

      this.roleClaims = this.groupBy(this.roleClaims, value => value.value.split('.')[1])
   
      this.cdRef.markForCheck();
      this.isLoading = false;
      console.log(this.filterData);
    })
  }
}

