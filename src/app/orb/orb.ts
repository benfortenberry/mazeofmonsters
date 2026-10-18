import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { AudioService } from '../../providers/audioService';
@Component({
    standalone: false,
    selector: 'app-orb',
    templateUrl: './orb.page.html',
    styleUrls: ['./orb.page.scss']
})
export class OrbPage implements OnInit {
    // Pattern length the player must successfully repeat to win. Lowered from
    // the original 7 to make orb fair for the stakes it carries.
    readonly WIN_PATTERN_LENGTH = 4;

    gameBegin = false;
    error = false;
    // False while the pattern is being shown; true when it's the player's turn
    // to repeat it. Blocks taps during playback from being counted as guesses.
    acceptingInput = false;
    resolved = false;

    tileList = [
        { id: 0, active: false },
        { id: 1, active: false },
        { id: 2, active: false },
        { id: 3, active: false },
        { id: 4, active: false }
    ];

    humanGuesses = [];

    patternList = [];

    // Planet tile images (CSS backgrounds). Decoded before the pattern starts
    // so the board is fully visible when the first tile flashes.
    private planetImages = [
        'assets/orb/planet-3.png',
        'assets/orb/planet-9.png',
        'assets/orb/planet-5.png',
        'assets/orb/planet-10.png',
        'assets/orb/planet-1.png'
    ];
    private started = false;

    constructor(private modalController: ModalController, private aService: AudioService) {}

    ngOnInit() {}

    // Start only after the modal has fully presented (ionViewDidEnter) AND the
    // planet images are decoded — otherwise the first pattern flashed before
    // the board was visible, so the player missed it.
    ionViewDidEnter() {
        if (this.started) {
            return;
        }
        this.started = true;

        const jobs = this.planetImages.map(src => {
            const img = new Image();
            img.src = src;
            if (typeof img.decode === 'function') {
                return img.decode().catch(() => {});
            }
            return new Promise<void>(resolve => {
                img.onload = () => resolve();
                img.onerror = () => resolve();
            });
        });

        Promise.all(jobs).then(() => {
            // Decoding a detached Image() only warms the cache — it does NOT
            // force the tiles' CSS background-image to actually paint. The tiles
            // sit at opacity 0.6 until flashed, so on the very first pattern step
            // a planet could still pop in late. Fix: briefly light every tile
            // (full opacity) as a "board reveal" so the browser paints all five
            // backgrounds on screen before any pattern step runs.
            this.tileList.forEach(t => (t.active = true));

            setTimeout(() => {
                this.tileList.forEach(t => (t.active = false));
                // Short beat after the reveal so the board clearly settles
                // before the first tile lights up.
                setTimeout(() => this.begin(), 400);
            }, 600);
        });
    }

    storePattern(id) {
        // Ignore taps while the pattern is still playing back, after the game
        // is resolved, or once this round's guesses are already complete.
        if (!this.acceptingInput || this.resolved || this.humanGuesses.length >= this.patternList.length) {
            return;
        }
        this.aService.play('clickAudio');

        this.tileList[id].active = true;

        setTimeout(() => {
            this.tileList[id].active = false;
        }, 200);

        this.humanGuesses.push(id);

        setTimeout(() => {
            this.tileList[id].active = false;

            if (this.humanGuesses.length === this.patternList.length) {
                this.compareLists();

                if (this.error === false) {
                    // Win at pattern length 4. The original 7 — with a single
                    // mistake ending the game — made orb punishingly hard for
                    // the stakes it carries; 4 still escalates and rewards focus
                    // without demanding a 30s flawless run.
                    if (this.patternList.length === this.WIN_PATTERN_LENGTH) {
                        this.closeModal(true);
                    } else {
                        this.humanGuesses.length = 0;
                        this.begin();
                    }
                }
            }
        }, 500);
    }

    compareLists(): Boolean {
        this.humanGuesses.forEach((element, index) => {
            if ((this.patternList[index].id === this.humanGuesses[index]) === false) {
                this.error = true;
                setTimeout(() => {
                    this.closeModal(false);
                }, 500);
            }
        });

        return true;
    }

    closeModal(status) {
        if (this.resolved) {
            return; // already dismissed once
        }
        this.resolved = true;
        if (status == null) {
            this.aService.play('clickAudio');
        }
        this.modalController.dismiss({ result: status });
    }

    begin() {
        this.gameBegin = true;
        // Lock input while the pattern plays back.
        this.acceptingInput = false;

        this.patternList.push(this.tileList[Math.floor(Math.random() * this.tileList.length)]);

        // Small lead-in so the first flash doesn't fire on the same tick begin()
        // runs (which made the first step easy to miss).
        const LEAD = 400;
        let endCounter = 1;
        let startCounter = 0;
        this.patternList.forEach(e => {
            setTimeout(() => {
                e.active = true;
                this.aService.play('beepAudio');
            }, LEAD + startCounter * 1000);

            setTimeout(() => {
                e.active = false;
            }, LEAD + endCounter * 1000 - 500);

            startCounter++;
            endCounter++;
        });

        // Hand control back to the player once the whole pattern has finished
        // flashing (one second per step).
        setTimeout(() => {
            this.acceptingInput = true;
        }, LEAD + this.patternList.length * 1000);
    }
}
