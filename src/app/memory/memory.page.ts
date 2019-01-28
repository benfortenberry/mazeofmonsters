import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
@Component({
    selector: 'app-memory',
    templateUrl: './memory.page.html',
    styleUrls: ['./memory.page.scss']
})
export class MemoryPage implements OnInit {
    tiles = [
        { id: 0, flipped: false, img: 'url(../../assets/memory/aqua.png)', show: true },
        { id: 1, flipped: false, img: 'url(../../assets/memory/aqua.png)', show: true },
        { id: 2, flipped: false, img: 'url(../../assets/memory/red.png)', show: true },
        { id: 3, flipped: false, img: 'url(../../assets/memory/red.png)', show: true },
        { id: 4, flipped: false, img: 'url(../../assets/memory/blue.png)', show: true },
        { id: 5, flipped: false, img: 'url(../../assets/memory/blue.png)', show: true },
        { id: 6, flipped: false, img: 'url(../../assets/memory/violet.png)', show: true },
        { id: 7, flipped: false, img: 'url(../../assets/memory/violet.png)', show: true },
        { id: 8, flipped: false, img: 'url(../../assets/memory/yellow.png)', show: true },
        { id: 9, flipped: false, img: 'url(../../assets/memory/yellow.png)', show: true },
        { id: 10, flipped: false, img: 'url(../../assets/memory/green.png)', show: true },
        { id: 11, flipped: false, img: 'url(../../assets/memory/green.png)', show: true }
    ];

    img0;
    img1;
    img2;
    img3;
    img4;
    img5;
    img6;
    img7;
    img8;
    img9;
    img10;
    img11;

    guessCount = 0;
    waitFlag = false;
    correctCount = 0;
    flipCount = 0;

    guessesLeft = 12;

    guesses = [];

    clickAudio = new Audio();

    constructor(private modalController: ModalController) {
        this.clickAudio.src = '../../assets/audio/ui click 11 [2018-10-13 162315].wav';
        this.clickAudio.load();
        this.tiles = this.shuffleList(this.tiles);
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
    flip(id) {
        if (this.guesses.length < 2) {
            this.clickAudio.play();
            this.guesses.push(this.tiles[id]);

            this.tiles[id].flipped = true;

            setTimeout(() => {
                this.doImgShow(id);
            }, 300);

            if (this.guesses.length == 2) {
                if (this.guessesLeft != 1) {
                    this.guessesLeft--;
                }

                this.guessCount++;

                if (this.guesses[0].img === this.guesses[1].img) {
                    console.log('match');

                    const firstSpot = this.findWithAttr(this.tiles, 'id', this.guesses[0].id);
                    const secondSpot = this.findWithAttr(this.tiles, 'id', this.guesses[1].id);

                    setTimeout(() => {
                        this.tiles[firstSpot].show = false;
                        this.tiles[secondSpot].show = false;
                    }, 1200);

                    this.guesses = [];
                    this.waitFlag = false;
                    this.correctCount++;
                } else {
                    this.waitFlag = false;
                    setTimeout(() => {
                        this.guesses[0].flipped = false;
                        this.guesses[1].flipped = false;
                        this.guesses = [];
                    }, 1200);

                    setTimeout(() => {
                        this.img0 = '';
                        this.img1 = '';
                        this.img2 = '';
                        this.img3 = '';
                        this.img4 = '';
                        this.img5 = '';
                        this.img6 = '';
                        this.img7 = '';
                        this.img8 = '';
                        this.img9 = '';
                        this.img10 = '';
                        this.img11 = '';
                    }, 1500);

                    console.log('no match');
                }
            }

            this.checkForEnd();
        }
    }

    checkForEnd() {
        setTimeout(() => {
            if (this.correctCount === 6) {
                //alert('win');
                this.closeModal(true);
            }

            if (this.guessCount === 12 && this.correctCount !== 6) {
                // alert('ivan is a loser');
                this.closeModal(false);
            }
        }, 1000);
    }

    findWithAttr(array, attr, value) {
        for (let i = 0; i < array.length; i += 1) {
            if (array[i][attr] === value) {
                return i;
            }
        }
        return -1;
    }
    doImgShow(slot) {
        if (slot === 0) {
            this.img0 = this.tiles[slot].img;
        }
        if (slot === 1) {
            this.img1 = this.tiles[slot].img;
        }
        if (slot === 2) {
            this.img2 = this.tiles[slot].img;
        }
        if (slot === 3) {
            this.img3 = this.tiles[slot].img;
        }
        if (slot === 4) {
            this.img4 = this.tiles[slot].img;
        }
        if (slot === 5) {
            this.img5 = this.tiles[slot].img;
        }
        if (slot === 6) {
            this.img6 = this.tiles[slot].img;
        }
        if (slot === 7) {
            this.img7 = this.tiles[slot].img;
        }
        if (slot === 8) {
            this.img8 = this.tiles[slot].img;
        }
        if (slot === 9) {
            this.img9 = this.tiles[slot].img;
        }
        if (slot === 10) {
            this.img10 = this.tiles[slot].img;
        }
        if (slot === 11) {
            this.img11 = this.tiles[slot].img;
        }
    }

    ngOnInit() {}

    closeModal(status) {
        if (status == null) {
            this.clickAudio.play();
        }
        this.modalController.dismiss({ result: status });
    }
}
