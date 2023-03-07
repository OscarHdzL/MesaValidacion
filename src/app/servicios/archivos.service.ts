import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IArchivo } from '../modelos/IArchivo.model';

@Injectable({
  providedIn: 'root'
})
export class ArchivosService {
  dummyData: IArchivo[] = [
    {
      id: 1,
      titulo: 'Archvios de documentacion',
      fecha:  new Date(),
      subtitulo: 'Sistema siara',
      descripcion: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.',
      versiones: [
        {
          id: 1,
          version: 1,
          decripcionVersion: "Esta version se firmó en la sala de juntas de cliente"
        },
        {
          id: 2,
          version: 2,
          decripcionVersion: "Esta version se modifico de cliente"
        }
      ]
    },
    {
      id: 2,
      titulo: 'Archvios de documentacion 2',
      fecha: new Date(),
      subtitulo: 'Sistema siara',
      descripcion: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
    },
    {
      id: 3,
      titulo: 'Archvios de documentacion 3',
      fecha: new Date(),
      subtitulo: 'Sistema siara',
      descripcion: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.'
    }
  ]

  constructor(public http: HttpClient) { }

  getAllArchivos() {
    return this.dummyData
  }

  getArchivosById(id: number) {
    let item: IArchivo
    item = this.dummyData.find(q => q.id === id)
    return item
  }

  postArchivo() {
    
  }

  updateArchivo() {
    
  }
}
