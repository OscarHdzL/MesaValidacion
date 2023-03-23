import { Component, Input, OnInit } from '@angular/core';
import { NavigationService } from '../../services/navigation.service';
import { LayoutService } from '../../services/layout.service';
import { ConfigService } from '../../config/config.service';
import { map, startWith, switchMap } from 'rxjs/operators';
import { NavigationLink } from '../../interfaces/navigation-item.interface';
import { PopoverService } from '../../components/popover/popover.service';
import { Observable, of } from 'rxjs';
import { UserMenuComponent } from '../../components/user-menu/user-menu.component';
import { MatDialog } from '@angular/material/dialog';
import { SearchModalComponent } from '../../components/search-modal/search-modal.component';
import { SesionModel } from 'src/app/modelos/sesion.model';
import { KeysStorageEnum } from 'src/app/enum/keysStorage.enum';
import { MesaValidacionService } from 'src/app/servicios/mesa-validacion.service';

@Component({
  selector: 'vex-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent implements OnInit {
  sesionUsuarioActual: SesionModel;
  @Input() collapsed: boolean;
  collapsedOpen$ = this.layoutService.sidenavCollapsedOpen$;
  title$ = this.configService.config$.pipe(map(config => config.sidenav.title));
  imageUrl$ = this.configService.config$.pipe(map(config => config.sidenav.imageUrl));
  showCollapsePin$ = this.configService.config$.pipe(map(config => config.sidenav.showCollapsePin));
  userVisible$ = this.configService.config$.pipe(map(config => config.sidenav.user.visible));
  searchVisible$ = this.configService.config$.pipe(map(config => config.sidenav.search.visible));

  userMenuOpen$: Observable<boolean> = of(false);

  items = this.navigationService.items;

  constructor(private navigationService: NavigationService,
              private layoutService: LayoutService,
              private configService: ConfigService,
              private readonly popoverService: PopoverService,
              private readonly dialog: MatDialog,
              private mesaValidacionService: MesaValidacionService
              ) {

                let sesion = localStorage.getItem(KeysStorageEnum.USER);
    this.sesionUsuarioActual = JSON.parse(sesion) as SesionModel;

              }

 async ngOnInit() {
debugger

    this.sesionUsuarioActual.funciones = await this.obtenerFunciones();
    //SE SOBREESCRIBE EL VALOR POR SI HUBO CAMBIOS EN LAS FUNCIONES (SIDEBAR)
    localStorage.setItem(KeysStorageEnum.USER,JSON.stringify(this.sesionUsuarioActual));

    let children = [];
     let menu = this.sesionUsuarioActual.funciones.filter((x)=> x.modulo == 'Sidebar' && x.activo == true);
     menu.forEach((x)=>{

      switch(x.funcion){
        case 'Mesa de Validación':
        children.push({
          type: 'link',
          label: 'Mesa validación',
          route: '/components/home',
          icon: 'mat:file_copy',
          routerLinkActiveOptions: { exact: true }
        });
        break;

        case 'Clientes':
        children.push({
          type: 'link',
          label: 'Clientes',
          route: '/components/clientes',
          icon: 'mat:list',
          routerLinkActiveOptions: { exact: true }
        });
        break;

        case 'Áreas':
        children.push({
          type: 'link',
          label: 'Áreas',
          route: '/components/areas',
          icon: 'mat:list',
          routerLinkActiveOptions: { exact: true }
        });
        break;

        case 'Roles':
        children.push({
          type: 'link',
          label: 'Roles',
          route: '/components/roles',
          icon: 'mat:list',
          routerLinkActiveOptions: { exact: true }
        });
        break;

        case 'Usuarios':
        children.push({
          type: 'link',
          label: 'Usuarios',
          route: '/components/usuarios',
          icon: 'mat:list',
          routerLinkActiveOptions: { exact: true }
        });
        break;
      }
     });

     this.navigationService.items = [
      {
        type: 'subheading',
        label: 'Contenido',
        children: children
      }];



    this.items = this.navigationService.items;

        /* if(this.sesionUsuarioActual.administrador){
      this.navigationService.items = [
        {
          type: 'subheading',
          label: 'Contenido',
          children: [
            {
              type: 'link',
              label: 'Mesa validación',
              route: '/components/home',
              icon: 'mat:file_copy',
              routerLinkActiveOptions: { exact: true }
            },
            {
              type: 'link',
              label: 'Clientes',
              route: '/components/clientes',
              icon: 'mat:list',
              routerLinkActiveOptions: { exact: true }
            },
            {
              type: 'link',
              label: 'Áreas',
              route: '/components/areas',
              icon: 'mat:list',
              routerLinkActiveOptions: { exact: true }
            },
            {
              type: 'link',
              label: 'Roles',
              route: '/components/roles',
              icon: 'mat:list',
              routerLinkActiveOptions: { exact: true }
            },
            {
              type: 'link',
              label: 'Usuarios',
              route: '/components/usuarios',
              icon: 'mat:list',
              routerLinkActiveOptions: { exact: true }
            }

          ]
        }
      ];
    } else {
      this.navigationService.items = [
        {
          type: 'subheading',
          label: 'Contenido',
          children: [
            {
              type: 'link',
              label: 'Mesa validación',
              route: '/components/home',
              icon: 'mat:file_copy',
              routerLinkActiveOptions: { exact: true }
            },
            {
              type: 'link',
              label: 'Clientes',
              route: '/components/clientes',
              icon: 'mat:list',
              routerLinkActiveOptions: { exact: true }
            }
          ]
        }
      ];
    } */
  }
  //METODO PARA OBTENER LAS FUNCIONES DEL USUARIO, SE EJECUTA EN ESTE COMPONENTE PARA QUE SE EJECUTE LA ACTUALIZACION DE FUNCIONES SIN NECESIDAD DE CERRAR SESION
  public async obtenerFunciones(){
    const respuesta = await this.mesaValidacionService.obtenerFuncionesUsuario(this.sesionUsuarioActual.id);
    return respuesta.exito ? respuesta.respuesta : [];
  }


  collapseOpenSidenav() {
    this.layoutService.collapseOpenSidenav();
  }

  collapseCloseSidenav() {
    this.layoutService.collapseCloseSidenav();
  }

  toggleCollapse() {
    this.collapsed ? this.layoutService.expandSidenav() : this.layoutService.collapseSidenav();
  }

  trackByRoute(index: number, item: NavigationLink): string {
    return item.route;
  }

  openProfileMenu(origin: HTMLDivElement): void {
    this.userMenuOpen$ = of(
      this.popoverService.open({
        content: UserMenuComponent,
        origin,
        offsetY: -8,
        width: origin.clientWidth,
        position: [
          {
            originX: 'center',
            originY: 'top',
            overlayX: 'center',
            overlayY: 'bottom'
          }
        ]
      })
    ).pipe(
      switchMap(popoverRef => popoverRef.afterClosed$.pipe(map(() => false))),
      startWith(true),
    );
  }

  openSearch(): void {
    this.dialog.open(SearchModalComponent, {
      panelClass: 'vex-dialog-glossy',
      width: '100%',
      maxWidth: '600px'
    });
  }
}
