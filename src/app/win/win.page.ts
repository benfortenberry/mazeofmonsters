import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, IonRouterOutlet } from '@ionic/angular';
import { AudioService } from '../../providers/audioService';
import { MazeProvider } from '../../providers/maze-service';
@Component({
    standalone: false,
    selector: 'app-win',
    templateUrl: './win.page.html',
    styleUrls: ['./win.page.scss']
})
export class WinPage implements OnInit {
    firstLine;
    secondLine;
    thirdLine;
    buttonReady;

    constructor(
        public navCtrl: NavController,
        private aService: AudioService,
        private mazeProvider: MazeProvider
    ) {
        // The player beat this maze, so the next run should be a brand-new one.
        // Rolling the seed here (rather than on maze entry) is what lets
        // death-retry and reloads reproduce the same maze while completion
        // moves you on to a fresh layout.
        this.mazeProvider.newSeed();

        setTimeout(() => {
            this.firstLine = true;
        }, 200);

        setTimeout(() => {
            this.secondLine = true;
        }, 1750);

        setTimeout(() => {
            this.thirdLine = true;
            this.buttonReady = true;
        }, 4000);
    }

    ngOnInit() {}

    ionViewDidEnter() {
        this.aService.play('winAudio');
    }

    beginMaze() {
        this.aService.play('clickAudio');
        this.navCtrl.navigateForward('intro');
    }

    ionViewWillLeave() {
        // window.location.reload();
    }
}
