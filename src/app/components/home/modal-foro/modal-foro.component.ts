import { Component, OnInit, Inject, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IComentarios } from 'src/app/modelos/IComentarios.model';
import { IUsuario } from 'src/app/modelos/IUsuario.model';
import { ForoService } from 'src/app/servicios/foro.service';
import { UsuariosService } from 'src/app/servicios/usuarios.service';

@Component({
  selector: 'vex-modal-foro',
  templateUrl: './modal-foro.component.html',
  styleUrls: ['./modal-foro.component.scss']
})
export class ModalForoComponent implements OnInit, AfterViewInit {
  @ViewChild('list') list?: ElementRef<HTMLUListElement>;
  panelOpenState = false
  listaComentarios: IComentarios[]
  usuario: IUsuario
  checkoutForm = this.formBuilder.group({
    comentario: ''
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public objeto: any,
    public usuariosServicio: UsuariosService,
    public comentariosServicio: ForoService,
    private formBuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.usuario = this.usuariosServicio.getUsuarioById(1)
    this.listaComentarios = this.comentariosServicio.getAllComentarios()
  }

  ngAfterViewInit() {
    const maxScroll = this.list?.nativeElement.scrollHeight;
    this.list?.nativeElement.scrollTo({ top: maxScroll, behavior: 'smooth' });
  }

  onSubmit(): void {
    this.comentariosServicio.postComentario({
      usuarioId: this.usuario.id,
      fecha: new Date(),
      decripcionVersion: this.checkoutForm.value.comentario as string
    })
    
    this.checkoutForm.reset();
  }
}
