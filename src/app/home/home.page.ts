import { Component } from '@angular/core';
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
                        style({ transform: 'translateX(-25%)' }),
                        style({ transform: 'translateX(-50%)' }),
                        style({ transform: 'translateX(-75%)' })
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
    wallReady;
    state: String = 'small';
    currentDirection = 'n';
    monsterPresent = false;
    monsterQuotes = [];
    wallClass;

    constructor(
        public mazeProvider: MazeProvider,
        public navCtrl: NavController,
        public rtCtrl: IonRouterOutlet,
        public alertController: AlertController
    ) {
        this.getRoute(1641);
        this.getQuotes();
        this.wallClass = 'sandstone';
    }

    ionViewDidEnter() {
        // console.log('init');
        let timerM = 600;
        let minutes;
        let seconds;
        interval(1000).subscribe(x => {
            minutes = Math.floor(timerM / 60);
            seconds = Math.floor(timerM % 60);

            minutes = minutes < 10 ? '0' + minutes : minutes;
            seconds = seconds < 10 ? '0' + seconds : seconds;

            // console.log(minutes + ':' + seconds);

            --timerM;
            if (--timerM < 0) {
                this.showDeath();
                // console.log('timeup');
            }
        });
    }

    async getQuotes() {
        this.mazeProvider.getQuotes().then(response => {
            this.monsterQuotes = response['quotes'];
        });
    }

    getRoute(id) {
        // console.log(id);
        this.hasLeft = false;
        this.hasRight = false;
        this.hasForward = false;
        this.wallReady = false;
        this.mazeProvider.getRoute(id).then(response => {
            // console.log(response);
            this.currentRoute = response[0];

            this.currentRoute['routes'].forEach(route => {
                // console.log(route);
                if (route.direction === this.currentDirection) {
                    route['routes'].forEach(child => {
                        if (child.direction === 'r') {
                            this.hasRight = true;
                        }
                        if (child.direction === 'l') {
                            this.hasLeft = true;
                        }
                        if (child.direction === 'f') {
                            this.hasForward = true;
                        }
                        if (child.direction === 'win') {
                            this.showWin();
                        }
                    });
                }
            });
            // console.log(this.hasRight);

            return response;
        });
    }

    move(id) {
        if (id !== 'back') {
            this.routeHistory.push(this.currentRoute);

            this.currentRoute['routes'].forEach(route => {
                if (route.direction === this.currentDirection) {
                    // console.log('matched direction in move', route.direction, this.currentDirection);
                    route['routes'].forEach(child => {
                        if (child.direction === id) {
                            this.state = id;
                            this.getRoute(child.id);
                        }
                    });
                }
            });

            if (this.currentDirection === 'n' && id === 'r') {
                this.currentDirection = 'e';
            } else if (this.currentDirection === 'n' && id === 'l') {
                this.currentDirection = 'w';
            } else if (this.currentDirection === 's' && id === 'r') {
                this.currentDirection = 'w';
            } else if (this.currentDirection === 's' && id === 'l') {
                this.currentDirection = 'e';
            } else if (this.currentDirection === 'e' && id === 'r') {
                this.currentDirection = 's';
            } else if (this.currentDirection === 'e' && id === 'l') {
                this.currentDirection = 'n';
            } else if (this.currentDirection === 'w' && id === 'r') {
                this.currentDirection = 'n';
            } else if (this.currentDirection === 'w' && id === 'l') {
                this.currentDirection = 's';
            }
        } else {
            this.state = 'back';
            this.monsterPresent = false;

            if (this.currentDirection === 'n') {
                this.currentDirection = 's';
            } else if (this.currentDirection === 's') {
                this.currentDirection = 'n';
            } else if (this.currentDirection === 'e') {
                this.currentDirection = 'w';
            } else if (this.currentDirection === 'w') {
                this.currentDirection = 'e';
            }

            this.getRoute(this.currentRoute['id']);
        }

        this.updateWalls();
    }

    updateWalls() {
        console.log(this.currentRoute['id']);
        const routeId = this.currentRoute['id'];

        // switch (true) {
        //     case routeId > 1518: {
        //         this.wallClass = 'sandstone';
        //         console.log('sandstone');
        //         break;
        //     }
        //     case routeId < 1518: {
        //         console.log('something');
        //         this.wallClass = 'something';
        //         break;
        //     }
        // }

        // if (this.currentRoute['id'] > 1518) {
        // this.wallClass = 'sandstone';
        // } else {
        //     this.wallClass = 'something';
        // }
    }

    async showWin() {
        this.navCtrl.navigateForward('win');
    }

    async showDeath() {
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

        this.wallReady = true;
    }

    async getMonster() {
        const alert = await this.alertController.create({
            header: 'Squirtle Says',

            message: this.monsterQuotes[Math.floor(Math.random() * this.monsterQuotes.length)],
            buttons: ['OK']
        });

        await alert.present();
    }
}
