// Angular
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgApexchartsModule } from 'ng-apexcharts';
// NgBootstrap
import { NgbDropdownModule, NgbNavModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
// Core module
import { CoreModule } from '../../core/core.module';
// Layout partials
import {
  QuickUserPanelComponent,
  SplashScreenComponent,
  Subheader1Component,
  UserProfile4Component,
  ScrollTopComponent
} from './layout';
// General
import { NoticeComponent } from './content/general/notice/notice.component';
import { PortletModule } from './content/general/portlet/portlet.module';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { InlineSvgDirective } from '../shared/directive/inline-svg/inline-svg.directive';
import { ActionNotificationComponent } from './content/action-notification/action-notification.component';

@NgModule({
  declarations: [
    NoticeComponent,
    ActionNotificationComponent,
    QuickUserPanelComponent,
    SplashScreenComponent,
    Subheader1Component,
    UserProfile4Component,
    ScrollTopComponent,
    InlineSvgDirective
  ],
  exports: [
    PortletModule,
    NoticeComponent,
    ActionNotificationComponent,
    InlineSvgDirective,
    QuickUserPanelComponent,
    SplashScreenComponent,
    Subheader1Component,
    UserProfile4Component,
    ScrollTopComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    CoreModule,
    PortletModule,
    NgApexchartsModule,
    // angular material modules
    MatButtonModule,
    MatMenuModule,
    MatSelectModule,
    MatInputModule,
    MatTableModule,
    MatAutocompleteModule,
    MatRadioModule,
    MatIconModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatCardModule,
    MatPaginatorModule,
    MatSortModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTabsModule,
    MatTooltipModule,
    MatDialogModule,
    // ng-bootstrap modules
    NgbDropdownModule,
    NgbNavModule,
    NgbTooltipModule,
  ],
})
export class PartialsModule {
}
