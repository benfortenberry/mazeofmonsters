import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MazePage } from './maze.page';
import { MapPage } from '../map/map.page';
import { SsbPage } from '../ssb/ssb.page';
import { OrbPage } from '../orb/orb';
import { GemPage } from '../gems/gems.page';
import { EyeballPage } from '../eyeball/eyeball.page';
import { XandoPage } from '../xando/xando.page';
const routes: Routes = [
    {
        path: '',
        component: MazePage
    }
];

@NgModule({
    imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes)],
    declarations: [MazePage, MapPage, SsbPage, OrbPage, XandoPage, GemPage, EyeballPage],
    entryComponents: [MapPage, SsbPage, OrbPage, EyeballPage, GemPage, XandoPage]
})
export class MazePageModule {}
