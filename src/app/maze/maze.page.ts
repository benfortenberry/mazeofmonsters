import { Component, HostListener } from '@angular/core';
import { MazeProvider } from '../..//providers/maze-service';
import { AlertController, NavController, IonRouterOutlet } from '@ionic/angular';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';

import { CountdownService } from '../../providers/countdown-service';
import { ModalController } from '@ionic/angular';
import { MapPage } from '../map/map.page';
import { SsbPage } from '../ssb/ssb.page';
import { GemPage } from '../gems/gems.page';
import { OrbPage } from '../orb/orb';
import { XandoPage } from '../xando/xando.page';
import { EyeballPage } from '../eyeball/eyeball.page';
import { ToastController } from '@ionic/angular';

@Component({
    selector: 'app-maze',
    templateUrl: 'maze.page.html',
    animations: [
        trigger('myAwesomeAnimation', [
            state(
                'back',
                style({
                    // transform: 'scale(1)'
                })
            ),
            state(
                'f',
                style({
                    // backgroundPosition: '5000px'
                    // transform: 'scale(1.2)'
                })
            ),
            state(
                'l',
                style({
                    // transform: 'scale(1.2)'
                })
            ),
            state(
                'r',
                style({
                    // transform: 'scale(1.2)'
                })
            ),
            transition('* => f', animate('500ms linear', keyframes([style({ transform: 'scale(1.75)' })]))),
            transition(
                '* => l',
                animate(
                    '500ms linear',
                    keyframes([
                        style({ transform: 'translateX(0)' }),
                        style({ transform: 'translateX(25%)' }),
                        style({ transform: 'translateX(50%)' }),
                        style({ transform: 'translateX(75%)' })
                    ])
                )
            ),
            transition(
                '* => r',
                animate(
                    '500ms linear',
                    keyframes([
                        style({ transform: 'translateX(0)' }),
                        style({ transform: 'translateX(-25%)' }),
                        style({ transform: 'translateX(-50%)' }),
                        style({ transform: 'translateX(-75%)' })
                    ])
                )
            ),
            transition(
                '* => back',
                animate(
                    '500ms linear',
                    keyframes([
                        style({ transform: 'translateX(0)' }),
                        style({ transform: 'translateX(-105%)' }),
                        style({ transform: 'translateX(-200%)' }),
                        style({ transform: 'translateX(-305%)' }),
                        style({ transform: 'translateX(-400%)' }),
                        style({ transform: 'translateX(-100%)' }),
                        style({ transform: 'translateX(-75%)' }),
                        style({ transform: 'translateX(-50%)' }),
                        style({ transform: 'translateX(-25%)' }),
                        style({ transform: 'translateX(0)' })
                    ])
                )
            )
        ])
    ],
    styleUrls: ['maze.page.scss']
})
export class MazePage {
    routeId = 0;
    currentRoute = {};
    currentRoom;
    routes;
    routeHistory = [];
    hasLeft: Boolean = false;
    hasRight: Boolean = false;
    hasForward: Boolean = false;
    hasBottom: Boolean = false;
    wallReady;
    state: String = 'small';
    currentDirection = 's';
    monsterPresent = false;
    monsterCoolDown = 400;
    monsterQuotes = [];
    wallClass;
    monsterImageUrl;
    monsterImageList;
    alerts = [];
    modals = [];
    timerM = 600;
    currentX = 0;
    currentY = 0;
    mazeData;
    mazeTimer;
    timerSub;

    backgroundAudio = new Audio();

    clickAudio = new Audio();

    winAudio = new Audio();

    loseAudio = new Audio();

    monsterAudio = new Audio();

    timeLeft;

    constructor(
        public mazeProvider: MazeProvider,
        public navCtrl: NavController,
        public rtCtrl: IonRouterOutlet,
        public alertController: AlertController,
        public modalController: ModalController,
        public toastController: ToastController,
        public countdownService: CountdownService
    ) {
        this.generate();
        this.currentRoom = '0-0';
        // this.getQuotes();
        this.getImages();
        this.wallClass = 'sandstone';

        // this.nativeAudio.preloadSimple('uniqueId1', 'path/to/file.mp3');

        this.backgroundAudio.src = '../../assets/audio/theme.ogg';
        this.backgroundAudio.load();
        this.backgroundAudio.volume = 0.1;
        this.backgroundAudio.play();
        this.backgroundAudio.loop = true;

        this.winAudio.src = '../../assets/audio/win sound 2-3.wav';
        this.backgroundAudio.volume = 0.1;
        this.winAudio.load();

        this.loseAudio.src = '../../assets/audio/lose sound 1-2.wav';
        this.backgroundAudio.volume = 0.1;
        this.loseAudio.load();

        this.clickAudio.src = '../../assets/audio/ui click 11 [2018-10-13 162315].wav';

        this.clickAudio.load();
    }

