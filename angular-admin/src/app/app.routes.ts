import {Routes} from '@angular/router';
import {LoginComponent} from './pages/login.component';
import {DashboardComponent} from './pages/dashboard.component';
import {LibrosComponent} from './pages/libros.component';
import {LibroFormComponent} from './pages/libro-form.component';
import {LibroDetalleComponent} from './pages/libro-detalle.component';
import {PrestamosComponent} from './pages/prestamos.component';
import {adminGuard} from './guards/admin.guard';
import { EstudianteLoginComponent } from './pages/estudiante-login.component';
import { EstudianteDashboardComponent } from './pages/estudiante-dashboard.component';
export const routes:Routes=[
    { path: 'estudiante/login', component: EstudianteLoginComponent },
    { path: 'estudiante', component: EstudianteDashboardComponent },

    {path:'login',component:LoginComponent},
    {path:'',component:DashboardComponent,canActivate:[adminGuard]},
    {path:'libros',component:LibrosComponent,canActivate:[adminGuard]},
    {path:'libros/nuevo',component:LibroFormComponent,canActivate:[adminGuard]},
    {path:'libros/:id/editar',component:LibroFormComponent,canActivate:[adminGuard]},
    {path:'libros/:id',component:LibroDetalleComponent,canActivate:[adminGuard]},
    {path:'prestamos',component:PrestamosComponent,canActivate:[adminGuard]},
    {path:'estudiante/login',component:EstudianteLoginComponent},
    {path:'estudiante',component:EstudianteDashboardComponent},
    {path:'**',redirectTo:''}
];
