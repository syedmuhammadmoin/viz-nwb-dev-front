import {
    Directive,
    Output,
    EventEmitter,
    HostListener
  } from '@angular/core';


@Directive({
  selector: '[ktDragDrop]'
})
export class DragDropDirective {

    @Output() fileDropped = new EventEmitter<any>();
    
    // Dragover listener
    @HostListener('dragover', ['$event']) onDragOver(event: Event) {
      event.preventDefault();
      event.stopPropagation();
    }
  
    // Dragleave listener
    @HostListener('dragleave', ['$event']) public onDragLeave(event: Event) {
      event.preventDefault();
      event.stopPropagation();
    }
  
    // Drop listener
    @HostListener('drop', ['$event']) public ondrop(event: Event & DragEventInit) {
      event.preventDefault();
      event.stopPropagation();
      const files = event.dataTransfer.files;
      if (files.length > 0) {
      this.fileDropped.emit(files);
      }
    }
}
