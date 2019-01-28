import { Component, HostListener } from '@angular/core';
import { MazeProvider } from '../..//providers/maze-service';
import { AlertController, NavController, IonRouterOutlet } from '@ionic/angular';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { Observable, interval } from 'rxjs';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
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
    styleUrls: ['home.page.scss']
})
export class HomePage {
    routeId = 0;
    currentRoute = {};
    routeHistory = [];
    hasLeft: Boolean = false;
    hasRight: Boolean = false;
    hasForward: Boolean = false;
    wallReady = false;
    state: String = 'small';
    currentDirection = 'n';
    monsterPresent = false;
    monsterQuotes = [];
    wallClass;
    monsterImageUrl;
    monsterImageList;
    alerts = [];
    timerM = 600;

    constructor(
        public mazeProvider: MazeProvider,
        public navCtrl: NavController,
        public rtCtrl: IonRouterOutlet,
        public alertController: AlertController
    ) {
        // this.getRoute(1641);
        // this.getQuotes();
        this.getImages();
        this.wallClass = 'sandstone';
    }

    ionViewDidEnter() {
        // console.log('init');

        let minutes;
        let seconds;
        interval(1000).subscribe(x => {
            minutes = Math.floor(this.timerM / 60);
            seconds = Math.floor(this.timerM % 60);

            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;

            // console.log(minutes + ':' + seconds);

            --this.timerM;
            if (--this.timerM < 0) {
                this.showDeath();
                // console.log('timeup');
            }
        });
    }

    // async getQuotes() {
    //     this.mazeProvider.getQuotes().then(response => {
    //         this.monsterQuotes = response['quotes'];
    //     });
    // }

    async getImages() {
        this.mazeProvider.getImages().then(response => {
            this.monsterImageList = response['monsters'];
        });
    }

    // getRoute(id) {
    //     // console.log(id);
    //     this.hasLeft = false;
    //     this.hasRight = false;
    //     this.hasForward = false;
    //     this.wallReady = false;
    //     this.mazeProvider.getRoute(id).then(response => {
    //         // console.log(response);
    //         this.currentRoute = response[0];

    //         this.currentRoute['routes'].forEach(route => {
    //             // console.log(route);
    //             if (route.direction === this.currentDirection) {
    //                 route['routes'].forEach(child => {
    //                     if (child.direction === 'r') {
    //                         this.hasRight = true;
    //                     }
    //                     if (child.direction === 'l') {
    //                         this.hasLeft = true;
    //                     }
    //                     if (child.direction === 'f') {
    //                         this.hasForward = true;
    //                     }
    //                     if (child.direction === 'win') {
    //                         this.showWin();
    //                     }
    //                 });
    //             }
    //         });
    //         // console.log(this.hasRight);

    //         return response;
    //     });
    // }

    // move(id) {
    //     if (id !== 'back') {
    //         this.routeHistory.push(this.currentRoute);

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
        console.log(this.currentRoute['id']);
        const routeId = this.currentRoute['id'];
    }

    async showWin() {
        this.navCtrl.navigateForward('win');
    }

    async showDeath() {
        this.clearAlerts();
        this.navCtrl.navigateForward('death');
    }

    async onAnimationEvent(hey) {
        this.state = null;

        if (this.currentRoute && this.currentRoute['routes']) {
            this.currentRoute['routes'].forEach(route => {
                if (
                    route['direction'] === this.currentDirection &&
                    route['monster'] === true &&
                    this.monsterPresent !== true
                ) {
                    this.monsterPresent = true;
                    this.getMonster();
                }
            });
        }

        // this.wallReady = true;
    }

    async getMonster() {
        const alert = await this.alertController.create({
            // header: 'Squirtle Says',

            message: this.monsterQuotes[Math.floor(Math.random() * this.monsterQuotes.length)],
            buttons: ['close']
        });

        this.monsterImageUrl =
            '../../assets/' + this.monsterImageList[Math.floor(Math.random() * this.monsterImageList.length)];

        console.log(this.monsterImageUrl);
        this.alerts.push(alert);
        await alert.present();
    }

    clearAlerts() {
        if (this.alerts.length) {
            this.alerts.forEach(e => {
                e.dismiss();
            });
        }
        this.alerts = [];
    }

    onKey(event: any) {
        // without type info
        console.log(event.keycode);
    }

    // @HostListener('document:keyup', ['$event'])
    // handleKeyboardEvent(event: KeyboardEvent) {
    //     this.wallReady = false;
    //     console.log(event.key);
    //     const key = event.key;

    //     if (key === 'ArrowUp' && this.hasForward) {
    //         this.move('f');
    //     }

    //     if (key === 'ArrowLeft' && this.hasLeft) {
    //         this.move('l');
    //     }

    //     if (key === 'Enter') {
    //         this.clearAlerts();
    //     }

    //     if (key === 'ArrowRight' && this.hasRight) {
    //         this.move('r');
    //     }

    //     if (key === 'ArrowDown') {
    //         this.clearAlerts();
    //         this.move('back');
    //     }
    // }
}
