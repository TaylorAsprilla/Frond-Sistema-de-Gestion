import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CampoModel } from 'src/app/models/campo.model';
import { CongregacionModel } from 'src/app/models/congregacion.model';
import { MinisterioModel } from 'src/app/models/ministerio.model';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { BusquedasService } from 'src/app/services/busquedas/busquedas.service';
import { CampoService } from 'src/app/services/campo/campo.service';
import { CongregacionService } from 'src/app/services/congregacion/congregacion.service';
import { MinisterioService } from 'src/app/services/ministerio/ministerio.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent implements OnInit, OnDestroy {
  usuariosSubscription: Subscription;
  camposSubscription: Subscription;
  congregacionesSubscription: Subscription;
  ministeriosSubscription: Subscription;

  congregaciones: CongregacionModel[] = [];
  campos: CampoModel[] = [];
  ministerios: MinisterioModel[] = [];
  usuarios: UsuarioModel[] = [];

  totalUsuarios: number;
  titulo: string;
  placeholderBuscador: string;

  existeUsuario: boolean = false;

  constructor(
    private usuarioServices: UsuarioService,
    private congregacionServices: CongregacionService,
    private campoServices: CampoService,
    private ministerioService: MinisterioService,
    private busquedasService: BusquedasService
  ) {}

  ngOnInit(): void {
    this.titulo = 'Buscar usuarios vacunados';
    this.placeholderBuscador = 'Ingrese el número de documento';

    this.usuariosSubscription = this.usuarioServices.listarUsuarios().subscribe(({ totalUsuarios, usuarios }) => {
      this.totalUsuarios = totalUsuarios;
      this.usuarios = usuarios;
    });

    this.congregacionesSubscription = this.congregacionServices
      .listarCongregaciones()
      .subscribe((congregaciones: CongregacionModel[]) => {
        this.congregaciones = congregaciones;
      });

    this.camposSubscription = this.campoServices.listarCampos().subscribe((campos: CampoModel[]) => {
      this.campos = campos;
    });

    this.ministeriosSubscription = this.ministerioService
      .listarMinisterios()
      .subscribe((ministerios: MinisterioModel[]) => {
        this.ministerios = ministerios;
      });
  }

  ngOnDestroy(): void {
    this.usuariosSubscription?.unsubscribe();
    this.congregacionesSubscription?.unsubscribe();
    this.camposSubscription?.unsubscribe();
    this.ministeriosSubscription?.unsubscribe();
  }

  buscarUsuario(termino: string) {
    if (termino.length === 0) {
      this.existeUsuario = false;
    } else {
      this.busquedasService.buscarUsuario(termino).subscribe((usuarios: any) => {
        this.usuarios = usuarios;
        this.existeUsuario = true;
      });
    }
  }
}