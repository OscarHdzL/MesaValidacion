import { Injectable } from '@angular/core';
import { IComentarios } from '../modelos/IComentarios.model';

@Injectable({
  providedIn: 'root'
})
export class ForoService {
  comentarios: IComentarios[] = []

  constructor() { }

  getAllComentarios() {
    return this.comentarios
  }

  postComentario(comentario: IComentarios) {
    this.comentarios.push(comentario)
  }
}
