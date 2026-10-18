import { Component, HostListener } from '@angular/core';
import { MazeProvider } from '../..//providers/maze-service';
import { AlertController, NavController, IonRouterOutlet } from '@ionic/angular';
import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';
import { CountdownService } from '../../providers/countdown-service';
import { AudioService } from '../../providers/audioService';
import { ModalController } from '@ionic/angular';
import { MapPage } from '../map/map.page';
import { SsbPage } from '../ssb/ssb.page';
import { GemPage } from '../gems/gems.page';
import { OrbPage } from '../orb/orb';
import { XandoPage } from '../xando/xando.page';
import { EyeballPage } from '../eyeball/eyeball.page';
import { InstructionsPage } from '../instructions/instructions.page';
import { ImagePreloadService } from '../../providers/imagePreloadService';
import { GAME_IMAGES } from '../../providers/gameAssets';
import { ToastController, Platform } from '@ionic/angular';
import { SeededRandom } from '../../providers/seededRandom';
@Component({
    standalone: false,
    selector: 'app-maze',
    templateUrl: 'maze.page.html',
    animations: [
        trigger('myAwesomeAnimation', [
            state(
                'back',
                style({
                    willChange: 'transform'
                    // transform: 'scale(1)'
                })
            ),
            state(
                'f',
                style({
                    willChange: 'transform'
                    // backgroundPosition: '5000px'
                    // transform: 'scale(1.2)'
                })
            ),
            state(
                'l',
                style({
                    willChange: 'transform'
                    // transform: 'scale(1.2)'
                })
            ),
            state(
                'r',
                style({
                    willChange: 'transform'
                    // transform: 'scale(1.2)'
                })
            ),
            transition(
                // Forward "step": a gentle zoom-in that eases back to the
                // starting frame. The sense of progress comes from the walls
                // updating to the next room; the transform must end exactly at
                // scale(1) so there is no pop when the state resets. We only
                // scale here — this scene is a faked CSS-perspective stage, so
                // translateZ/rotateY on the whole stage clips and distorts.
                '* => f',
                // Quick push, soft settle: accelerate into the zoom then
                // decelerate back, with the peak held a touch past the middle
                // so it reads as a committed step rather than a bounce. Ends
                // exactly at scale(1) so there's no pop on reset. The peak scale
                // is a param so reduced-motion can shrink it to a tiny pulse.
                animate(
                    '320ms cubic-bezier(0.22, 1, 0.36, 1)',
                    keyframes([
                        style({ transform: 'scale(1)', offset: 0 }),
                        style({ transform: 'scale({{ zoomMid }})', offset: 0.5 }),
                        style({ transform: 'scale({{ zoomPeak }})', offset: 0.68 }),
                        style({ transform: 'scale(1)', offset: 1 })
                    ])
                ),
                { params: { zoomMid: 1.16, zoomPeak: 1.19 } }
            ),
            transition(
                // Turn left: slide the scene sideways and ease back to center.
                // Pure translateX keeps it in the plane the scene expects (no
                // added perspective), so it stays smooth.
                '* => l',
                // Snappy slide out, gentle ease back to center.
                animate(
                    '300ms cubic-bezier(0.33, 0, 0.2, 1)',
                    keyframes([
                        style({ transform: 'translateX(0)', offset: 0 }),
                        style({ transform: 'translateX({{ turn }})', offset: 0.55 }),
                        style({ transform: 'translateX(0)', offset: 1 })
                    ])
                ),
                { params: { turn: '24%' } }
            ),
            transition(
                // Turn right: mirror of the left turn.
                '* => r',
                animate(
                    '300ms cubic-bezier(0.33, 0, 0.2, 1)',
                    keyframes([
                        style({ transform: 'translateX(0)', offset: 0 }),
                        style({ transform: 'translateX({{ turn }})', offset: 0.55 }),
                        style({ transform: 'translateX(0)', offset: 1 })
                    ])
                ),
                { params: { turn: '-24%' } }
            ),
            transition(
                // Turn around: a bigger sweep across and back to center.
                '* => back',
                animate(
                    '380ms cubic-bezier(0.33, 0, 0.2, 1)',
                    keyframes([
                        style({ transform: 'translateX(0)', offset: 0 }),
                        style({ transform: 'translateX({{ sweep }})', offset: 0.5 }),
                        style({ transform: 'translateX(0)', offset: 1 })
                    ])
                ),
                { params: { sweep: '-62%' } }
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

    // Accessibility: when the player's OS requests reduced motion, we feed much
    // smaller transform magnitudes into the animations (see mazeAnim() below).
    // The animations still run and still fire their .done callback — which is
    // load-bearing here (it unlocks movement and drives monster spawns) — so
    // gameplay is unchanged; only the visible motion shrinks.
    reduceMotion =
        typeof window !== 'undefined' &&
        !!window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    currentDirection = 's';
    monsterPresent = false;
    monsterCoolDown = 800;

    // Time penalties (seconds) that give monster encounters real stakes.
    // Refusing the offered help annoys the monster; gambling on a mini-game and
    // losing costs more. Winning stays purely a reward (no penalty).
    readonly REFUSE_PENALTY = 20;
    readonly LOSE_PENALTY = 45;

    // Shared id applied to the dismissible HUD modals (map, help). The Escape
    // handler only closes a modal carrying this id, so it can never force-close
    // a mini-game modal (which is awaited for a win/lose result).
    readonly HUD_MODAL_ID = 'hud-modal';
    wallClass;
    monsterImageUrl = '../../assets/monsters/Dragon.png';
    monsterImageList;
    // Sound to play once the monster <img> has actually loaded, so the growl
    // and the visible monster land on the same beat.
    pendingMonsterSound: string = null;
    alerts = [];
    modals = [];
    currentX = 0;
    currentY = 0;
    mazeData;
    mazeTimer;
    timerSub;
    availMiniGames = [];
    availMonsterList = [];
    usedMonster = [];
    monsterClass;

    // Seeded RNG driving procedural maze generation. Built from the persisted
    // seed so a run is reproducible across death-retry and page reload.
    rng: SeededRandom;

    // backgroundAudio = new Audio();

    // loseAudio = new Audio();

    // monsterAudio = new Audio();

    subscription;

    showTime;
    timeLeft;

    constructor(
        public mazeProvider: MazeProvider,
        public navCtrl: NavController,
        public rtCtrl: IonRouterOutlet,
        public alertController: AlertController,
        public modalController: ModalController,
        public toastController: ToastController,
        private countdownService: CountdownService,
        private platform: Platform,
        private aService: AudioService,
        private imagePreload: ImagePreloadService
    ) {
        // One-time wiring only. Per-run state (maze layout, player position,
        // timers) is set up in startRun() on view-enter, NOT here — because
        // Ionic caches this page in the nav stack, so on a death-retry the
        // component is reused and the constructor does NOT run again. Putting
        // run setup here left the player standing where they died with a fresh
        // clock instead of restarting at the entrance.
        this.getImages();

        // Safety net: ensure all game art is decoded. The intro already warms
        // everything (GAME_IMAGES) before the maze loads, so this is normally a
        // no-op (the service dedupes) — but it guarantees readiness even if the
        // maze is reached without passing through the intro.
        this.imagePreload.decode(GAME_IMAGES);

        this.aService.loop('backgroundAudio');
    }

    // Reset everything for a fresh run and build the maze. Runs on every entry
    // (first visit, death-retry, win-restart), so the player always starts at
    // the entrance facing south with a clean history. The maze itself is built
    // from the persisted seed: a death-retry reproduces the same maze (the seed
    // is untouched on death), while a win rolls a new seed in WinPage first.
    private startRun() {
        this.rng = new SeededRandom(this.mazeProvider.getSeed());

        // Reset player position / orientation / history.
        this.currentDirection = 's';
        this.currentX = 0;
        this.currentY = 0;
        this.currentRoom = '0-0';
        this.routeHistory = [];
        this.currentRoute = {};
        this.wallClass = 'sandstone';

        // Reset per-run encounter pools and monster state.
        this.availMiniGames = [];
        this.availMonsterList = [];
        this.usedMonster = [];
        this.monsterPresent = false;
        this.monsterCoolDown = 800;

        // Build the maze from the seed and place the player at the start.
        this.generate();
    }

    // Animation binding for the .maze element. Combines the current movement
    // state with per-transition transform magnitudes. When the OS asks for
    // reduced motion we feed tiny magnitudes so the step/turn is barely a pulse
    // while the animation (and its load-bearing .done callback) still runs.
    get mazeAnim() {
        const full = { zoomMid: 1.16, zoomPeak: 1.19, turnL: '24%', turnR: '-24%', sweep: '-62%' };
        const gentle = { zoomMid: 1.02, zoomPeak: 1.025, turnL: '4%', turnR: '-4%', sweep: '-10%' };
        const p = this.reduceMotion ? gentle : full;
        return {
            value: this.state,
            params: {
                zoomMid: p.zoomMid,
                zoomPeak: p.zoomPeak,
                // left and right turns read the same `turn` param name, so pick
                // the signed value by the state we're animating into.
                turn: this.state === 'r' ? p.turnR : p.turnL,
                sweep: p.sweep
            }
        };
    }

    ionViewWillEnter() {
        // Fresh run on every entry (first visit, death-retry, win-restart).
        // Must run before the countdown starts in ionViewDidEnter.
        this.startRun();
    }

    ionViewDidEnter() {
        this.showTime = true;
        this.countdownService.count = 900;
        this.countdownService.start();
        // Tear down any prior subscription before making a new one. On a reused
        // (cached) page, ionViewDidEnter runs again on each entry; without this
        // the old subscription would linger and stack, firing showDeath() more
        // than once. (Note: countdown() returns the observable; subscribe()
        // returns the Subscription we actually need to keep.)
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.subscription = this.countdownService.countdown().subscribe(t => {
            this.timeLeft = t;
            if (this.timeLeft === 1) {
                this.showDeath();
            }
        });

        // Show the how-to-play modal automatically the first time ever. After
        // that it's only reachable via the help (?) button.
        try {
            if (!localStorage.getItem('mom_instructions_seen')) {
                localStorage.setItem('mom_instructions_seen', '1');
                this.openInstructions();
            }
        } catch (e) {
            // localStorage can throw in some privacy modes; just skip the auto-show.
        }
    }

    ionViewWillLeave() {
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
        this.countdownService.stop();
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

    showWin() {
        this.navCtrl.navigateForward('win');
    }

    async showDeath() {
        this.clearAlerts();
        this.clearModals();

        // this.mazeTimer = null;

        this.navCtrl.navigateForward('death');
    }

    async onAnimationEvent(hey) {
        this.state = null;
        // console.log(this.monsterCoolDown, this.hasLeft, this.hasRight, this.hasForward);
        // if (this.monsterCoolDown < 25 && !this.hasLeft && !this.hasRight && !this.hasForward) {
        if (this.monsterCoolDown < 0) {
            this.monsterCoolDown = 800;
            // getMonster() now reveals the monster (sets monsterPresent) at the
            // same moment it plays the sound, so they're in sync.
            await this.getMonster();
        } else {
            this.monsterCoolDown = this.monsterCoolDown - 25;
        }

        this.wallReady = true;
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

    async launchMiniGame() {
        // this.backgroundAudio.pause();
        // console.log('launch mini game');
        // list of mini games

        if (this.availMiniGames.length === 0) {
            let miniGames = ['xando', 'ssb', 'orb', 'eyeball', 'gems'];
            miniGames = this.shuffleList(miniGames);
            this.availMiniGames = miniGames;
        }

        const selectedMinigame = this.availMiniGames[this.availMiniGames.length - 1];
        this.availMiniGames.pop();
        // const miniGames = ['xando', 'ssb', 'orb', 'eyeball', 'gems'];

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

    /**
     * Reward for winning a mini-game: reveal the next stretch of the *correct*
     * escape route on the map, starting from the player's current room.
     *
     * Previously this lit up random cells, which never actually helped the
     * player escape. Now we compute the shortest path from the current room to
     * the exit (the maze is a perfect maze, so there is exactly one) and reveal
     * the next few rooms along it that aren't already on the map. That turns a
     * win into genuine forward progress.
     */
    addRoomsToMap() {
        const revealCount = 9;
        const path = this.pathToExit(this.currentRoom);

        if (!path || path.length === 0) {
            return;
        }

        let revealed = 0;
        for (const roomId of path) {
            if (revealed >= revealCount) {
                break;
            }
            if (this.routeHistory.indexOf(roomId) === -1) {
                this.routeHistory.push(roomId);
                revealed++;
            }
        }
    }

    /**
     * Breadth-first search over the open-wall adjacency from `startId` to the
     * exit ('29-29'), returning the ordered list of room ids on the path
     * (excluding the start room, including the exit). Returns an empty array if
     * no path exists or the maze data isn't ready.
     *
     * mazeData[row][col] = [top, right, bottom, left], 1 = open passage.
     */
    pathToExit(startId): string[] {
        const exitId = '29-29';
        if (!this.mazeData || !startId) {
            return [];
        }

        const rows = this.mazeData.length;
        const cols = this.mazeData[0].length;
        const parse = (id: string) => {
            const [r, c] = id.split('-').map(Number);
            return { r, c };
        };

        const start = parse(startId);
        const visited = new Set<string>([startId]);
        const prev: { [id: string]: string } = {};
        const queue: string[] = [startId];

        while (queue.length) {
            const currentId = queue.shift();
            if (currentId === exitId) {
                break;
            }
            const { r, c } = parse(currentId);
            const walls = this.mazeData[r][c]; // [top, right, bottom, left]

            const neighbors: Array<{ open: number; nr: number; nc: number }> = [
                { open: walls[0], nr: r - 1, nc: c }, // top
                { open: walls[1], nr: r, nc: c + 1 }, // right
                { open: walls[2], nr: r + 1, nc: c }, // bottom
                { open: walls[3], nr: r, nc: c - 1 } // left
            ];

            for (const n of neighbors) {
                if (n.open !== 1) {
                    continue;
                }
                if (n.nr < 0 || n.nr >= rows || n.nc < 0 || n.nc >= cols) {
                    continue;
                }
                const nid = n.nr + '-' + n.nc;
                if (visited.has(nid)) {
                    continue;
                }
                visited.add(nid);
                prev[nid] = currentId;
                queue.push(nid);
            }
        }

        if (!visited.has(exitId)) {
            return [];
        }

        // Reconstruct from exit back to start, then reverse. Drop the start
        // room so the reveal begins with the next step forward.
        const path: string[] = [];
        let step = exitId;
        while (step !== startId) {
            path.push(step);
            step = prev[step];
        }
        return path.reverse();
    }

    async showTimer() {
        this.aService.play('clickAudio');

        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft - minutes * 60;

        // The keeper's voice: cold, gloating, counting down to your "joining"
        // the collection. Grammar handles singular/plural and dropped-zero
        // parts so it never reads "1 minutes" or "3 minutes and 0 seconds".
        const parts = [];
        if (minutes > 0) {
            parts.push(minutes + (minutes === 1 ? ' minute' : ' minutes'));
        }
        if (seconds > 0 || minutes === 0) {
            parts.push(seconds + (seconds === 1 ? ' second' : ' seconds'));
        }
        const timeStr = parts.join(' and ');

        const alert = await this.alertController.create({
            header: 'The Maze',
            message: timeStr + ' until you belong to Yabdib. Do hurry.',
            buttons: [
                {
                    text: 'Keep moving',
                    handler: () => {}
                }
            ]
        });

        this.alerts.push(alert);
        alert.present();
    }

    async showDirection() {
        this.aService.play('clickAudio');
        // console.log('show');
        let dir = '';
        if (this.currentDirection === 's') {
            dir = 'south';
        }
        if (this.currentDirection === 'e') {
            dir = 'east';
        }
        if (this.currentDirection === 'w') {
            dir = 'west';
        }
        if (this.currentDirection === 'n') {
            dir = 'north';
        }
        const alert = await this.alertController.create({
            header: 'Your Bearings',
            message: 'You face ' + dir + '. For now. The walls rearrange when you blink.',
            buttons: [
                {
                    text: 'Onward',
                    handler: () => {}
                }
            ]
        });

        this.alerts.push(alert);
        alert.present();
    }

    async showWinMiniGame() {
        // The former-player creature's voice: a trapped ally, haunted but
        // rooting for you to do what they couldn't — get out and spite the Maze.
        const alert = await this.alertController.create({
            header: 'A Friend in the Dark',
            message:
                "You beat me. I was human once, too. Here, I'll light the next stretch on your map. Go. Get out.",
            buttons: [
                {
                    text: 'Thank you',
                    handler: () => {
                        this.monsterPresent = false;
                        // Reveal the next stretch of the correct escape route.
                        this.addRoomsToMap();
                    }
                }
            ]
        });

        // setTimeout(() => {
        this.alerts.push(alert);
        alert.present();
        // Short celebratory sting for a mini-game win. The full HappyMusic
        // song ('winAudio') is reserved for the final maze-victory screen.
        this.aService.play('matchAudio');
        // }, 1000);
    }

    /**
     * Apply a time penalty to the countdown and end the run if it drains the
     * clock. `this.timeLeft` is the latest value emitted by the countdown
     * stream, which we pass through so the service can report post-penalty
     * remaining time (the timer's own completion path doesn't trigger death).
     */
    applyTimePenalty(seconds: number) {
        const remaining = this.countdownService.penalize(seconds, this.timeLeft);
        if (remaining <= 0) {
            this.showDeath();
        }
    }

    async showLostMiniGame() {
        // The former-player creature failed to help — sorrowful, not gloating.
        // this.loseAudio.play();
        const alert = await this.alertController.create({
            header: 'A Friend in the Dark',
            message:
                "I'm sorry. I couldn't hold the way open. Yabdib felt us trying, and took back some of your time. Keep going.",
            buttons: [
                {
                    text: 'Keep going',
                    role: 'cancel',
                    handler: () => {
                        this.monsterPresent = false;
                        // Gambling on help and losing costs time.
                        this.applyTimePenalty(this.LOSE_PENALTY);
                    }
                }
            ]
        });

        // setTimeout(() => {
        this.alerts.push(alert);
        alert.present();
        // }, 1000);
    }

    // Fired by the monster <img>'s (load) event. Playing the sound here (rather
    // than when we set monsterPresent) guarantees the growl coincides with the
    // monster actually being visible, not before it has loaded.
    onMonsterImageLoaded() {
        if (this.pendingMonsterSound) {
            this.aService.play(this.pendingMonsterSound);
            this.pendingMonsterSound = null;
        }
    }

    async getMonster() {
        if (this.availMonsterList.length === 0) {
            this.availMonsterList = this.shuffleList(this.monsterImageList).map(x => Object.assign({}, x));
        }

        // console.log(this.availMonsterList);
        // console.log(this.monsterImageList);
        const selectedMonster = this.availMonsterList[this.availMonsterList.length - 1];
        // console.log(selectedMonster);
        this.availMonsterList.pop();
        // console.log(selectedMonster);
        // Root-relative so it resolves correctly as an <img src> (CSS used
        // ../../ which is relative to the stylesheet, not the document).
        this.monsterImageUrl = 'assets/monsters/' + selectedMonster.img;
        this.monsterClass = selectedMonster.class;

        // Remember which sound to play, then show the <img>. The sound is fired
        // from the image's (load) event in onMonsterImageLoaded(), so the growl
        // and the visible monster are guaranteed to land on the same beat
        // regardless of how long the image takes to load/decode.
        this.pendingMonsterSound = selectedMonster.class;
        this.monsterPresent = true;

        // The former-player creature appears: a trapped ally, whispering so the
        // Maze doesn't hear, offering to bend the rules in your favor.
        const alert = await this.alertController.create({
            header: 'A Friend in the Dark',
            message:
                "Don't be afraid. I wore a face like yours once. Beat my game and I'll show you a way Yabdib would rather you never found.",
            buttons: [
                {
                    text: "Let's play",
                    handler: () => {
                        //

                        // pause timer

                        this.launchMiniGame();
                    }
                },
                {
                    text: 'Not now',
                    role: 'cancel',
                    cssClass: 'secondary',
                    handler: () => {
                        this.monsterPresent = false;
                        this.monsterCoolDown = 1600;
                        // Brushing the monster off isn't free — it costs a
                        // little time, so refusing is a real decision.
                        this.applyTimePenalty(this.REFUSE_PENALTY);
                    }
                }
            ]
        });

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

    generate() {
        // console.log('generate');
        this.currentRoom = '0-0';
        this.routes = [];
        const disp = this.newMaze(30, 30);
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
            this.routeHistory.push('29-29');
        }
        this.routeHistory.push(routeId);

        if (routeId === '29-29') {
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

            if (this.hasLeft && this.hasRight) {
                this.wallClass = 'sandstone-both';
            } else if (this.hasLeft) {
                this.wallClass = 'sandstone-left';
            } else if (this.hasRight) {
                this.wallClass = 'sandstone-right';
            } else {
                this.wallClass = 'sandstone';
            }
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

        // Set a random position to start from (seeded for reproducibility)
        let currentCell = [this.rng.nextInt(y), this.rng.nextInt(x)];
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
                // Choose one of the neighbors at random (seeded)
                const next = neighbors[this.rng.nextInt(neighbors.length)];

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
        this.aService.play('turnAudio');

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
        this.wallReady = false;
        this.getRoute(this.currentRoom);
    }

    moveLeft() {
        this.aService.play('turnAudio');
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
        this.wallReady = false;
        this.getRoute(this.currentRoom);
    }

    moveRight() {
        this.aService.play('turnAudio');
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
        this.wallReady = false;
        this.getRoute(this.currentRoom);
    }

    turnAround() {
        this.aService.play('turnAudio');
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
        this.wallReady = false;
        this.getRoute(this.currentRoom);
    }

    async openInstructions() {
        this.aService.play('clickAudio');
        const modal = await this.modalController.create({
            component: InstructionsPage,
            backdropDismiss: true,
            // Tagged so the Escape key can safely dismiss it (see
            // handleKeyboardEvent). Mini-game modals are intentionally untagged
            // because they must run to completion and are awaited for a result.
            id: this.HUD_MODAL_ID
        });
        this.modals.push(modal);
        return await modal.present();
    }

    async openMap() {
        this.aService.play('clickAudio');
        const modal = await this.modalController.create({
            component: MapPage,
            backdropDismiss: false,
            // Tagged so Escape can safely dismiss it (see handleKeyboardEvent).
            id: this.HUD_MODAL_ID,
            componentProps: {
                currentDirection: this.currentDirection,
                routeHistory: this.routeHistory,
                mazeData: this.mazeData,
                currentRoom: this.currentRoom
            }
        });

        this.modals.push(modal);
        return await modal.present();
    }

    @HostListener('document:keyup', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        const splitCoords = this.currentRoom.split('-');

        this.currentY = +splitCoords[0];
        this.currentX = +splitCoords[1];

        // Normalise to a lowercase key so WASD aliases are case-insensitive and
        // don't depend on Shift/CapsLock. Arrow keys keep their own names.
        const key = event.key;
        const k = key.length === 1 ? key.toLowerCase() : key;

        // Enter dismisses any open alert, regardless of other state.
        if (key === 'Enter') {
            this.clearAlerts();
            return;
        }

        // Escape closes an open HUD modal (map/help) or an alert. It never
        // touches a mini-game modal — those aren't tagged with HUD_MODAL_ID and
        // are awaited for a win/lose result, so force-closing would break them.
        if (key === 'Escape') {
            this.handleEscape();
            return;
        }

        // Movement — arrow keys and WASD. Only while a wall transition isn't in
        // flight-blocking state and no monster is on screen.
        if ((key === 'ArrowUp' || k === 'w') && this.hasForward && !this.monsterPresent) {
            this.moveForward();
            return;
        }

        if ((key === 'ArrowLeft' || k === 'a') && this.hasLeft && !this.monsterPresent) {
            this.moveLeft();
            return;
        }

        if ((key === 'ArrowRight' || k === 'd') && this.hasRight && !this.monsterPresent) {
            this.moveRight();
            return;
        }

        if ((key === 'ArrowDown' || k === 's') && !this.monsterPresent) {
            this.turnAround();
            return;
        }

        // HUD shortcuts. These open modals/alerts, so skip them while a monster
        // is present (the monster alert owns the screen) or when an overlay is
        // already on screen, to avoid stacking overlays. Only the four HUD keys
        // reach the async guard, so other keys stay fully synchronous.
        if (k === 'm' || k === 'h' || key === '?' || k === 'c' || k === 't') {
            this.handleHudShortcut(k, key);
        }
    }

    // Escape: dismiss the top HUD modal (map/help) if one is open, otherwise
    // dismiss any open alert. A mini-game modal on top is left alone — it has
    // no HUD_MODAL_ID, so getTop() returns it but we only dismiss on a matching
    // id, protecting the awaited win/lose flow.
    private async handleEscape() {
        const topModal = await this.modalController.getTop();
        if (topModal) {
            if (topModal.id === this.HUD_MODAL_ID) {
                await topModal.dismiss();
            }
            // A mini-game (or any untagged) modal owns the screen — don't close
            // it, and don't fall through to the alert handling behind it.
            return;
        }

        const topAlert = await this.alertController.getTop();
        if (topAlert) {
            this.clearAlerts();
        }
    }

    // Opens the HUD overlay for a shortcut key, but only when the screen is
    // clear. We ask Ionic's controllers for the actual top overlay rather than
    // tracking it ourselves — the alerts/modals arrays are only cleared on
    // death, so they can't tell us what's currently presented.
    private async handleHudShortcut(k: string, key: string) {
        if (this.monsterPresent) {
            return;
        }

        const [topModal, topAlert] = await Promise.all([
            this.modalController.getTop(),
            this.alertController.getTop()
        ]);
        if (topModal || topAlert) {
            return;
        }

        if (k === 'm') {
            this.openMap();
        } else if (k === 'h' || key === '?') {
            this.openInstructions();
        } else if (k === 'c') {
            this.showDirection();
        } else if (k === 't') {
            this.showTimer();
        }
    }
}
