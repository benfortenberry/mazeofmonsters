import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { MazePage } from './maze.page';
import { MapPage } from '../map/map.page';
import { RpsPage } from '../rps/rps.page';
import { SimonPage } from '../simon/simon.page';
import { MemoryPage } from '../memory/memory.page';
import { ShellPage } from '../shell/shell.page';
import { TictactoePage } from '../tictactoe/tictactoe.page';
const routes: Routes = [
    {
        path: '',
        component: MazePage
    }
];

@NgModule({
    imports: [CommonModule, FormsModule, IonicModule, RouterModule.forChild(routes)],
    declarations: [MazePage, MapPage, RpsPage, SimonPage, TictactoePage, MemoryPage, ShellPage],
    entryComponents: [MapPage, RpsPage, SimonPage, ShellPage, MemoryPage, TictactoePage]
})
export class MazePageModule {}
