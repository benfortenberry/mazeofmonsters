import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, IonRouterOutlet } from '@ionic/angular';
@Component({
    selector: 'app-intro',
    templateUrl: './intro.page.html',
    styleUrls: ['./intro.page.scss']
})
export class IntroPage implements OnInit {
    firstLine;
    secondLine;
    thirdLine;
    buttonReady;

    clickAudio = new Audio();

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

    beginMaze() {
        this.clickAudio.play();
        this.navCtrl.navigateForward('maze');
    }

    ionViewDidEnter() {
        this.clickAudio.src = '../../assets/audio/ui click 11 [2018-10-13 162315].wav';
        this.clickAudio.load();
    }
}
