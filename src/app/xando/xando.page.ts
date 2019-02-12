import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { forEach } from '@angular/router/src/utils/collection';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
@Component({
    selector: 'app-xando',
    templateUrl: './xando.page.html',
    styleUrls: ['./xando.page.scss']
})
export class XandoPage implements OnInit {
    tileList = [
        { id: 0, value: '', free: true },
        { id: 1, value: '', free: true },
        { id: 2, value: '', free: true },
        { id: 3, value: '', free: true },
        { id: 4, value: '', free: true },
        { id: 5, value: '', free: true },
        { id: 6, value: '', free: true },
        { id: 7, value: '', free: true },
        { id: 8, value: '', free: true }
    ];

    wait;

    unmarkedList = [];
    markTile(id) {
        if (!this.wait) {
            this.nativeAudio.play('clickAudio');

            this.wait = true;
            if (!this.getStatus(id)) {
                this.tileList[id].value = 'X';
                this.tileList[id].free = false;
                this.cpuMarkTile();
            }
        }
    }

    getStatus(id) {
        if (this.tileList[id].value !== '') {
            return true;
        } else {
            return false;
        }
    }

    getSymbol(id) {
        return this.tileList[id].value;
    }

    cpuMarkTile() {
        this.unmarkedList = [];
        this.tileList.forEach(e => {
            if (e.value !== 'X' && e.value !== 'O') {
                this.unmarkedList.push(e);
            }
        });

        this.checkForWinner();
        setTimeout(() => {
            if (this.unmarkedList.length) {
                // this.getBestMove();
                const cpuMove = this.figureBotMove();
                if (cpuMove !== -1) {
                    this.tileList[cpuMove - 1].value = 'O';
                    this.tileList[cpuMove - 1].free = false;
                } else {
                    if (this.unmarkedList.length) {
                        const pickedTile = this.getRandomTile(this.unmarkedList);
                        pickedTile.value = 'O';
                        pickedTile.free = false;
                    }
                }
            }

            this.checkForWinner();

            if (this.unmarkedList.length === 0) {
                this.closeModal(false);
            }

            this.wait = false;
        }, 750);
    }

    checkForWinner() {
        if (this.tileList[0].value === 'X' && this.tileList[1].value === 'X' && this.tileList[2].value === 'X') {
            this.closeModal(true);
        } else if (this.tileList[3].value === 'X' && this.tileList[4].value === 'X' && this.tileList[5].value === 'X') {
            this.closeModal(true);
        } else if (this.tileList[6].value === 'X' && this.tileList[7].value === 'X' && this.tileList[8].value === 'X') {
            this.closeModal(true);
        } else if (this.tileList[0].value === 'X' && this.tileList[3].value === 'X' && this.tileList[6].value === 'X') {
            this.closeModal(true);
        } else if (this.tileList[1].value === 'X' && this.tileList[4].value === 'X' && this.tileList[7].value === 'X') {
            this.closeModal(true);
        } else if (this.tileList[2].value === 'X' && this.tileList[5].value === 'X' && this.tileList[8].value === 'X') {
            this.closeModal(true);
        } else if (this.tileList[0].value === 'X' && this.tileList[4].value === 'X' && this.tileList[8].value === 'X') {
            this.closeModal(true);
        } else if (this.tileList[2].value === 'X' && this.tileList[4].value === 'X' && this.tileList[6].value === 'X') {
            this.closeModal(true);
        } else if (this.tileList[0].value === 'O' && this.tileList[1].value === 'O' && this.tileList[2].value === 'O') {
            this.closeModal(false);
        } else if (this.tileList[3].value === 'O' && this.tileList[4].value === 'O' && this.tileList[5].value === 'O') {
            this.closeModal(false);
        } else if (this.tileList[6].value === 'O' && this.tileList[7].value === 'O' && this.tileList[8].value === 'O') {
            this.closeModal(false);
        } else if (this.tileList[0].value === 'O' && this.tileList[3].value === 'O' && this.tileList[6].value === 'O') {
            this.closeModal(false);
        } else if (this.tileList[1].value === 'O' && this.tileList[4].value === 'O' && this.tileList[7].value === 'O') {
            this.closeModal(false);
        } else if (this.tileList[2].value === 'O' && this.tileList[5].value === 'O' && this.tileList[8].value === 'O') {
            this.closeModal(false);
        } else if (this.tileList[0].value === 'O' && this.tileList[4].value === 'O' && this.tileList[8].value === 'O') {
            this.closeModal(false);
        } else if (this.tileList[2].value === 'O' && this.tileList[4].value === 'O' && this.tileList[6].value === 'O') {
            this.closeModal(false);
        }
    }

