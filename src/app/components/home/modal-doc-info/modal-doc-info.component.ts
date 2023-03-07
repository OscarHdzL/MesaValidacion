import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'vex-modal-doc-info',
  templateUrl: './modal-doc-info.component.html',
  styleUrls: ['./modal-doc-info.component.scss']
})
export class ModalDocInfoComponent implements OnInit {
  panelOpenState = false

  constructor(
    @Inject(MAT_DIALOG_DATA) public objeto: any
  ) { }

  ngOnInit(): void {
    
  }
}
