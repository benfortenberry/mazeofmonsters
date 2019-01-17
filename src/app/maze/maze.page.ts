import { Component, HostListener } from '@angular/core';
import { MazeProvider } from '../..//providers/maze-service';
import { AlertController, NavController, IonRouterOutlet } from '@ionic/angular';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { Observable, interval } from 'rxjs';
import { ModalController } from '@ionic/angular';
import { MapPage } from '../map/map.page';
import { RpsPage } from '../rps/rps.page';
import { MemoryPage } from '../memory/memory.page';
import { SimonPage } from '../simon/simon.page';
import { TictactoePage } from '../tictactoe/tictactoe.page';
import { ShellPage } from '../shell/shell.page';
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
    monsterCoolDown = 200;
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

    constructor(
        public mazeProvider: MazeProvider,
        public navCtrl: NavController,
        public rtCtrl: IonRouterOutlet,
        public alertController: AlertController,
        public modalController: ModalController,
        public toastController: ToastController
    ) {
        this.generate();
        this.currentRoom = '0-0';
        this.getQuotes();
        this.getImages();
        this.wallClass = 'sandstone';
    }

    ionViewDidEnter() {
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

    async getQuotes() {
        this.mazeProvider.getQuotes().then(response => {
            this.monsterQuotes = response['quotes'];
        });
    }

    async getRoutes() {
        this.mazeProvider.getRoutes().then(response => {
            this.routes = response['routes'];
            this.getRoute('0-0');
        });
    }

    async getImages() {
        this.mazeProvider.getImages().then(response => {
            this.monsterImageList = response['monsters'];
        });
    }

    // move(id) {
    //     if (id !== 'back') {
    //         //  this.routeHistory.push(this.currentRoute);

    //         this.currentRoute['routes'].forEach(route => {
    //             if (route.direction === this.currentDirection) {
    //                 // console.log('matched direction in move', route.direction, this.currentDirection);
    //                 route['routes'].forEach(child => {
    //                     if (child.direction === id) {
    //                         this.state = id;
    //                         this.getRoute(child.id);
    //                     }
    //                 });
    //             }
    //         });

    //         if (this.currentDirection === 'n' && id === 'r') {
    //             this.currentDirection = 'e';
    //         } else if (this.currentDirection === 'n' && id === 'l') {
    //             this.currentDirection = 'w';
    //         } else if (this.currentDirection === 's' && id === 'r') {
    //             this.currentDirection = 'w';
    //         } else if (this.currentDirection === 's' && id === 'l') {
    //             this.currentDirection = 'e';
    //         } else if (this.currentDirection === 'e' && id === 'r') {
    //             this.currentDirection = 's';
    //         } else if (this.currentDirection === 'e' && id === 'l') {
    //             this.currentDirection = 'n';
    //         } else if (this.currentDirection === 'w' && id === 'r') {
    //             this.currentDirection = 'n';
    //         } else if (this.currentDirection === 'w' && id === 'l') {
    //             this.currentDirection = 's';
    //         }
    //     } else {
    //         this.state = 'back';
    //         this.monsterPresent = false;

    //         if (this.currentDirection === 'n') {
    //             this.currentDirection = 's';
    //         } else if (this.currentDirection === 's') {
    //             this.currentDirection = 'n';
    //         } else if (this.currentDirection === 'e') {
    //             this.currentDirection = 'w';
    //         } else if (this.currentDirection === 'w') {
    //             this.currentDirection = 'e';
    //         }

    //         this.getRoute(this.currentRoute['id']);
    //     }

    //     this.updateWalls();
    // }

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
            this.monsterPresent = true;
            this.monsterCoolDown = 200;
            this.getMonster();
        } else {
            this.monsterCoolDown = this.monsterCoolDown - 25;
        }

        this.wallReady = true;
    }

    async launchMiniGame() {
        // list of mini games

        const miniGames = ['rps', 'simon', 'memory', 'shell', 'tictactoe'];

        // get a random game
        const selectedMinigame = miniGames[Math.floor(Math.random() * this.monsterImageList.length)];

        if (selectedMinigame === 'rps') {
            const modal = await this.modalController.create({
                component: RpsPage,
                componentProps: {}
            });

            this.modals.push(modal);

            await modal.present();

            const { data } = await modal.onDidDismiss();
            console.log(data);

            if (data.result === true) {
                this.showWinMiniGame();
            } else {
                this.showLostMiniGame();
            }
        }

        if (selectedMinigame === 'simon') {
            const modal = await this.modalController.create({
                component: SimonPage,
                componentProps: {}
            });

            this.modals.push(modal);

            await modal.present();

            const { data } = await modal.onDidDismiss();
            console.log(data);

            if (data.result === true) {
                this.showWinMiniGame();
            } else {
                this.showLostMiniGame();
            }
        }

        if (selectedMinigame === 'memory') {
            const modal = await this.modalController.create({
                component: MemoryPage,
                componentProps: {}
            });

            this.modals.push(modal);

            await modal.present();

            const { data } = await modal.onDidDismiss();
            console.log(data);

            if (data.result === true) {
                this.showWinMiniGame();
            } else {
                this.showLostMiniGame();
            }
        }

        if (selectedMinigame === 'shell') {
            const modal = await this.modalController.create({
                component: ShellPage,
                componentProps: {}
            });

            this.modals.push(modal);

            await modal.present();

            const { data } = await modal.onDidDismiss();
            console.log(data);

            if (data.result === true) {
                this.showWinMiniGame();
            } else {
                this.showLostMiniGame();
            }
        }

        if (selectedMinigame === 'tictactoe') {
            const modal = await this.modalController.create({
                component: TictactoePage,
                componentProps: {}
            });

            this.modals.push(modal);

            await modal.present();

            const { data } = await modal.onDidDismiss();
            console.log(data);

            if (data.result === true) {
                this.showWinMiniGame();
            } else {
                this.showLostMiniGame();
            }
        }
    }

    addRoomsToMap() {
        // start a counter at 5
        // pick a random 'row'
        // pick a random 'cell
        // if not, add and increment
    }

    async showWinMiniGame() {
        const alert = await this.alertController.create({
            // header: 'Squirtle Says',

            message: 'You won! I will add 5 rooms to your map.',
            buttons: [
                {
                    text: 'OK',
                    handler: () => {
                        this.monsterPresent = false;
                        //add five rooms to map
                    }
                }
            ]
        });

        // setTimeout(() => {
        this.alerts.push(alert);
        alert.present();
        // }, 1000);
    }

    async showLostMiniGame() {
        const alert = await this.alertController.create({
            // header: 'Squirtle Says',

            message: "Too bad... I can't add any rooms to your map.",
            buttons: [
                {
                    text: 'OK',
                    handler: () => {
                        this.monsterPresent = false;
                        //add five rooms to map
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
        this.monsterImageUrl =
            '../../assets/' + this.monsterImageList[Math.floor(Math.random() * this.monsterImageList.length)];
        const alert = await this.alertController.create({
            // header: 'Squirtle Says',

            message: 'Would you like some help?',
            buttons: [
                {
                    text: 'Yes',
                    handler: () => {
                        console.log('I want some help');

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
                        this.monsterCoolDown = 400;
                        console.log('Confirm Cancel');
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

        console.log(this.routes);
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
        // console.log(this.currentRoom);
        // console.log(this.mazeData);
        const modal = await this.modalController.create({
            component: MapPage,
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
