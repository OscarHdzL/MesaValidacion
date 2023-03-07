import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'vex-tab-nueva-version',
  templateUrl: './tab-nueva-version.component.html',
  styleUrls: ['./tab-nueva-version.component.scss']
})
export class TabNuevaVersionComponent implements OnInit {
  data = {
    descripcionCorta: '',
    descripcionLarga: '',
    tokenFile: ''
  }
  isDragover = false;
  file: File | null = null;

  constructor() { }

  ngOnInit(): void {
  }

  agregarComentario() {

  }

  onFileSelected() {
    const inputNode: any = document.querySelector('#file');
  
    if (typeof (FileReader) !== 'undefined') {
      const reader = new FileReader();
  
      reader.onload = (e: any) => {
        //this.srcResult = e.target.result;
      };
  
      reader.readAsArrayBuffer(inputNode.files[0]);
    }
  }

  storeFile($event: Event) {
    
  }
}
