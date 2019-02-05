import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
@Component({
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

    constructor(private modalController: ModalController, private nativeAudio: NativeAudio) {
        this.nativeAudio.preloadSimple('clickAudio', '../../assets/audio/ui click 11 [2018-10-13 162315].wav');
    }

    makeChoice(choice) {
        this.nativeAudio.play('clickAudio');
        this.pickedChoice = choice;
        this.humanTurn = false;
        this.cpuChoice = this.choices[Math.floor(Math.random() * this.choices.length)];

        setTimeout(() => {
            if (this.cpuChoice === this.pickedChoice) {
                this.pickedChoice = null;
                this.cpuChoice = null;
                this.humanTurn = true;
                this.goAgain = true;

                setTimeout(() => {
                    this.goAgain = false;
                }, 1000);
            }

            if (this.pickedChoice === 'shield' && this.cpuChoice === 'sword') {
                this.closeModal(false);
            }

            if (this.pickedChoice === 'sword' && this.cpuChoice === 'bow') {
                this.closeModal(false);
            }

            if (this.pickedChoice === 'bow' && this.cpuChoice === 'shield') {
                this.closeModal(false);
            }

            if (this.cpuChoice === 'shield' && this.pickedChoice === 'sword') {
                this.closeModal(true);
            }

            if (this.cpuChoice === 'sword' && this.pickedChoice === 'bow') {
                this.closeModal(true);
            }

            if (this.cpuChoice === 'bow' && this.pickedChoice === 'shield') {
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
        if (status == null) {
            this.nativeAudio.play('clickAudio');
        }
        // console.log('win', status);
        this.modalController.dismiss({ result: status });
    }

    ngOnInit() {}
}
