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
    resolved = false;

    // Best-of-3: first to two round wins takes the match. A single round of RPS
    // is a coin flip; best-of-3 lowers variance so a win feels earned rather
    // than lucky. The CPU plays randomly (fair 50/50 each round).
    playerScore = 0;
    cpuScore = 0;
    readonly ROUNDS_TO_WIN = 2;

    // Result of the round just resolved, shown briefly to the player:
    // 'win' | 'lose' | 'tie' | null.
    roundResult: string = null;

    constructor(private modalController: ModalController, private aService: AudioService) {}

    private chooseCpuMove(): string {
        return this.choices[Math.floor(Math.random() * this.choices.length)];
    }

    // Returns 'win' | 'lose' | 'tie' for the player, given both picks.
    // shield beats bow, bow beats sword, sword beats shield.
    private outcome(player: string, cpu: string): string {
        if (player === cpu) {
            return 'tie';
        }
        const beats = { shield: 'bow', bow: 'sword', sword: 'shield' };
        return beats[player] === cpu ? 'win' : 'lose';
    }

    makeChoice(choice) {
        // Ignore clicks while a round is resolving (humanTurn is false during
        // the reveal). Without this, rapid clicks start overlapping rounds
        // and can fire closeModal/dismiss more than once.
        if (!this.humanTurn) {
            return;
        }
        this.aService.play('clickAudio');
        this.pickedChoice = choice;
        this.humanTurn = false;
        this.cpuChoice = this.chooseCpuMove();

        setTimeout(() => {
            const result = this.outcome(this.pickedChoice, this.cpuChoice);
            this.roundResult = result;

            if (result === 'tie') {
                // A tie doesn't score; sound a neutral beat and replay.
                this.aService.play('beepAudio');
                setTimeout(() => this.nextRound(), 900);
                return;
            }

            // Score the round and give immediate audio feedback.
            if (result === 'win') {
                this.playerScore++;
                this.aService.play('matchAudio');
            } else {
                this.cpuScore++;
                this.aService.play('woopAudio');
            }

            // Match over once someone reaches ROUNDS_TO_WIN; otherwise set up
            // the next round after a short beat so the result is readable.
            if (this.playerScore >= this.ROUNDS_TO_WIN) {
                setTimeout(() => this.closeModal(true), 700);
            } else if (this.cpuScore >= this.ROUNDS_TO_WIN) {
                setTimeout(() => this.closeModal(false), 700);
            } else {
                setTimeout(() => this.nextRound(), 900);
            }
        }, 700);
    }

    private nextRound() {
        this.pickedChoice = null;
        this.cpuChoice = null;
        this.roundResult = null;
        this.humanTurn = true;
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
