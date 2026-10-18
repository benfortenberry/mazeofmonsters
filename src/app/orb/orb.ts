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

    constructor(private modalController: ModalController, private aService: AudioService) {
        setTimeout(() => {
            this.begin();
        }, 1000);
    }

    ngOnInit() {}

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
                    if (this.patternList.length === 7) {
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

        let endCounter = 1;
        let startCounter = 0;
        this.patternList.forEach(e => {
            setTimeout(() => {
                e.active = true;
                this.aService.play('beepAudio');
            }, startCounter * 1000);

            setTimeout(() => {
                e.active = false;
            }, endCounter * 1000 - 500);

            startCounter++;
            endCounter++;
        });

        // Hand control back to the player once the whole pattern has finished
        // flashing (one second per step).
        setTimeout(() => {
            this.acceptingInput = true;
        }, this.patternList.length * 1000);
    }
}
