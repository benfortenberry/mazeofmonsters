import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'intro', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule' },
  { path: 'win', loadChildren: './win/win.module#WinPageModule' },
  { path: 'death', loadChildren: './death/death.module#DeathPageModule' },
  { path: 'generate', loadChildren: './generate/generate.module#GeneratePageModule' },
  { path: 'intro', loadChildren: './intro/intro.module#IntroPageModule' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
