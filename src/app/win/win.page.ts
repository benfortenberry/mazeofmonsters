import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, IonRouterOutlet } from '@ionic/angular';
import { AudioService } from '../../providers/audioService';
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

    constructor(public navCtrl: NavController, private aService: AudioService) {
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
