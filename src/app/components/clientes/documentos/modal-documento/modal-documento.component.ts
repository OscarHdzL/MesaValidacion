
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { KeysStorageEnum } from 'src/app/enum/keysStorage.enum';
import { DocumentoFormModel, DocumentoModel } from 'src/app/modelos/documentos.model';
import { SesionModel } from 'src/app/modelos/sesion.model';

import { MesaValidacionService } from 'src/app/servicios/mesa-validacion.service';
import { SwalServices } from 'src/app/servicios/sweetalert2.services';

@Component({
  selector: 'vex-modal-documento',
  templateUrl: './modal-documento.component.html',
  styleUrls: ['./modal-documento.component.scss']
})
export class ModalDocumentoComponent implements OnInit {
  sesionUsuarioActual: SesionModel;
  formDocumento: FormGroup;
  documentoModel: DocumentoFormModel = new DocumentoFormModel();
  listaSectores: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public documento: DocumentoModel,
              private dialogRef: MatDialogRef<ModalDocumentoComponent>,
              private formBuilder: FormBuilder,
              private swalService: SwalServices,
              private mesaValidacionService: MesaValidacionService
              ) {
                let sesion = localStorage.getItem(KeysStorageEnum.USER);
                this.sesionUsuarioActual = JSON.parse(sesion) as SesionModel;

                this.documentoModel.id = this.documento.id;
                this.documentoModel.nombre = this.documento.nombre;
                this.documentoModel.tblPeriodoId = this.documento.tblPeriodoId;

                this.iniciarForm();
               }

  async ngOnInit() {
    this.inicializarForm();
  }


  get nombre() { return this.formDocumento.get('nombre') }


  public iniciarForm(){
    this.formDocumento = this.formBuilder.group({
      nombre: ['', [Validators.required]]
    });
  }


  public inicializarForm() {
    this.nombre.setValue(this.documentoModel.nombre);
  }

  public async guardarDocumento(){
    //this.documentoModel.id = 0;
    this.documentoModel.nombre = this.nombre.value;

    const respuesta =  this.documentoModel.id > 0 ? await this.mesaValidacionService.actualizarDocumento(this.documentoModel) : await this.mesaValidacionService.insertarDocumento(this.documentoModel);

    if(respuesta.exito){
      this.swalService.alertaPersonalizada(true, 'Exito');
      this.close(true);
    } else {
      this.swalService.alertaPersonalizada(false, 'Error');
    }

  }

  close(result: boolean) {
    this.dialogRef.close(result);
  }

}
