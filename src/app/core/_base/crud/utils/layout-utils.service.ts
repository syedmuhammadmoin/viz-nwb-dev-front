// Angular
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActionNotificationComponent } from '../../../../views/partials/content/action-notification/action-notification.component';

export enum MessageType { Create }

@Injectable()
export class LayoutUtilsService {
  /**
   * Service constructor
   *
   * @param snackBar: MatSnackBar
   * @param dialog: MatDialog
   */
  constructor(private snackBar: MatSnackBar) {
  }

  /**
   * Showing (Mat-Snackbar) Notification
   *
   * @param message: string
   * @param type: MessageType
   * @param duration: number
   * @param showCloseButton: boolean
   * @param showUndoButton: boolean
   * @param undoButtonDuration: number
   * @param verticalPosition: 'top' | 'bottom' = 'top'
   */
  showActionNotification(
    message: string,
    type: MessageType = MessageType.Create,
    duration: number = 10000,
    showCloseButton: boolean = true,
    showUndoButton: boolean = true,
    undoButtonDuration: number = 3000,
    verticalPosition: 'top' | 'bottom' = 'bottom'
  ) {
    const data = {
      message,
      snackBar: this.snackBar,
      showCloseButton,
      showUndoButton,
      undoButtonDuration,
      verticalPosition,
      type,
      action: 'Undo'
    };
    return this.snackBar.openFromComponent(ActionNotificationComponent, {
      duration,
      data,
      verticalPosition
    });
  }
}
