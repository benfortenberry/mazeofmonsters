import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, IonRouterOutlet } from '@ionic/angular';
import { AudioService } from '../../providers/audioService';
import { ImagePreloadService } from '../../providers/imagePreloadService';
import { GAME_IMAGES } from '../../providers/gameAssets';

@Component({
    standalone: false,
    selector: 'app-intro',
    templateUrl: './intro.page.html',
    styleUrls: ['./intro.page.scss']
})
export class IntroPage implements OnInit {
    firstLine;
    secondLine;
    thirdLine;
    buttonReady;

    // Real loading progress: driven by how many of the game's images have
    // actually finished decoding, out of the total.
    loadPercent = 0;
    private imagesReady = false;
    private textDone = false;

    constructor(
        public navCtrl: NavController,
        private aService: AudioService,
        private imagePreload: ImagePreloadService
    ) {
        // Decode every game image up front; the bar fills as they settle.
        this.imagePreload
            .decode(GAME_IMAGES, (loaded, total) => {
                this.loadPercent = total === 0 ? 100 : Math.round((loaded / total) * 100);
            })
            .then(() => {
                this.imagesReady = true;
                this.updateButton();
            });

        setTimeout(() => {
            this.firstLine = true;
        }, 200);

        setTimeout(() => {
            this.secondLine = true;
        }, 1750);

        setTimeout(() => {
            this.thirdLine = true;
            this.textDone = true;
            this.updateButton();
        }, 4000);
    }

    ngOnInit() {}

    private updateButton() {
        // Button appears only once the story has played out AND every image is
        // decoded, so the player never enters the maze before art is ready.
        if (this.textDone && this.imagesReady) {
            this.buttonReady = true;
        }
    }

    // True while the story is done but images are still loading — show the bar.
    get loading(): boolean {
        return this.textDone && !this.imagesReady;
    }

    beginMaze() {
        this.aService.play('clickAudio');
        this.navCtrl.navigateForward('maze');
    }

    ionViewDidEnter() {
    }
}
