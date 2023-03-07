import { Directive, HostListener } from '@angular/core';

@Directive({
  selector: '[vexEventBlockerDirective]'
})
export class EventBlockerDirectiveDirective {

  @HostListener('drop', ['$event'])
  @HostListener('dragover', ['$event'])
  public handleEvent(event: Event) {
    event.preventDefault();
  }

}
