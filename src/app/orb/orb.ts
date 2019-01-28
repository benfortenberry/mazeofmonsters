import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
@Component({
    selector: 'app-orb',
    templateUrl: './orb.page.html',
    styleUrls: ['./orb.page.scss']
})
export class OrbPage implements OnInit {
    gameBegin = false;
    error = false;

    clickAudio = new Audio();
    beepAudio = new Audio();

    tileList = [
        { id: 0, active: false },
        { id: 1, active: false },
        { id: 2, active: false },
        { id: 3, active: false },
        { id: 4, active: false }
    ];

    humanGuesses = [];

    patternList = [];

    constructor(private modalController: ModalController) {
        this.clickAudio.src = '../../assets/audio/ui click 11 [2018-10-13 162315].wav';
        this.clickAudio.load();

        this.beepAudio.src = '../../assets/audio/beep.wav';
        this.beepAudio.load();

        setTimeout(() => {
            this.begin();
        }, 1000);
    }

    ngOnInit() {}

    storePattern(id) {
        this.clickAudio.play();

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
        if (status == null) {
            this.clickAudio.play();
        }
        this.modalController.dismiss({ result: status });
    }

    begin() {
        this.gameBegin = true;

        this.patternList.push(this.tileList[Math.floor(Math.random() * this.tileList.length)]);

        let endCounter = 1;
        let startCounter = 0;
        this.patternList.forEach(e => {
            setTimeout(() => {
                e.active = true;
                this.beepAudio.play();
            }, startCounter * 1000);

            setTimeout(() => {
                e.active = false;
            }, endCounter * 1000 - 500);

            startCounter++;
            endCounter++;
        });
    }
}