    ionViewDidEnter() {
        this.countdownService.start(600);

        this.countdownService.countdown().subscribe(t => (this.timeLeft = t));

        // if (this.timerSub) {
        //     this.timerSub.unsubscribe();
        // }
        // this.timerSub = Observable.timer(60 * 60 * 1000)
        //     .take(1)
        //     .subscribe(this.showPopup.bind(this));
        // let minutes;
        // let seconds;
        // this.mazeTimer = interval(1000).subscribe(x => {
        //     minutes = Math.floor(this.timerM / 60);
        //     seconds = Math.floor(this.timerM % 60);
        //     minutes = minutes < 10 ? '0' + minutes : minutes;
        //     seconds = seconds < 10 ? '0' + seconds : seconds;
        //     // console.log(minutes + ':' + seconds);
        //     --this.timerM;
        //     if (--this.timerM < 0) {
        //         this.showDeath();
        //         // console.log('timeup');
        //     }
        // });
    }

    async getImages() {
        this.mazeProvider.getImages().then(response => {
            this.monsterImageList = response['monsters'];
        });
    }

    updateWalls() {
        // console.log(this.currentRoute['id']);
        const routeId = this.currentRoute['id'];
    }

    async showWin() {
        this.navCtrl.navigateForward('win');
    }

    async showDeath() {
        this.clearAlerts();
        this.clearModals();

        this.mazeTimer = null;

        this.navCtrl.navigateForward('death');
    }

    async onAnimationEvent(hey) {
        this.state = null;

        if (this.monsterCoolDown === 0) {
            this.monsterCoolDown = 400;
            await this.getMonster();
            this.monsterPresent = true;
        } else {
            this.monsterCoolDown = this.monsterCoolDown - 25;
        }

        this.wallReady = true;
    }

    async launchMiniGame() {
        // this.backgroundAudio.pause();
        // console.log('launch mini game');
        // list of mini games

        const miniGames = ['xando', 'ssb', 'orb', 'eyeball', 'gems'];

        // get a random game
        const selectedMinigame = miniGames[Math.floor(Math.random() * miniGames.length)];

        if (selectedMinigame === 'ssb') {
            const modal = await this.modalController.create({
                component: SsbPage,
                backdropDismiss: false,
                componentProps: {}
            });

            this.modals.push(modal);

            await modal.present();

            const { data } = await modal.onDidDismiss();
            // console.log(data);

            // this.backgroundAudio.play();

            if (data.result === true) {
                this.showWinMiniGame();
            } else {
                this.showLostMiniGame();
            }
        }

        if (selectedMinigame === 'orb') {
            const modal = await this.modalController.create({
                component: OrbPage,
                backdropDismiss: false,
                componentProps: {}
            });

            this.modals.push(modal);

            await modal.present();

            const { data } = await modal.onDidDismiss();
            // console.log(data);

            // this.backgroundAudio.play();

            if (data.result === true) {
                this.showWinMiniGame();
            } else {
                this.showLostMiniGame();
            }
        }

        if (selectedMinigame === 'gems') {
            const modal = await this.modalController.create({
                component: GemPage,
                backdropDismiss: false,
                componentProps: {}
            });

            this.modals.push(modal);

            await modal.present();

            const { data } = await modal.onDidDismiss();
            // console.log(data);

            // this.backgroundAudio.play();

            if (data.result === true) {
                this.showWinMiniGame();
            } else {
                this.showLostMiniGame();
            }
        }

        if (selectedMinigame === 'eyeball') {
            const modal = await this.modalController.create({
                component: EyeballPage,
                backdropDismiss: false,
                componentProps: {}
            });

            this.modals.push(modal);

            await modal.present();

            const { data } = await modal.onDidDismiss();
            // console.log(data);

            // this.backgroundAudio.play();

            if (data.result === true) {
                this.showWinMiniGame();
            } else {
                this.showLostMiniGame();
            }
        }

        if (selectedMinigame === 'xando') {
            const modal = await this.modalController.create({
                component: XandoPage,
                backdropDismiss: false,
                componentProps: {}
            });

            this.modals.push(modal);

            await modal.present();

            const { data } = await modal.onDidDismiss();
            // console.log(data);

            // this.backgroundAudio.play();

            if (data.result === true) {
                this.showWinMiniGame();
            } else {
                this.showLostMiniGame();
            }
        }
    }

