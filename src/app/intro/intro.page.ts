import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, IonRouterOutlet } from '@ionic/angular';
import { AudioService } from '../../providers/audioService';
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

    // The story text finishes at 4s; the maze wall textures are decoded in the
    // background during that time. The "Begin Maze" button only appears once
    // BOTH are done, so the player never enters the maze before the walls are
    // paint-ready (which is what caused the right-door wall to pop in).
    private textDone = false;
    private wallsReady = false;

    // The textures shown the instant you enter the maze. Decoding these ahead
    // guarantees they render immediately on the first room.
    private wallImages = [
        'assets/new-sandstone-3.jpg',
        'assets/new-sandstone-4.jpg',
        'assets/new-sandstone-5.jpg',
        'assets/sandy.jpg',
        'assets/stone.jpg',
        'assets/sandstone-large.jpg'
    ];

    constructor(public navCtrl: NavController, private aService: AudioService) {
        this.decodeWalls();

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

    // Fetch + decode (not just download) every wall texture so they are truly
    // paint-ready. Resolves wallsReady once all have settled (success or not —
    // a failed decode shouldn't trap the player on the intro forever).
    private decodeWalls() {
        const jobs = this.wallImages.map(src => {
            const img = new Image();
            img.src = src;
            if (typeof img.decode === 'function') {
                return img.decode().catch(() => {});
            }
            // Older browsers: fall back to the load event.
            return new Promise<void>(resolve => {
                img.onload = () => resolve();
                img.onerror = () => resolve();
            });
        });
        Promise.all(jobs).then(() => {
            this.wallsReady = true;
            this.updateButton();
        });
    }

    private updateButton() {
        if (this.textDone && this.wallsReady) {
            this.buttonReady = true;
        }
    }

    // True only in the brief window where the story is done but the walls are
    // still decoding — used to show a "preparing" note so the missing button
    // doesn't look broken.
    get preparing(): boolean {
        return this.textDone && !this.wallsReady;
    }

    beginMaze() {
        this.aService.play('clickAudio');
        this.navCtrl.navigateForward('maze');
    }

    ionViewDidEnter() {
    }
}
