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

    // What each move is beaten BY — i.e. the move that defeats the key.
    // shield beats bow, bow beats sword, sword beats shield. So the counter to
    // a given move is: shield <- sword, sword <- bow, bow <- shield.
    private readonly counterTo = { shield: 'sword', sword: 'bow', bow: 'shield' };

    // The player's previous pick, and the CPU's previous pick. The monster
    // "studies" your last move: most rounds it plays the counter to it, betting
    // you'll repeat. A player who notices this can exploit it (play the move
    // that beats the CPU's expected counter), turning a coin flip into a real
    // mind-game. A randomness floor keeps it from being a solvable loop.
    private playerLastChoice: string = null;
    lastCpuChoice: string = null;

    // Probability the CPU counters your last move (vs. picking at random).
    private readonly COUNTER_BIAS = 0.65;

    // Best-of-3. A single round of RPS is a pure coin flip with no room for the
    // read-your-opponent skill above to matter, so the match runs until someone
    // takes 2 rounds. That both lowers variance and gives the player a couple
    // of looks at the monster's pattern to exploit.
    playerScore = 0;
    cpuScore = 0;
    readonly ROUNDS_TO_WIN = 2;

    constructor(private modalController: ModalController, private aService: AudioService) {}

    private chooseCpuMove(): string {
        // No history yet (first round) — play fair and random.
        if (this.playerLastChoice === null) {
            return this.choices[Math.floor(Math.random() * this.choices.length)];
        }
        // Mostly bet the player repeats their last move and counter it;
        // otherwise pick randomly so the pattern isn't a solvable loop.
        if (Math.random() < this.COUNTER_BIAS) {
            return this.counterTo[this.playerLastChoice];
        }
        return this.choices[Math.floor(Math.random() * this.choices.length)];
    }

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
        this.cpuChoice = this.chooseCpuMove();

        // Remember this round so the next CPU move can study it, and expose
        // the CPU's pick as a readable tell for the attentive player.
        this.playerLastChoice = choice;
        this.lastCpuChoice = this.cpuChoice;

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
            const playerLostRound =
                (this.pickedChoice === 'shield' && this.cpuChoice === 'sword') ||
                (this.pickedChoice === 'sword' && this.cpuChoice === 'bow') ||
                (this.pickedChoice === 'bow' && this.cpuChoice === 'shield');

            if (playerLostRound) {
                this.cpuScore++;
            } else {
                this.playerScore++;
            }

            // Match over once someone reaches ROUNDS_TO_WIN; otherwise set up
            // the next round and let the player pick again.
            if (this.playerScore >= this.ROUNDS_TO_WIN) {
                this.closeModal(true);
            } else if (this.cpuScore >= this.ROUNDS_TO_WIN) {
                this.closeModal(false);
            } else {
                this.pickedChoice = null;
                this.cpuChoice = null;
                this.humanTurn = true;
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
