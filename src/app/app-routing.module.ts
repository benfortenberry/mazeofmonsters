import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: '', redirectTo: 'intro', pathMatch: 'full' },
    { path: 'win', loadChildren: () => import('./win/win.module').then(m => m.WinPageModule) },
    { path: 'death', loadChildren: () => import('./death/death.module').then(m => m.DeathPageModule) },
    { path: 'intro', loadChildren: () => import('./intro/intro.module').then(m => m.IntroPageModule) },
    { path: 'maze', loadChildren: () => import('./maze/maze.module').then(m => m.MazePageModule) },
    { path: 'map', loadChildren: () => import('./map/map.module').then(m => m.MapPageModule) },
    { path: 'ssb', loadChildren: () => import('./ssb/ssb.module').then(m => m.SsbPageModule) },
    { path: 'eyeball', loadChildren: () => import('./eyeball/eyeball.module').then(m => m.EyeballPageModule) },
    { path: 'gems', loadChildren: () => import('./gems/gems.module').then(m => m.MemoryPageModule) },
    { path: 'xando', loadChildren: () => import('./xando/xando.module').then(m => m.XandoPageModule) },
    { path: 'orb', loadChildren: () => import('./orb/orb.module').then(m => m.OrbPageModule) }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
