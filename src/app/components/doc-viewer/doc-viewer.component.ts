import { Component, Input, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { viewerType } from 'ngx-doc-viewer';

@Component({
  selector: 'vex-doc-viewer',
  templateUrl: './doc-viewer.component.html',
  styleUrls: ['./doc-viewer.component.scss']
})
export class DocViewerComponent implements OnInit {
  //url_doc: string
  viewer: viewerType = 'google';
  selectedType = 'pptx'; //'docx';
  //doc = 'http://198.251.71.105:8082/api/Archivos/DescargarArchivo/D2185557-67E6-40F0-9450-5B0B3AFFF7F0/c0011de1-2d37-42a1-a4c4-459e575c9309';

  // https://github.com/guigrpa/docx-templates#readme


  constructor(
    @Inject(MAT_DIALOG_DATA) public url_doc: string,
  ) {

    console.log(this.url_doc);

   }

  ngOnInit() {

  }

}
