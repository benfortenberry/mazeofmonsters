import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { AudioService } from '../../providers/audioService';
@Component({
    standalone: false,
    selector: 'app-ssb',
    templateUrl: './ssb.page.html',
    styleUrls: ['./ssb.page.scss']
})
export class SsbPage implements OnInit {
    choices = ['shield', 'sword', 'bow'];
    pickedChoice;
    humanTurn = true;
    cpuChoice;
    goAgain = false;
    resolved = false;

    constructor(private modalController: ModalController, private aService: AudioService) {}

    makeChoice(choice) {
        // Ignore clicks while a round is resolving (humanTurn is false during
        // the 1s reveal). Without this, rapid clicks start overlapping rounds
        // and can fire closeModal/dismiss more than once.
        if (!this.humanTurn) {
            return;
        }
        this.aService.play('clickAudio');
        this.pickedChoice = choice;
        this.humanTurn = false;
        this.cpuChoice = this.choices[Math.floor(Math.random() * this.choices.length)];

        setTimeout(() => {
            // Tie: reset and let the player choose again. Return so the
            // win/lose checks below don't run against the just-cleared values.
            if (this.cpuChoice === this.pickedChoice) {
                this.pickedChoice = null;
                this.cpuChoice = null;
                this.humanTurn = true;
                this.goAgain = true;
                setTimeout(() => {
                    this.goAgain = false;
                }, 1000);
                return;
            }

            // shield<sword, sword<bow, bow<shield (loser listed first).
            if (
                (this.pickedChoice === 'shield' && this.cpuChoice === 'sword') ||
                (this.pickedChoice === 'sword' && this.cpuChoice === 'bow') ||
                (this.pickedChoice === 'bow' && this.cpuChoice === 'shield')
            ) {
                this.closeModal(false);
            } else {
                this.closeModal(true);
            }
        }, 1000);
    }

    isSword() {
        if (this.cpuChoice === 'sword') {
            return true;
        } else {
            return false;
        }
    }

    isShield() {
        if (this.cpuChoice === 'shield') {
            return true;
        } else {
            return false;
        }
    }

    isBow() {
        if (this.cpuChoice === 'bow') {
            return true;
        } else {
            return false;
        }
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

    ngOnInit() {}
}
