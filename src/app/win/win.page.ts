import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, IonRouterOutlet } from '@ionic/angular';
@Component({
    selector: 'app-win',
    templateUrl: './win.page.html',
    styleUrls: ['./win.page.scss']
})
export class WinPage implements OnInit {
    firstLine;
    secondLine;
    thirdLine;
    buttonReady;

    clickAudio = new Audio();

    backgroundAudio = new Audio();
    constructor(public navCtrl: NavController) {
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
        this.clickAudio.src = '../../assets/audio/ui click 11 [2018-10-13 162315].wav';
        this.clickAudio.load();

        this.backgroundAudio.src = '../../assets/audio/HappyMusic.ogg';
        this.backgroundAudio.load();
        this.backgroundAudio.volume = 0.1;
        this.backgroundAudio.play();
    }

    beginMaze() {
        this.clickAudio.play();
        this.navCtrl.navigateForward('intro');
    }
}