    getRandomTile(tileList) {
        return tileList[Math.floor(Math.random() * tileList.length)];
    }

    constructor(private modalController: ModalController, private nativeAudio: NativeAudio) {
    }
    ngOnInit() {}

    closeModal(status) {
        if (status == null) {
            this.nativeAudio.play('clickAudio');
        }
        // alert('win?' + status);
        this.modalController.dismiss({ result: status });
    }

    isX(id) {
        if (this.tileList[id].value === 'X') {
            return true;
        } else {
            return false;
        }
    }

    isO(id) {
        if (this.tileList[id].value === 'O') {
            return true;
        } else {
            return false;
        }
    }

    figureBotMove() {
        // Priortize by checking block that is completing
        let bot_move = this.GetCompletingSet();

        if (bot_move > 0) {
            return bot_move;
        }

        // 2nd Priority Block enemy from completing Set
        bot_move = this.blockEnemyAttemptCompleteSet();

        if (bot_move > 0) {
            return bot_move;
        }
        return -1;
    }
    blockEnemyAttemptCompleteSet() {
        const block1 = this.tileList[0];
        const block2 = this.tileList[1];
        const block3 = this.tileList[2];

        const block4 = this.tileList[3];
        const block5 = this.tileList[4];
        const block6 = this.tileList[5];

        const block7 = this.tileList[6];
        const block8 = this.tileList[7];
        const block9 = this.tileList[8];

        // Block#1
        if (block1.free === false && block2.free === true && block3.free === false && block1.value === block3.value) {
            return 2;
        } else if (
            block1.free === false &&
            block2.free === false &&
            block3.free === true &&
            block1.value === block2.value
        ) {
            return 3;
        } else if (
            block1.free === false &&
            block4.free === true &&
            block7.free === false &&
            block1.value === block7.value
        ) {
            return 4;
        } else if (
            block1.free === false &&
            block4.free === false &&
            block7.free === true &&
            block1.value === block4.value
        ) {
            return 7;
        } else if (
            block1.free === false &&
            block5.free === true &&
            block9.free === false &&
            block1.value === block9.value
        ) {
            return 5;
        } else if (
            block1.free === false &&
            block5.free === false &&
            block9.free === true &&
            block1.value === block5.value
        ) {
            return 9;

            // Block#2
        } else if (
            block2.free === false &&
            block3.free === false &&
            block1.free === true &&
            block2.value === block3.value
        ) {
            return 1;
        } else if (
            block2.free === false &&
            block8.free === false &&
            block5.free === true &&
            block2.value === block8.value
        ) {
            return 5;
        } else if (
            block2.free === false &&
            block8.free === true &&
            block5.free === false &&
            block2.value === block5.value
        ) {
            return 8;

            // Block#3
        } else if (
            block3.free === false &&
            block6.free === true &&
            block9.free === false &&
            block3.value === block9.value
        ) {
            return 6;
        } else if (
            block3.free === false &&
            block9.free === true &&
            block6.free === false &&
            block3.value === block6.value
        ) {
            return 9;
        } else if (
            block3.free === false &&
            block5.free === true &&
            block7.free === false &&
            block3.value === block7.value
        ) {
            return 5;
        } else if (
            block3.free === false &&
            block7.free === true &&
            block5.free === false &&
            block3.value === block5.value
        ) {
            return 7;

            // Block#4
        } else if (
            block4.free === false &&
            block5.free === true &&
            block6.free === false &&
            block4.value === block6.value
        ) {
            return 5;
        } else if (
            block4.free === false &&
            block6.free === true &&
            block5.free === false &&
            block4.value === block5.value
        ) {
            return 6;

            // Block#5
        } else if (
            block5.free === false &&
            block4.free === true &&
            block6.free === false &&
            block5.value === block6.value
        ) {
            return 4;

            // Block#7
        } else if (
            block7.free === false &&
            block8.free === true &&
            block9.free === false &&
            block7.value === block9.value
        ) {
            return 8;
        } else if (
            block7.free === false &&
            block9.free === true &&
            block8.free === false &&
            block7.value === block8.value
        ) {
            return 9;

            // Block#8
        } else if (
            block8.free === false &&
            block7.free === true &&
            block9.free === false &&
            block8.value === block9.value
        ) {
            return 7;
        } else {
            // If none is applicable
            return 0;
        }
    }

