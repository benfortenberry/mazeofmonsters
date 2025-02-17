import { Component, OnInit } from '@angular/core';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { NavParams, ModalController } from '@ionic/angular';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
@Component({
    selector: 'app-eyeball',
    templateUrl: './eyeball.page.html',
    animations: [
        trigger('my1stAnimation', [
            transition(
                '* => 100',
                animate(
                    '1s linear',
                    keyframes([style({ transform: 'translateX(0)' }), style({ transform: 'translateX(100%)' })])
                )
            ),
            transition(
                '* => 200',
                animate(
                    '1s linear',
                    keyframes([style({ transform: 'rotateY(180deg)' }), style({ transform: 'translateX(200%)' })])
                )
            ),
            transition(
                '* => 300',
                animate(
                    '1s linear',
                    keyframes([style({ transform: 'translateX(0)' }), style({ transform: 'translateX(300%)' })])
                )
            ),
            transition(
                '* => -100',
                animate(
                    '1s linear',
                    keyframes([style({ transform: 'translateX(0)' }), style({ transform: 'translateX(-100%)' })])
                )
            ),
            transition(
                '* => -200',
                animate(
                    '1s linear',
                    keyframes([style({ transform: 'translateX(0)' }), style({ transform: 'translateX(-200%)' })])
                )
            ),
            transition(
                '* => -300',
                animate(
                    '1s linear',
                    keyframes([style({ transform: 'translateX(0)' }), style({ transform: 'translateX(-300%)' })])
                )
            )
        ]),
        trigger('my2ndAnimation', [
            transition(
                '* => 100',
                animate(
                    '1s linear',
                    keyframes([style({ transform: 'translateX(0)' }), style({ transform: 'translateX(100%)' })])
                )
            ),
            transition(
                '* => 200',
                animate(
                    '1s linear',
                    keyframes([style({ transform: 'translateX(0)' }), style({ transform: 'translateX(200%)' })])
                )
            ),
            transition(
                '* => 300',
                animate(
                    '1s linear',
                    keyframes([style({ transform: 'translateX(0)' }), style({ transform: 'translateX(300%)' })])
                )
            ),
            transition(
                '* => -100',
                animate(
                    '1s linear',
                    keyframes([style({ transform: 'translateX(0)' }), style({ transform: 'translateX(-100%)' })])
                )
            ),
            transition(
                '* => -200',
                animate(
                    '1s linear',
                    keyframes([style({ transform: 'translateX(0)' }), style({ transform: 'translateX(-200%)' })])
                )
            ),
            transition(
                '* => -300',
                animate(
                    '1s linear',
                    keyframes([style({ transform: 'translateX(0)' }), style({ transform: 'translateX(-300%)' })])
                )
            )
        ]),
        trigger('my3rdAnimation', [
            transition(
                '* => 100',
                animate(
                    '1s linear',
                    keyframes([style({ transform: 'translateX(0)' }), style({ transform: 'translateX(100%)' })])
                )
            ),
            transition(
                '* => 200',
                animate(
                    '1s linear',
                    keyframes([style({ transform: 'translateX(0)' }), style({ transform: 'translateX(200%)' })])
                )
            ),
            transition(
                '* => 300',
                animate(
                    '1s linear',
                    keyframes([style({ transform: 'translateX(0)' }), style({ transform: 'translateX(300%)' })])
                )
            ),
            transition(
                '* => -100',
                animate(
                    '1s linear',
                    keyframes([style({ transform: 'translateX(0)' }), style({ transform: 'translateX(-100%)' })])
                )
            ),
            transition(
                '* => -200',
                animate(
                    '1s linear',
                    keyframes([style({ transform: 'translateX(0)' }), style({ transform: 'translateX(-200%)' })])
                )
            ),
            transition(
                '* => -300',
                animate(
                    '1s linear',
                    keyframes([style({ transform: 'translateX(0)' }), style({ transform: 'translateX(-300%)' })])
                )
            )
        ]),
        trigger('my4thAnimation', [
            transition(
                '* => 100',
                animate(
                    '1s linear',
                    keyframes([style({ transform: 'translateX(0)' }), style({ transform: 'translateX(100%)' })])
                )
            ),
            transition(
                '* => 200',
                animate(
                    '1s linear',
                    keyframes([style({ transform: 'translateX(0)' }), style({ transform: 'translateX(200%)' })])
                )
            ),
            transition(
                '* => 300',
                animate(
                    '1s linear',
                    keyframes([style({ transform: 'translateX(0)' }), style({ transform: 'translateX(300%)' })])
                )
            ),
            transition(
                '* => -100',
                animate(
                    '1s linear',
                    keyframes([style({ transform: 'translateX(0)' }), style({ transform: 'translateX(-100%)' })])
                )
            ),
            transition(
                '* => -200',
                animate(
                    '1s linear',
                    keyframes([style({ transform: 'translateX(0)' }), style({ transform: 'translateX(-200%)' })])
                )
            ),
            transition(
                '* => -300',
                animate(
                    '1s linear',
                    keyframes([style({ transform: 'translateX(0)' }), style({ transform: 'translateX(-300%)' })])
                )
            )
        ])
    ],
    styleUrls: ['./eyeball.page.scss']
})
export class EyeballPage implements OnInit {
    rightAnswer;
    oneSlot = 0;
    twoSlot = 1;
    threeSlot = 2;
    fourSlot = 3;
    firstTime = true;
    shuffleCount = 0;
    gameStart = false;
    flipped = false;
    closed;

