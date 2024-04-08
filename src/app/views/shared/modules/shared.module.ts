import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatTabsModule} from '@angular/material/tabs';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';
import {MatCardModule} from '@angular/material/card';
import {MatMenuModule} from '@angular/material/menu';
import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTableModule} from '@angular/material/table';
import {MatListModule} from '@angular/material/list';
import {MatSlideToggleModule} from '@angular/material/slide-toggle'
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSliderModule} from '@angular/material/slider';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatTreeModule} from '@angular/material/tree';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatChipsModule} from '@angular/material/chips';
import {MatStepperModule} from '@angular/material/stepper';
import {MatSortModule} from '@angular/material/sort';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatDividerModule} from '@angular/material/divider';
import {MatIconModule} from '@angular/material/icon';
import {MatNativeDateModule} from '@angular/material/core';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDialogModule} from '@angular/material/dialog';
import {MatRadioModule} from '@angular/material/radio';
import {CustomTooltipComponent} from '../components/custom-tooltip/custom-tooltip.component';
import {NgxMatSelectSearchModule} from "ngx-mat-select-search";
import {DropdownComponent} from "../components/dropdown/dropdown.component";
import {GroupDropdownComponent} from "../components/group-dropdown/group-dropdown.component";
import {ConfirmationDialogComponent} from "../components/confirmation-dialog/confirmation-dialog.component";
import {FormConfirmationGuard} from "../route-guards/form-confirmation.guard";
import {NgxPrintModule} from "ngx-print";
import {BusyDirective} from "../directive/busy.directive";
import {ToastrModule} from "ngx-toastr";
import {ShortNumberPipe} from "../pipes/short-number.pipe";
import {CdkTreeModule} from "@angular/cdk/tree";
import { InputFieldComponent } from '../components/input-field/input-field.component';
import { DateInputComponent } from '../components/date-input/date-input.component';
import { ActionButtonComponent } from '../components/action-button/action-button.component';
import { NonNegativePipe } from '../pipes/non-negative/non-negative.pipe';
import { FileSizePipe } from '../pipes/non-negative/file-size/file-size.pipe';
import { ShowRemarksComponent } from '../components/show-remarks/show-remarks.component';
import { CustomUploadFileComponent } from '../components/custom-upload-file/custom-upload-file.component';
import { CustomRemarksComponent } from '../components/custom-remarks/custom-remarks.component';
import { DragDropDirective } from '../directive/drag-n-drop/dragDrop.directive';
import { TreeFilter } from '../pipes/tree-filter/tree-filter.pipe';
import {AgGridButtonCellRendrerComponent} from '../components/ag-grid-button-cell-rendrer/ag-grid-button-cell-rendrer.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SearchPipe } from '../pipes/search/search.pipe';


// @ts-ignore
@NgModule({
  declarations: [
    CustomTooltipComponent,
    DropdownComponent,
    GroupDropdownComponent,
    InputFieldComponent,
    DateInputComponent,
    ConfirmationDialogComponent,
    BusyDirective,
    ShortNumberPipe,
    ActionButtonComponent,
    ShowRemarksComponent,
    CustomUploadFileComponent,
    CustomRemarksComponent,
    NonNegativePipe,
    FileSizePipe,
    TreeFilter,
    DragDropDirective,
    AgGridButtonCellRendrerComponent,
    SearchPipe
  ],
  imports: [
    NgxPrintModule,
    NgxMatSelectSearchModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    NgxMatSelectSearchModule,
    MatListModule,
    MatSliderModule,
    MatCardModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatTabsModule,
    MatTooltipModule,
    MatSidenavModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTableModule,
    MatGridListModule,
    MatToolbarModule,
    MatBottomSheetModule,
    MatExpansionModule,
    MatDividerModule,
    MatSortModule,
    MatStepperModule,
    MatChipsModule,
    MatPaginatorModule,
    MatDialogModule,
    CommonModule,
    MatRadioModule,
    MatTreeModule,
    MatButtonToggleModule,
    CdkTreeModule,
    NgbModule,
    ToastrModule.forRoot({
      closeButton: true,
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),
  ],
  exports: [
    CdkTreeModule,
    ShortNumberPipe,
    ToastrModule,
    NgxPrintModule,
    ConfirmationDialogComponent,
    NgxMatSelectSearchModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatAutocompleteModule,
    NonNegativePipe,
    MatListModule,
    MatSliderModule,
    MatCardModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatMenuModule,
    MatTabsModule,
    MatTooltipModule,
    MatSidenavModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTableModule,
    MatGridListModule,
    MatToolbarModule,
    MatBottomSheetModule,
    MatExpansionModule,
    MatDividerModule,
    MatSortModule,
    MatStepperModule,
    MatChipsModule,
    MatPaginatorModule,
    MatDialogModule,
    CommonModule,
    FileSizePipe,
    MatRadioModule,
    MatTreeModule,
    MatButtonToggleModule,
    DropdownComponent,
    GroupDropdownComponent,
    InputFieldComponent,
    DateInputComponent,
    BusyDirective,
    DragDropDirective,
    ShowRemarksComponent,
    CustomUploadFileComponent,
    CustomRemarksComponent,
    TreeFilter,
    NgbModule,
    SearchPipe,
    AgGridButtonCellRendrerComponent
  ],
  providers: [
    //FormConfirmationGuard,
    DatePipe
  ]
})
export class SharedModule { }