    GetCompletingSet() {
        const block1 = this.tileList[0];
        const block2 = this.tileList[1];
        const block3 = this.tileList[2];

        const block4 = this.tileList[3];
        const block5 = this.tileList[4];
        const block6 = this.tileList[5];

        const block7 = this.tileList[6];
        const block8 = this.tileList[7];
        const block9 = this.tileList[8];

        // Block#1
        if (
            block1.free === false &&
            block2.free === true &&
            block3.free === false &&
            (block1.value === 'O' && block1.value === block3.value)
        ) {
            return 2;
        } else if (
            block1.free === false &&
            block2.free === false &&
            block3.free === true &&
            (block1.value === 'O' && block1.value === block2.value)
        ) {
            return 3;
        } else if (
            block1.free === false &&
            block4.free === true &&
            block7.free === false &&
            (block1.value === 'O' && block1.value === block7.value)
        ) {
            return 4;
        } else if (
            block1.free === false &&
            block4.free === false &&
            block7.free === true &&
            (block1.value === 'O' && block1.value === block4.value)
        ) {
            return 7;
        } else if (
            block1.free === false &&
            block5.free === true &&
            block9.free === false &&
            (block1.value === 'O' && block1.value === block9.value)
        ) {
            return 5;
        } else if (
            block1.free === false &&
            block5.free === false &&
            block9.free === true &&
            (block1.value === 'O' && block1.value === block5.value)
        ) {
            return 9;

            // Block#2
        } else if (
            block2.free === false &&
            block3.free === false &&
            block1.free === true &&
            (block2.value === 'O' && block2.value === block3.value)
        ) {
            return 1;
        } else if (
            block2.free === false &&
            block8.free === false &&
            block5.free === true &&
            (block2.value === 'O' && block2.value === block8.value)
        ) {
            return 5;
        } else if (
            block2.free === false &&
            block8.free === true &&
            block5.free === false &&
            (block2.value === 'O' && block2.value === block5.value)
        ) {
            return 8;

            // Block#3
        } else if (
            block3.free === false &&
            block6.free === true &&
            block9.free === false &&
            (block3.value === 'O' && block3.value === block9.value)
        ) {
            return 6;
        } else if (
            block3.free === false &&
            block9.free === true &&
            block6.free === false &&
            (block3.value === 'O' && block3.value === block6.value)
        ) {
            return 9;
        } else if (
            block3.free === false &&
            block5.free === true &&
            block7.free === false &&
            (block3.value === 'O' && block3.value === block7.value)
        ) {
            return 5;
        } else if (
            block3.free === false &&
            block7.free === true &&
            block5.free === false &&
            (block3.value === 'O' && block3.value === block5.value)
        ) {
            return 7;

            // Block#4
        } else if (
            block4.free === false &&
            block5.free === true &&
            block6.free === false &&
            (block4.value === 'O' && block4.value === block6.value)
        ) {
            return 5;
        } else if (
            block4.free === false &&
            block6.free === true &&
            block5.free === false &&
            (block4.value === 'O' && block4.value === block5.value)
        ) {
            return 6;

            // Block#5
        } else if (
            block5.free === false &&
            block4.free === true &&
            block6.free === false &&
            (block5.value === 'O' && block5.value === block6.value)
        ) {
            return 4;

            // Block#7
        } else if (
            block7.free === false &&
            block8.free === true &&
            block9.free === false &&
            (block7.value === 'O' && block7.value === block9.value)
        ) {
            return 8;
        } else if (
            block7.free === false &&
            block9.free === true &&
            block8.free === false &&
            (block7.value === 'O' && block7.value === block8.value)
        ) {
            return 9;

            // Block#8
        } else if (
            block8.free === false &&
            block7.free === true &&
            block9.free === false &&
            (block8.value === 'O' && block8.value === block9.value)
        ) {
            return 7;
        } else {
            // If none is applicable
            return 0;
        }
    }
}