    possibleAnswers = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }];
    animationAnswers = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }];
    lastAnswers = [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }];

    // woopAudio = new Audio();

    constructor(private modalController: ModalController, private nativeAudio: NativeAudio) {
        this.rightAnswer = Math.floor(Math.random() * this.possibleAnswers.length);
        this.possibleAnswers[this.rightAnswer]['answer'] = true;

        setTimeout(() => {
            this.flipped = true;
        }, 1600);

        setTimeout(() => {
            this.shuffleCount++;
            this.gameStart = true;
        }, 1800);

        setTimeout(() => {
            if (!this.closed) {
                this.shuffle();

                this.nativeAudio.play('woopAudio');
            }
        }, 3000);

        setTimeout(() => {
            if (!this.closed) {
                this.shuffle();
                this.nativeAudio.play('woopAudio');
                this.shuffleCount++;
            }
        }, 5000);

        setTimeout(() => {
            if (!this.closed) {
                this.shuffle();
                this.nativeAudio.play('woopAudio');
                this.shuffleCount++;
            }
        }, 7000);

        setTimeout(() => {
            if (!this.closed) {
                this.shuffle();
                this.nativeAudio.play('woopAudio');
                this.shuffleCount++;
            }
        }, 9000);

        setTimeout(() => {
            if (!this.closed) {
                this.shuffle();
                this.nativeAudio.play('woopAudio');
                this.shuffleCount++;
            }
        }, 11000);
    }

    diffs = [];

    closeModal(status) {
        this.closed = true;
        if (status == null) {
            this.nativeAudio.play('clickAudio');
        }

        this.modalController.dismiss({ result: status });
    }

    guessShell(id) {
        if (this.shuffleCount === 5) {
            this.nativeAudio.play('clickAudio');

            this.flipped = false;
            setTimeout(() => {
                this.gameStart = false;
            }, 500);

            setTimeout(() => {
                if (this.possibleAnswers[id].id === this.rightAnswer) {
                    this.closeModal(true);
                } else {
                    this.closeModal(false);
                }
            }, 2000);
        }
    }

    getAniClass(slot) {
        return 'content' + (this.animationAnswers[slot].id + 1);
    }

    diff(a, b) {
        return Math.abs(a - b);
    }

    shuffleList(a) {
        let j, x, i;
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }

    shuffle() {
        this.firstTime = false;

        const cloned = this.possibleAnswers.map(x => Object.assign({}, x));
        this.lastAnswers = cloned;
        this.possibleAnswers = this.shuffleList(this.possibleAnswers);

        if (JSON.stringify(cloned) === JSON.stringify(this.possibleAnswers)) {
            this.possibleAnswers = this.shuffleList(this.possibleAnswers);
        }

        const newSlotOne = this.findWithAttr(this.possibleAnswers, 'id', 0);
        const oldSlotOne = this.findWithAttr(cloned, 'id', 0);

        const diffOne = newSlotOne - oldSlotOne;

        if (oldSlotOne === 0) {
            this.oneSlot = diffOne * 100;
        } else if (oldSlotOne === 1) {
            this.twoSlot = diffOne * 100;
        } else if (oldSlotOne === 2) {
            this.threeSlot = diffOne * 100;
        } else {
            this.fourSlot = diffOne * 100;
        }

        const newSlotTwo = this.findWithAttr(this.possibleAnswers, 'id', 1);
        const oldSlotTwo = this.findWithAttr(cloned, 'id', 1);

        const diffTwo = newSlotTwo - oldSlotTwo;

        if (oldSlotTwo === 0) {
            this.oneSlot = diffTwo * 100;
        } else if (oldSlotTwo === 1) {
            this.twoSlot = diffTwo * 100;
        } else if (oldSlotTwo === 2) {
            this.threeSlot = diffTwo * 100;
        } else {
            this.fourSlot = diffTwo * 100;
        }

        const newSlotThree = this.findWithAttr(this.possibleAnswers, 'id', 2);
        const oldSlotThree = this.findWithAttr(cloned, 'id', 2);

        const diffThree = newSlotThree - oldSlotThree;

        if (oldSlotThree === 0) {
            this.oneSlot = diffThree * 100;
        } else if (oldSlotThree === 1) {
            this.twoSlot = diffThree * 100;
        } else if (oldSlotThree === 2) {
            this.threeSlot = diffThree * 100;
        } else {
            this.fourSlot = diffThree * 100;
        }

        const newSlotFour = this.findWithAttr(this.possibleAnswers, 'id', 3);
        const oldSlotFour = this.findWithAttr(cloned, 'id', 3);

        const diffFour = newSlotFour - oldSlotFour;

        if (oldSlotFour === 0) {
            this.oneSlot = diffFour * 100;
        } else if (oldSlotFour === 1) {
            this.twoSlot = diffFour * 100;
        } else if (oldSlotFour === 2) {
            this.threeSlot = diffFour * 100;
        } else {
            this.fourSlot = diffFour * 100;
        }
    }

    findWithAttr(array, attr, value) {
        for (let i = 0; i < array.length; i += 1) {
            if (array[i][attr] === value) {
                return i;
            }
        }
        return -1;
    }

    onAnimationEvent(event) {
        this.oneSlot = 0;
        this.twoSlot = 0;
        this.threeSlot = 0;
        this.fourSlot = 0;

        this.animationAnswers = this.possibleAnswers;
    }

    ngOnInit() {}
}
