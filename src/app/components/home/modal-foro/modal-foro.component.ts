import {
  Component,
  OnInit,
  Inject,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { MAT_DIALOG_DATA } from "@angular/material/dialog";
import { KeysStorageEnum } from "src/app/enum/keysStorage.enum";
import { ComentarioDocumentoProyecto, ComentarioDocumentoProyectoFormModel } from "src/app/modelos/ComentarioDocumentoProyecto.model";
import { DocumentosProyectoModel } from "src/app/modelos/DocumentosProyecto.model";
import { IComentarios } from "src/app/modelos/IComentarios.model";
import { IUsuario } from "src/app/modelos/IUsuario.model";
import { SesionModel } from "src/app/modelos/sesion.model";
import { ForoService } from "src/app/servicios/foro.service";
import { MesaValidacionService } from "src/app/servicios/mesa-validacion.service";
import { SwalServices } from "src/app/servicios/sweetalert2.services";
import { UsuariosService } from "src/app/servicios/usuarios.service";

@Component({
  selector: "vex-modal-foro",
  templateUrl: "./modal-foro.component.html",
  styleUrls: ["./modal-foro.component.scss"],
})
export class ModalForoComponent implements OnInit, AfterViewInit {
  sesionUsuarioActual: SesionModel;
  @ViewChild("list") list?: ElementRef<HTMLUListElement>;
  panelOpenState = false;
  listaComentarios: ComentarioDocumentoProyecto[] = [];
  usuario: IUsuario;
  checkoutForm = this.formBuilder.group({
    comentario: "",
  });

  idUsuarioActual: number;
  comentarioDocumentoProyecto: ComentarioDocumentoProyectoFormModel = new ComentarioDocumentoProyectoFormModel();

  constructor(
    @Inject(MAT_DIALOG_DATA) public doc: DocumentosProyectoModel,
    public usuariosServicio: UsuariosService,
    public comentariosServicio: ForoService,
    private formBuilder: FormBuilder,
    private mesaValidacionService: MesaValidacionService,
    private swalService: SwalServices
  ) {
    let sesion = localStorage.getItem(KeysStorageEnum.USER);
    this.sesionUsuarioActual = JSON.parse(sesion) as SesionModel;
    this.idUsuarioActual = this.sesionUsuarioActual.id;

  }

  async ngOnInit() {
    this.usuario = this.usuariosServicio.getUsuarioById(1);
    //this.listaComentarios = this.comentariosServicio.getAllComentarios();

    this.listaComentarios = await this.obtenerComentarios();
  }

  ngAfterViewInit() {
    const maxScroll = this.list?.nativeElement.scrollHeight;
    this.list?.nativeElement.scrollTo({ top: maxScroll, behavior: "smooth" });
  }

  onSubmit(): void {
    if (this.checkoutForm.value.comentario) {
      this.comentariosServicio.postComentario({
        usuarioId: this.usuario.id,
        fecha: new Date(),
        decripcionVersion: this.checkoutForm.value.comentario as string,
      });
    }
    this.checkoutForm.reset();
  }

  public async obtenerComentarios() {

    const respuesta = await this.mesaValidacionService.obtenerComentariosDocumentoProyecto(this.doc.idUltimaVersion);
    return respuesta.exito ? respuesta.respuesta : [];
  }

  public async guardarComentario() {

    if (this.checkoutForm.value.comentario) {
      this.comentarioDocumentoProyecto = new ComentarioDocumentoProyectoFormModel();
      this.comentarioDocumentoProyecto.id = 0;
      this.comentarioDocumentoProyecto.tblProyectoDocumentoId =
        this.doc.idUltimaVersion;
      this.comentarioDocumentoProyecto.catUsuarioId = this.idUsuarioActual;
      this.comentarioDocumentoProyecto.comentario = this.checkoutForm.value
        .comentario as string;

      const respuesta =
        await this.mesaValidacionService.insertarComentariosDocumentoProyecto(
          this.comentarioDocumentoProyecto
        );

      if (respuesta.exito) {

        //this.swalService.alertaPersonalizada(true, "Exito");
        this.checkoutForm.reset();
        this.ngOnInit();
      } else {
        this.swalService.alertaPersonalizada(false, "Error");
      }
    }
  }
}
