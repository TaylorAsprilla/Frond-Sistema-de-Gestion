import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CampoModel } from 'src/app/models/campo.model';
import { CongregacionModel } from 'src/app/models/congregacion.model';
import { MinisterioModel } from 'src/app/models/ministerio.model';
import { UsuarioModel } from 'src/app/models/usuario.model';
import { CampoService } from 'src/app/services/campo/campo.service';
import { CongregacionService } from 'src/app/services/congregacion/congregacion.service';
import { MinisterioService } from 'src/app/services/ministerio/ministerio.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  usuariosSubscription: Subscription;
  camposSubscription: Subscription;
  congregacionesSubscription: Subscription;
  ministeriosSubscription: Subscription;

  congregaciones: CongregacionModel[] = [];
  campos: CampoModel[] = [];
  ministerios: MinisterioModel[] = [];
  usuarios: UsuarioModel[] = [];

  totalUsuarios: number;

  constructor(
    private usuarioServices: UsuarioService,
    private congregacionServices: CongregacionService,
    private campoServices: CampoService,
    private ministerioService: MinisterioService
  ) {}

  ngOnInit(): void {
    // this.usuariosSubscription = this.usuarioService.listarUsuarios().subscribe((usuarios: UsuarioModel[]) => {
    //   this.usuarios = usuarios;
    // });

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
}
