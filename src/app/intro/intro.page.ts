import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, IonRouterOutlet } from '@ionic/angular';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
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

    constructor(public navCtrl: NavController, private nativeAudio: NativeAudio) {
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
        this.nativeAudio.play('clickAudio');
        this.navCtrl.navigateForward('maze');
    }

    ionViewDidEnter() {
    }
}
