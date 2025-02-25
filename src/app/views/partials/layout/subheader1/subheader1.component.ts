// Angular
import { AfterViewInit, Component, Input, OnDestroy } from '@angular/core';
import { isEmpty } from 'lodash';
// RxJS
import { Subscription } from 'rxjs';
// Layout
import { SubheaderService } from '../../../../core/_base/layout';
import { Breadcrumb } from '../../../../core/_base/layout/services/subheader.service';

@Component({
  selector: 'kt-subheader1',
  templateUrl: './subheader1.component.html',
  styleUrls: ['./subheader1.component.scss']
})
export class Subheader1Component implements OnDestroy, AfterViewInit {
  // Public properties
  @Input() fixed = true;
  @Input() clear = false;
  @Input() width = 'fluid';
  @Input() subheaderClasses = '';
  @Input() subheaderContainerClasses = '';
  @Input() displayDesc = false;
  @Input() displayDaterangepicker = true;

  today: number = Date.now();
  title = '';
  desc = '';
  breadcrumbs: Breadcrumb[] = [];

  // Private properties
  private subscriptions: Subscription[] = [];

  /**
   * Component constructor
   *
   * @param subheaderService: SubheaderService
   */
  constructor(public subheaderService: SubheaderService) {
  }

  /**
   * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
   */

  /**
   * After view init
   */
  ngAfterViewInit(): void {
    this.subscriptions.push(this.subheaderService.title$.subscribe(bt => {
      // breadcrumbs title sometimes can be undefined
      if (bt) {
          this.title = bt.title;
          this.desc = bt.desc;
          this.breadcrumbs = [];
      }
    }));

    this.subscriptions.push(this.subheaderService.breadcrumbs$.subscribe(bc => {
    if(!isEmpty(bc)) {
      this.breadcrumbs = bc;
    }
    }));
  }

  /**
   * On destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach(sb => sb.unsubscribe());
  }
}
