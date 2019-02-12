import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, IonRouterOutlet } from '@ionic/angular';
import { MazeProvider } from '../..//providers/maze-service';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
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

    constructor(public navCtrl: NavController, public mazeProvider: MazeProvider, private nativeAudio: NativeAudio) {
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
        this.nativeAudio.play('clickAudio');
        this.navCtrl.navigateRoot('maze');
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
        this.nativeAudio.play('loseAudio');
    }
}
