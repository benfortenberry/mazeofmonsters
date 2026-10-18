import { Component, OnInit, Input } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { AudioService } from '../../providers/audioService';

// One rendered map cell. Walls mirror mazeData[row][col] = [top,right,bottom,left]
// (1 = open passage, so a wall exists where the value is 0). `revealed` is true
// only for rooms the player has actually seen (routeHistory), so the map fills
// in as they explore / win mini-games.
interface MapCell {
    // Precomputed space-separated class string for the cell (revealed + which
    // walls). Collapsing the former five [class.*] bindings into one [ngClass]
    // string cuts Angular's per-cell change-detection work ~5x, which matters a
    // lot across a 900-cell grid and is the main reason the map was slow to open.
    cssClass: string;
    isExit: boolean;
    isPlayer: boolean;
    // CSS rotation (deg) for the player marker so it points the way they face.
    playerRotation: number;
}

@Component({
    standalone: false,
    selector: 'app-map',
    templateUrl: './map.page.html',
    styleUrls: ['./map.page.scss']
})
export class MapPage implements OnInit {
    currentRoom = null;
    currentDirection;
    routeHistory = null;
    hintedRooms = null;
    mazeData = null;
    // Exit coordinate, passed in so the star tracks the real maze size.
    exitId = '29-29';

    // The grid the template renders directly via *ngFor. Built once on enter so
    // the player/exit markers paint WITH the map rather than being injected into
    // the DOM a moment later (the old string-HTML + setTimeout approach made the
    // little person pop in a beat after the map opened).
    grid: MapCell[][] = [];

    constructor(
        private navParams: NavParams,
        private modalController: ModalController,
        private aService: AudioService
    ) {}

    ngOnInit() {
        this.mazeData = this.navParams.get('mazeData');
        this.routeHistory = this.navParams.get('routeHistory');
        this.hintedRooms = this.navParams.get('hintedRooms');
        this.currentRoom = this.navParams.get('currentRoom');
        this.currentDirection = this.navParams.get('currentDirection');
        this.exitId = this.navParams.get('exitId') || this.exitId;
    }

    ionViewWillEnter() {
        this.build();
    }

    private playerRotationFor(direction: string): number {
        // The marker icon points "up" by default; rotate it to face travel.
        switch (direction) {
            case 'n':
                return 180;
            case 'w':
                return 90;
            case 'e':
                return -90;
            default: // 's'
                return 0;
        }
    }

    private build() {
        const data = this.mazeData || [];
        const revealedSet = new Set<string>(this.routeHistory || []);
        const hintedSet = new Set<string>(this.hintedRooms || []);
        const playerRotation = this.playerRotationFor(this.currentDirection);

        this.grid = data.map((row: number[][], i: number) =>
            row.map((cell: number[], j: number) => {
                const id = i + '-' + j;
                const revealed = revealedSet.has(id);
                // A hinted room (revealed by a mini-game win, not yet walked)
                // gets its own colour so the gifted escape path stands out from
                // the player's own trail.
                const hinted = hintedSet.has(id);
                const isExit = id === this.exitId;

                // Build the cell's class string once. Walls only matter on
                // revealed cells (unrevealed stay empty/transparent).
                const classes = ['map-cell'];
                if (revealed) {
                    classes.push(hinted ? 'hint' : 'revealed');
                    if (cell[0] === 0) {
                        classes.push('wall-top');
                    }
                    if (cell[1] === 0) {
                        classes.push('wall-right');
                    }
                    if (cell[2] === 0) {
                        classes.push('wall-bottom');
                    }
                    if (cell[3] === 0) {
                        classes.push('wall-left');
                    }
                }
                if (isExit) {
                    classes.push('exit');
                }

                return {
                    cssClass: classes.join(' '),
                    isExit,
                    isPlayer: id === this.currentRoom,
                    playerRotation
                };
            })
        );
    }

    // Stable identity for the grid rows/cells so Angular doesn't rebuild DOM.
    trackByIndex(index: number): number {
        return index;
    }

    closeModal() {
        this.aService.play('clickAudio');
        this.modalController.dismiss();
    }
}
