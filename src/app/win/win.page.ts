import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, IonRouterOutlet } from '@ionic/angular';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
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

    ionViewDidEnter() {
        this.nativeAudio.preloadSimple('clickAudio', '../../assets/audio/ui click 11 [2018-10-13 162315].wav');

        this.nativeAudio.preloadComplex('winAudio', '../../assets/audio/HappyMusic.ogg', 0.5, 1, 0);

        this.nativeAudio.play('winAudio');
    }

    beginMaze() {
        this.nativeAudio.play('clickAudio');
        this.navCtrl.navigateForward('intro');
    }

    ionViewWillLeave() {
        // window.location.reload();
    }
}
