// Angular
import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'kt-notice',
  templateUrl: './notice.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NoticeComponent {
  // Public properties
  @Input() classes: string;
  @Input() icon: string;
  @Input() svg: string;

  /**
   * Component constructor
   */
  constructor() {}
}
