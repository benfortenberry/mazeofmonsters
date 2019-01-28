import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    { path: '', redirectTo: 'intro', pathMatch: 'full' },
    { path: 'win', loadChildren: './win/win.module#WinPageModule' },
    { path: 'death', loadChildren: './death/death.module#DeathPageModule' },
    { path: 'intro', loadChildren: './intro/intro.module#IntroPageModule' },
    { path: 'generator2', loadChildren: './generator2/generator2.module#Generator2PageModule' },
    { path: 'maze', loadChildren: './maze/maze.module#MazePageModule' },
    { path: 'map', loadChildren: './map/map.module#MapPageModule' },
    { path: 'ssb', loadChildren: './ssb/ssb.module#SsbPageModule' },
    { path: 'eyeball', loadChildren: './eyeball/eyeball.module#EyeballPageModule' },
    { path: 'gems', loadChildren: './gems/gems.module#MemoryPageModule' },
    { path: 'xando', loadChildren: './xando/xando.module#XandoPageModule' },
    { path: 'orb', loadChildren: './orb/orb.module#OrbPageModule' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {}
