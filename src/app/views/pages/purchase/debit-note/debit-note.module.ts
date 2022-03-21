import { NgModule } from "@angular/core";
import { AgGridModule } from "ag-grid-angular";
import { PartialsModule } from "src/app/views/partials/partials.module";
import { CustomTooltipComponent } from "src/app/views/shared/components/custom-tooltip/custom-tooltip.component";
import { SharedModule } from "src/app/views/shared/modules/shared.module";
import { BusinessPartnerService } from "../../profiling/business-partner/service/businessPartner.service";
import { CategoryService } from "../../profiling/category/service/category.service";
import { DepartmentService } from "../../profiling/department/service/department.service";
import { LocationService } from "../../profiling/location/service/location.service";
import { ProductService } from "../../profiling/product/service/product.service";
import { CreateDebitNoteComponent } from "./create-debit-note/create-debit-note.component";
import { DebitNoteDetailComponent } from "./debit-note-detail/debit-note-detail.component";
import { DebitNoteRoutingModule } from "./debit-note-routing.module";
import { ListDebitNoteComponent } from "./list-debit-note/list-debit-note.component";
import { PrintDebitNoteComponent } from "./print-debit-note/print-debit-note.component";
import { AddModalButtonService } from 'src/app/views/shared/services/add-modal-button/add-modal-button.service';
import { WarehouseService } from '../../profiling/warehouse/services/warehouse.service';


@NgModule({
  declarations: [
    ListDebitNoteComponent,
    CreateDebitNoteComponent,
    PrintDebitNoteComponent,
    DebitNoteDetailComponent
  ],
  imports: [
    PartialsModule,
    SharedModule,
    DebitNoteRoutingModule,
    AgGridModule.withComponents([CustomTooltipComponent]),
  
  ],

})
export class DebitNoteModule { }
