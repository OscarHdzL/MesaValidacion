import { Injectable } from "@angular/core";
import { resolve } from "path";
//import Swal.fire from 'sweetalert';
import Swal from "sweetalert2/dist/sweetalert2.js";

@Injectable({
  providedIn: "root",
})
export class SwalServices {
  public casoAlerta = [
    "Guardado",
    "guardar",
    "Editado",
    "editar",
    "Eliminado",
    "eliminar",
    "Ingrese los datos correctamente",
    "ingrese recatcha",
  ];
  public type = ["success", "error", "warning", "info", "question"];
  public title = ["Exito!", "Error!", "¿Desea eliminar este elemento?"];
  public textExito = [
    this.casoAlerta[0] + " correctamente.",
    this.casoAlerta[2] + " correctamente.",
    this.casoAlerta[4] + " correctamente.",
  ];
  public textError = [
    "Ocurrio un error al " + this.casoAlerta[1] + ".",
    "Ocurrio un error al " + this.casoAlerta[3] + ".",
    "Ocurrio un error al " + this.casoAlerta[5] + ".",
  ];
  constructor() {}

  public alertaPersonalizada(alert: boolean, mensaje: string) {
    this.swalEjecucuin(
      alert === true ? this.title[0] : this.title[1],
      mensaje,
      alert === true ? this.type[0] : this.type[1]
    );
  }

  public alertaPersonalizadoInfo(mensaje: string) {
    this.swalEjecucuin(this.title[1], this.casoAlerta[6], this.type[3]);
  }

  public datosnoEncontrados() {
    this.swalEjecucuin(this.title[1], "Datos no encontrados", this.type[3]);
  }

  public alertaRecatchaInfo() {
    this.swalEjecucuin(this.title[1], this.casoAlerta[7], this.type[3]);
  }

  public errorEnLosDatos(alert: boolean, mensaje: string) {
    this.swalEjecucuin(
      alert === true ? this.title[6] : this.title[1],
      mensaje,
      alert === true ? this.type[3] : this.type[1]
    );
  }

  public agregarElemento(alert: boolean) {
    this.swalEjecucuin(
      alert === true ? this.title[0] : this.title[1],
      alert === true ? this.textExito[0] : this.textError[0],
      alert === true ? this.type[0] : this.type[1]
    );
  }

  public editarElemento(alert: boolean) {
    this.swalEjecucuin(
      alert === true ? this.title[0] : this.title[1],
      alert === true ? this.textExito[1] : this.textError[1],
      alert === true ? this.type[0] : this.type[1]
    );
  }

  public eliminarElemento(alert: boolean) {
    this.swalEjecucuin(
      alert === true ? this.title[0] : this.title[1],
      alert === true ? this.textExito[2] : this.textError[2],
      alert === true ? this.type[0] : this.type[1]
    );
  }

  public swalEjecucuin(title, text, type) {
    Swal.fire({
      title: title,
      text: text,
      timer: 2000,
      icon: type,
    });
  }

  public usuarioEncontrado(alert: boolean) {
    this.swalEjecucuin(
      alert === true ? this.title[3] : this.title[1],
      alert === true ? this.textExito[3] : this.textError[3],
      alert === true ? this.type[0] : this.type[1]
    );
  }

  public camposNoLlenado() {
    this.alertaPersonalizadaInfo(
      "Llene los campos requeridos en el formulario."
    );
  }
  public alertaPersonalizadaInfo(mensaje: string) {
    this.swalEjecucuin(this.title[1], this.casoAlerta[6], this.type[3]);
  }

  public cargaDeDatos() {
    Swal.fire({
      title: `Buscando datos`,
      text: "por favor espere...",
      icon: "info",
    });
    Swal.fire.stopLoading(); /** Para que aparezca el simbolo de cargando y el usuario no pueda hacer nada */
  }

  public cerrarAlertaActiva() {
    Swal.close();
  }

  public async confirmacion(

    titulo: string,
    mensaje: string,
    textoBtnConfirma: string,
    textoBtnCancela: string
  ): Promise<any> {
    let resultado: any;

    await Swal.fire({
      //title: 'Are you sure want to remove?',
      title: titulo,
      //text: 'You will not be able to recover this file!',
      text: mensaje,
      icon: "warning",
      showCancelButton: true,
      //confirmButtonText: 'Yes, delete it!',
      confirmButtonText: textoBtnConfirma,
      cancelButtonText: 'Cancelar',
      //textoBtnCancela: "No, keep it",
    }).then(async (result) => {
      if (result.value) {
        /*      Swal.fire(
          'Deleted!',
          'Your imaginary file has been deleted.',
          'success'
        ) */
        resultado = true;
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        /*         Swal.fire(
          'Cancelled',
          'Your imaginary file is safe :)',
          'error'
        ) */
        return (resultado = false);
      }

      /* return new Promise(resolve => {
        resolve(resultado);
      }); */
    });

    return resultado;
  }
}
