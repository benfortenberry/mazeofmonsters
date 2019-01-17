import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'intro', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'win', loadChildren: './win/win.module#WinPageModule' },
  { path: 'death', loadChildren: './death/death.module#DeathPageModule' },
  { path: 'generate', loadChildren: './generate/generate.module#GeneratePageModule' },
  { path: 'intro', loadChildren: './intro/intro.module#IntroPageModule' },
  { path: 'generator2', loadChildren: './generator2/generator2.module#Generator2PageModule' },
  { path: 'maze', loadChildren: './maze/maze.module#MazePageModule' },
  { path: 'generator3', loadChildren: './generator3/generator3.module#Generator3PageModule' },
  { path: 'map', loadChildren: './map/map.module#MapPageModule' },
  { path: 'rps', loadChildren: './rps/rps.module#RpsPageModule' },
  { path: 'shell', loadChildren: './shell/shell.module#ShellPageModule' },
  { path: 'memory', loadChildren: './memory/memory.module#MemoryPageModule' },
  { path: 'tictactoe', loadChildren: './tictactoe/tictactoe.module#TictactoePageModule' },
  { path: 'simon', loadChildren: './simon/simon.module#SimonPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