    addRoomsToMap() {
        // start a counter at 5
        let roomCount = 0;

        // console.log(this.routes);

        for (roomCount; roomCount < 6; roomCount++) {
            const randRow = this.routes[Math.floor(Math.random() * this.routes.length)];

            // console.log(randRow);
            this.routeHistory.push(randRow.id);
            // pick a random 'row'
            //  let
            // pick a random 'cell
            // add to route history
        }
    }

    async showWinMiniGame() {
        const alert = await this.alertController.create({
            // header: 'Squirtle Says',

            // tslint:disable-next-line:quotemark
            message: "You won! I'll add rooms to your map.",
            buttons: [
                {
                    text: 'OK',
                    handler: () => {
                        this.monsterPresent = false;
                        // add five rooms to map
                        this.addRoomsToMap();
                    }
                }
            ]
        });

        // setTimeout(() => {
        this.alerts.push(alert);
        alert.present();
        this.winAudio.play();
        // }, 1000);
    }

    async showLostMiniGame() {
        // this.loseAudio.play();
        const alert = await this.alertController.create({
            // header: 'Squirtle Says',

            // tslint:disable-next-line:quotemark
            message: "Too bad... I can't add any rooms to your map.",
            buttons: [
                {
                    text: 'OK',
                    handler: () => {
                        this.monsterPresent = false;
                        // add five rooms to map
                    }
                }
            ]
        });

        // setTimeout(() => {
        this.alerts.push(alert);
        alert.present();
        // }, 1000);
    }

    async getMonster() {
        const selectedMonster = Math.floor(Math.random() * this.monsterImageList.length);
        this.monsterImageUrl = '../../assets/monsters/' + this.monsterImageList[selectedMonster].img;

        this.monsterAudio.src = this.monsterImageList[selectedMonster].audio;
        this.monsterAudio.load();
        this.monsterAudio.volume = 0.1;
        this.monsterAudio.play();

        const alert = await this.alertController.create({
            // header: 'Squirtle Says',

            message: 'Would you like some help?',
            buttons: [
                {
                    text: 'Yes',
                    handler: () => {
                        //

                        // pause timer

                        this.launchMiniGame();
                    }
                },
                {
                    text: 'No',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        this.monsterPresent = false;
                        this.monsterCoolDown = 800;
                        //  console.log('Confirm Cancel');
                    }
                }
            ]
        });

