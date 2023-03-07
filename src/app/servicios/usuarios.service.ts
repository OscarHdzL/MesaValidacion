import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IUsuario } from '../modelos/IUsuario.model';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  dummyUsers: IUsuario[] = [
    {
      id: 1,
      nombre: 'Jose Tapia'
    },
    {
      id: 2,
      nombre: 'Luis Lopez'
    }
  ]

  constructor(public http: HttpClient) { }

  getUsuarioById(id: number) {
    let item: IUsuario
    item = this.dummyUsers.find(q => q.id === id)
    return item
  }
}
