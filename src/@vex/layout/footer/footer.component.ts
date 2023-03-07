import { Component, Input, OnDestroy, OnInit, TemplateRef } from '@angular/core';

@Component({
  selector: 'vex-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit, OnDestroy {
  anioActual: number  = new Date().getFullYear();
  @Input() customTemplate: TemplateRef<any>;

  constructor() {
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {}
}
