import { MesaValidacionService } from './../../../servicios/mesa-validacion.service';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { KeysStorageEnum } from 'src/app/enum/keysStorage.enum';
import { ClienteFormModel, ClienteModel } from 'src/app/modelos/cliente.model';
import { SesionModel } from 'src/app/modelos/sesion.model';
import { SwalServices } from 'src/app/servicios/sweetalert2.services';

@Component({
  selector: 'vex-modal-cliente',
  templateUrl: './modal-cliente.component.html',
  styleUrls: ['./modal-cliente.component.scss']
})
export class ModalClienteComponent implements OnInit {
  sesionUsuarioActual: SesionModel;
  formCliente: FormGroup;
  clienteModel: ClienteFormModel = new ClienteFormModel();
  listaSectores: any[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public cliente: ClienteModel,
              private dialogRef: MatDialogRef<ModalClienteComponent>,
              private formBuilder: FormBuilder,
              private swalService: SwalServices,
              private mesaValidacionService: MesaValidacionService
              ) {
                let sesion = localStorage.getItem(KeysStorageEnum.USER);
                this.sesionUsuarioActual = JSON.parse(sesion) as SesionModel;

                if(cliente != null){
                  this.clienteModel.id = this.cliente.id;
                  this.clienteModel.identificador = this.cliente.identificador;
                  this.clienteModel.nombre = this.cliente.nombre;
                  this.clienteModel.razonSocial =this.cliente.razonSocial;
                  this.clienteModel.rfc = this.cliente.rfc;
                  this.clienteModel.telefono = this.cliente.telefono;
                  this.clienteModel.correo = this.cliente.correo;
                  this.clienteModel.usuarioResponsableId = this.cliente.usuarioResponsableId;
                } else {
                  this.clienteModel = new ClienteFormModel();
                }


                this.iniciarForm();
               }

  async ngOnInit() {
    //this.listaSectores = await this.obtenerSectores();

    this.inicializarForm();
  }


  public async obtenerSectores(){
/*     const respuesta = await this.mesaValidacionService.obtenerCatalogoSectores();
    return respuesta; */
  }


  get identificador() { return this.formCliente.get('identificador') }
  get nombre() { return this.formCliente.get('nombre') }
  get razonSocial() { return this.formCliente.get('razonSocial') }
  get rfc() { return this.formCliente.get('rfc') }
  get telefono() { return this.formCliente.get('telefono') }
  get correo() { return this.formCliente.get('correo') }




  public iniciarForm(){
    this.formCliente = this.formBuilder.group({
      identificador: ['', [Validators.required]],
      nombre: ['', [Validators.required]],
      razonSocial: ['', [Validators.required]],
      rfc: ['', [Validators.required]],
      telefono: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
    });
  }


  public inicializarForm() {
    this.identificador.setValue(this.clienteModel.identificador);
    this.nombre.setValue(this.clienteModel.nombre);
    this.razonSocial.setValue(this.clienteModel.razonSocial);
    this.rfc.setValue(this.clienteModel.rfc);
    this.telefono.setValue(this.clienteModel.telefono);
    this.correo.setValue(this.clienteModel.correo);
  }

  public async guardarCliente(){
    //this.clienteModel.id = 0;
    this.clienteModel.identificador = this.identificador.value;
    this.clienteModel.nombre = this.nombre.value;
    this.clienteModel.razonSocial =this.razonSocial.value;
    this.clienteModel.rfc = this.rfc.value;
    this.clienteModel.telefono = this.telefono.value;
    this.clienteModel.correo = this.correo.value;
    this.clienteModel.activo = true;
    this.clienteModel.usuarioResponsableId = this.sesionUsuarioActual.id;

    const respuesta =  this.clienteModel.id > 0 ? await this.mesaValidacionService.actualizarCliente(this.clienteModel) : await this.mesaValidacionService.insertarCliente(this.clienteModel);

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
