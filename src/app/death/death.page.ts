import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, IonRouterOutlet } from '@ionic/angular';
import { MazeProvider } from '../..//providers/maze-service';

@Component({
    selector: 'app-death',
    templateUrl: './death.page.html',
    styleUrls: ['./death.page.scss']
})
export class DeathPage implements OnInit {
    monsterImageUrl;
    monsterImageList;

    firstLine;
    secondLine;
    thirdLine;
    buttonReady;

    backgroundAudio = new Audio();

    clickAudio = new Audio();

    constructor(public navCtrl: NavController, public mazeProvider: MazeProvider) {
        this.getImages();

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

    tryAgain() {
        this.clickAudio.play();
        this.navCtrl.navigateForward('maze');
    }

    async getImages() {
        this.mazeProvider.getDeathImages().then(response => {
            this.monsterImageList = response['monsters'];

            this.monsterImageUrl =
                'url(../../assets/death/' +
                this.monsterImageList[Math.floor(Math.random() * this.monsterImageList.length)] +
                ')';
        });
    }

    ngOnInit() {}

    ionViewDidEnter() {
        this.backgroundAudio.src = '../../assets/audio/lose music 1 - 1_0.wav';
        this.backgroundAudio.load();
        this.backgroundAudio.volume = 0.1;

        this.backgroundAudio.play();

        this.clickAudio.src = '../../assets/audio/ui click 11 [2018-10-13 162315].wav';
        this.clickAudio.load();
    }
}
