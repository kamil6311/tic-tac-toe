import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { PlayGuard } from './guards/play.guard';

const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  },
  {
    path: 'play/:roomId',
    loadChildren: () => import('./pages/play/play.module').then(m => m.PlayPageModule), canActivate: [PlayGuard]
  },
  {
    path: 'invite/:roomId',
    loadChildren: () => import('./pages/invite/invite.module').then( m => m.InvitePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