        // const toast = await this.toastController.create({
        //     message: 'Would you like some help?',
        //     showCloseButton: true,
        //     translucent: true,
        //     position: 'middle',
        //     closeButtonText: 'Yes'
        // });
        // await toast.present();
        // console.log(this.monsterImageUrl);
        setTimeout(() => {
            this.alerts.push(alert);
            alert.present();
        }, 1000);
    }

    clearAlerts() {
        if (this.alerts.length) {
            this.alerts.forEach(e => {
                e.dismiss();
            });
        }
        this.alerts = [];
    }

    clearModals() {
        if (this.modals.length) {
            this.modals.forEach(e => {
                e.dismiss();
            });
        }
        this.modals = [];
    }

    onKey(event: any) {
        // without type info
        // console.log(event.keycode);
    }

    generate() {
        // console.log('generate');
        this.currentRoom = '0-0';
        this.routes = [];
        const disp = this.newMaze(40, 40);
        // console.log(disp);
        this.mazeData = disp;
        // console.log(this.mazeData);
        // console.log(disp);
        // console.log(disp.length);
        for (let i = 0; i < disp.length; i++) {
            // this.htmlToAdd = this.htmlToAdd + '<tr>';
            // $('#maze > tbody').append("<tr>");
            for (let j = 0; j < disp[i].length; j++) {
                const routeId = i + '-' + j;

                const routeObj = { id: routeId, direction: this.currentDirection };

                // console.log('2nd for');
                // const selector = i + '-' + j;
                // this.htmlToAdd = this.htmlToAdd + '<td style="height:20px; width:20px;';
                // $('#maze > tbody').append("<td id='" + selector + "'>&nbsp;</td>");
                if (disp[i][j][0] === 0) {
                    routeObj['wallTop'] = true;
                    // this.htmlToAdd = this.htmlToAdd + 'border-top:solid 2px black;';
                } else {
                    routeObj['wallTop'] = false;
                }
                if (disp[i][j][1] === 0) {
                    routeObj['wallRight'] = true;
                    // this.htmlToAdd = this.htmlToAdd + 'border-right:solid 2px black;';
                } else {
                    routeObj['wallRight'] = false;
                }
                if (disp[i][j][2] === 0) {
                    routeObj['wallBottom'] = true;
                    // this.htmlToAdd = this.htmlToAdd + 'border-bottom:solid 2px black;';
                } else {
                    routeObj['wallBottom'] = false;
                }
                if (disp[i][j][3] === 0) {
                    routeObj['wallLeft'] = true;
                    // this.htmlToAdd = this.htmlToAdd + 'border-left:solid';
                } else {
                    routeObj['wallLeft'] = false;
                }

                let wallCount = 0;

                if (routeObj['wallTop']) {
                    wallCount++;
                }
                if (routeObj['wallLeft']) {
                    wallCount++;
                }
                if (routeObj['wallRight']) {
                    wallCount++;
                }
                if (routeObj['wallBottom']) {
                    wallCount++;
                }

                if (wallCount === 3) {
                    routeObj['monster'] = true;
                }

                this.routes.push(routeObj);
            }
        }

        // console.log(this.routes);
        this.getRoute('0-0');
    }

    getRoute(routeId) {
        if (this.routeHistory.length === 0) {
            this.routeHistory.push('39-39');
        }
        this.routeHistory.push(routeId);

        if (routeId === '39-39') {
            this.showWin();
        } else {
            this.currentRoute = this.routes.find(x => x.id === routeId);
            // console.log(this.currentRoute);
            let hasForward, hasBottom, hasLeft, hasRight;

            if (this.currentDirection === 'n') {
                hasForward = !this.currentRoute['wallTop'];
                hasRight = !this.currentRoute['wallRight'];
                hasBottom = !this.currentRoute['wallBottom'];
                hasLeft = !this.currentRoute['wallLeft'];
            }

            if (this.currentDirection === 's') {
                hasForward = !this.currentRoute['wallBottom'];
                hasRight = !this.currentRoute['wallLeft'];
                hasBottom = !this.currentRoute['wallTop'];
                hasLeft = !this.currentRoute['wallRight'];
            }

            if (this.currentDirection === 'e') {
                hasForward = !this.currentRoute['wallRight'];
                hasRight = !this.currentRoute['wallBottom'];
                hasBottom = !this.currentRoute['wallLeft'];
                hasLeft = !this.currentRoute['wallTop'];
            }

            if (this.currentDirection === 'w') {
                hasForward = !this.currentRoute['wallLeft'];
                hasRight = !this.currentRoute['wallTop'];
                hasBottom = !this.currentRoute['wallRight'];
                hasLeft = !this.currentRoute['wallBottom'];
            }

            this.hasForward = hasForward;
            this.hasBottom = hasBottom;
            this.hasRight = hasRight;
            this.hasLeft = hasLeft;
        }
    }

    newMaze(x, y) {
        // Establish variables and starting grid
        const totalCells = x * y;
        const cells = new Array();
        const unvis = new Array();
        for (let i = 0; i < y; i++) {
            cells[i] = new Array();
            unvis[i] = new Array();
            for (let j = 0; j < x; j++) {
                cells[i][j] = [0, 0, 0, 0];
                unvis[i][j] = true;
            }
        }

        // Set a random position to start from
        let currentCell = [Math.floor(Math.random() * y), Math.floor(Math.random() * x)];
        const path = [currentCell];
        unvis[currentCell[0]][currentCell[1]] = false;
        let visited = 1;

        // Loop through all available cell positions
        while (visited < totalCells) {
            // Determine neighboring cells
            const pot = [
                [currentCell[0] - 1, currentCell[1], 0, 2],
                [currentCell[0], currentCell[1] + 1, 1, 3],
                [currentCell[0] + 1, currentCell[1], 2, 0],
                [currentCell[0], currentCell[1] - 1, 3, 1]
            ];
            const neighbors = new Array();

            // Determine if each neighboring cell is in game grid, and whether it has already been checked
            for (let l = 0; l < 4; l++) {
                if (pot[l][0] > -1 && pot[l][0] < y && pot[l][1] > -1 && pot[l][1] < x && unvis[pot[l][0]][pot[l][1]]) {
                    neighbors.push(pot[l]);
                }
            }

            // If at least one active neighboring cell has been found
            if (neighbors.length) {
                // Choose one of the neighbors at random
                const next = neighbors[Math.floor(Math.random() * neighbors.length)];

                // Remove the wall between the current cell and the chosen neighboring cell
                cells[currentCell[0]][currentCell[1]][next[2]] = 1;
                cells[next[0]][next[1]][next[3]] = 1;

                // Mark the neighbor as visited, and set it as the current cell
                unvis[next[0]][next[1]] = false;
                visited++;
                currentCell = [next[0], next[1]];
                path.push(currentCell);
            } else {
                // Otherwise go back up a step and keep going

                currentCell = path.pop();
            }
        }
        return cells;
    }

    moveForward() {
        // this.clickAudio.play();
        this.wallReady = false;
        if (this.currentDirection === 's') {
            this.currentY++;
        }

        if (this.currentDirection === 'e') {
            this.currentX++;
        }

        if (this.currentDirection === 'w') {
            this.currentX--;
        }

        if (this.currentDirection === 'n') {
            this.currentY--;
        }

        this.currentRoom = this.currentY + '-' + this.currentX;
        this.state = 'f';
        this.getRoute(this.currentRoom);
    }

    moveLeft() {
        // this.clickAudio.play();
        this.wallReady = false;

        if (this.currentDirection === 'n') {
            this.currentX--;
            this.currentDirection = 'w';
        } else if (this.currentDirection === 's') {
            this.currentX++;
            this.currentDirection = 'e';
        } else if (this.currentDirection === 'e') {
            this.currentY--;
            this.currentDirection = 'n';
        } else if (this.currentDirection === 'w') {
            this.currentY++;
            this.currentDirection = 's';
        }
        this.currentRoom = this.currentY + '-' + this.currentX;
        this.state = 'l';
        this.getRoute(this.currentRoom);
    }

    moveRight() {
        // this.clickAudio.play();
        //  this.roomChange.play();
        this.wallReady = false;
        if (this.currentDirection === 'n') {
            this.currentX++;
            this.currentDirection = 'e';
        } else if (this.currentDirection === 's') {
            this.currentX--;
            this.currentDirection = 'w';
        } else if (this.currentDirection === 'e') {
            this.currentY++;
            this.currentDirection = 's';
        } else if (this.currentDirection === 'w') {
            this.currentY--;
            this.currentDirection = 'n';
        }

        this.currentRoom = this.currentY + '-' + this.currentX;
        this.state = 'r';
        this.getRoute(this.currentRoom);
    }

    turnAround() {
        // this.clickAudio.play();
        this.wallReady = false;
        if (this.currentDirection === 'n') {
            this.currentDirection = 's';
        } else if (this.currentDirection === 's') {
            this.currentDirection = 'n';
        } else if (this.currentDirection === 'e') {
            this.currentDirection = 'w';
        } else if (this.currentDirection === 'w') {
            this.currentDirection = 'e';
        }
        this.state = 'back';
        this.getRoute(this.currentRoom);
    }

    async openMap() {
        this.clickAudio.play();
        // console.log(this.currentRoom);
        // console.log(this.mazeData);
        const modal = await this.modalController.create({
            component: MapPage,
            backdropDismiss: false,
            componentProps: { routeHistory: this.routeHistory, mazeData: this.mazeData, currentRoom: this.currentRoom }
        });

        this.modals.push(modal);
        return await modal.present();
    }

    @HostListener('document:keyup', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        const splitCoords = this.currentRoom.split('-');

        this.currentY = +splitCoords[0];
        this.currentX = +splitCoords[1];
        const key = event.key;

        if (key === 'ArrowUp' && this.hasForward && !this.monsterPresent) {
            this.moveForward();
        }

        if (key === 'ArrowLeft' && this.hasLeft && !this.monsterPresent) {
            this.moveLeft();
        }

        if (key === 'Enter') {
            this.clearAlerts();
        }

        if (key === 'ArrowRight' && this.hasRight && !this.monsterPresent) {
            this.moveRight();
        }

        if (key === 'ArrowDown' && !this.monsterPresent) {
            this.turnAround();
        }
    }
}
