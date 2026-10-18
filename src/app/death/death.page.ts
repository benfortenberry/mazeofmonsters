import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, IonRouterOutlet } from '@ionic/angular';
import { MazeProvider } from '../..//providers/maze-service';
import { AudioService } from '../../providers/audioService';

// Yabdib's taunt tailored to the creature you've been turned into. Each entry
// is three beats matching the reveal timing: the transformation landing, a
// twist, and a closing note. Keyed by the death image filename so the words fit
// the picture on screen. No em dashes (house style).
interface DeathTaunt {
    first: string;
    second: string;
    third: string;
}

const DEATH_TAUNTS: { [img: string]: DeathTaunt } = {
    'boss_goblinbigboss.png': {
        first: 'Look at the size of you now. A warlord of my little horde.',
        second: 'The others will follow you. Into the walls, never out of them.',
        third: "A big boss for my collection. You'll do."
    },
    'boss_thenightmother.png': {
        first: 'Rise, Nightmother. The dark has been waiting for a face.',
        second: 'They will whisper your name and never find your door.',
        third: 'My finest piece yet.'
    },
    'boss_voidelemental.png': {
        first: 'There is so little of you left. Good. The void prefers it empty.',
        second: 'You will drift these halls as a cold nothing, remembering warmth.',
        third: 'The collection has needed a void for ages.'
    },
    'monster_crystalgolem.png': {
        first: 'Hold still while you set. Stone first, then the shine.',
        second: "You'll stand in a corridor for a hundred years and call it rest.",
        third: 'A crystal guard. Beautiful. Mine.'
    },
    'monster_deepelf.png': {
        first: 'The dark suits you. It is taking your eyes last, so you can watch.',
        second: "You'll hear the next wanderer and be unable to warn them.",
        third: 'Welcome down deep, with the rest of my collection.'
    },
    'monster_demilich.png': {
        first: 'The flesh goes. The grudge stays. That is the whole trick.',
        second: 'You will rattle these halls long after your name is forgotten.',
        third: 'A lich for the shelf. Lovely.'
    },
    'monster_devilkin.png': {
        first: 'Little horns, little tail. The maze does enjoy a devilkin.',
        second: "You'll torment the next guest, and hate yourself for it.",
        third: 'Another imp of mine. Welcome.'
    },
    'monster_dragonwhelp.png': {
        first: 'Feel the scales come in? You wanted claws. Now you have them.',
        second: "You'll guard a hallway that leads nowhere, forever hungry.",
        third: 'A whelp for the collection. It will grow.'
    },
    'monster_fireelemental.png': {
        first: 'Burn, then. Quietly. The walls do not scorch for anyone.',
        second: 'You will light corners no one comes to, and gutter out alone.',
        third: 'Fire for my collection. How warm.'
    },
    'monster_goblinveteran.png': {
        first: 'A soldier now. Scarred before your first patrol.',
        second: 'You will march these halls and never once reach the gate.',
        third: 'A veteran for the ranks. Mine.'
    },
    'monster_imp.png': {
        first: 'Small and spiteful. The maze had a space exactly your size.',
        second: 'You will trip the next wanderer and giggle, and mean none of it.',
        third: 'An imp for the collection. Fitting.'
    },
    'monster_minotaur.png': {
        first: 'Hold still. The horns are setting.',
        second: 'A maze needs a monster at its heart. You will do nicely.',
        third: 'Welcome to the collection, bull.'
    },
    'monster_ooze.png': {
        first: 'No bones for you. Only the slow and the formless.',
        second: 'You will seep into the cracks and watch feet pass above.',
        third: 'An ooze for my collection. Charming.'
    },
    'monster_ratling.png': {
        first: 'Whiskers already. You always did scurry.',
        second: 'You will know every tunnel and still never find the way out.',
        third: 'A ratling for the walls. Welcome.'
    },
    'monster_treefolk.png': {
        first: 'Feel your feet take root. You will not be walking out.',
        second: 'A hundred rings from now you will still be facing this wall.',
        third: 'Treefolk for the collection. Patient. Mine.'
    },
    'monster_werewolfcub.png': {
        first: 'A pup. The fur comes first, the hunger soon after.',
        second: 'You will howl at a moon these halls have never shown.',
        third: 'A young wolf for the collection. It will do.'
    }
};

// Generic fallback if an image has no tailored taunt (e.g. art added later).
const DEFAULT_TAUNT: DeathTaunt = {
    first: 'Hold still. The change is nearly done.',
    second: 'You will want to warn the next one who wanders in. You never can.',
    third: "Welcome to Yabdib's collection."
};

@Component({
    standalone: false,
    selector: 'app-death',
    templateUrl: './death.page.html',
    styleUrls: ['./death.page.scss']
})
export class DeathPage implements OnInit {
    monsterImageUrl;
    monsterImageList;

    // The three taunt lines for the creature on screen, revealed in sequence.
    taunt: DeathTaunt = DEFAULT_TAUNT;

    firstLine;
    secondLine;
    thirdLine;
    buttonReady;

    constructor(public navCtrl: NavController, public mazeProvider: MazeProvider, private aService: AudioService) {
        this.getImages();
    }

    tryAgain() {
        this.aService.play('clickAudio');
        this.navCtrl.navigateRoot('maze');
    }

    async getImages() {
        this.mazeProvider.getDeathImages().then(response => {
            this.monsterImageList = response['monsters'];

            const chosen = this.monsterImageList[Math.floor(Math.random() * this.monsterImageList.length)];
            // Match the taunt to the creature on screen; fall back if unmapped.
            this.taunt = DEATH_TAUNTS[chosen] || DEFAULT_TAUNT;
            this.monsterImageUrl = 'url(../../assets/death/' + chosen + ')';

            // Reveal the taunt only after the creature (and its matching text)
            // is chosen, so the words and the image always land together.
            this.revealTaunt();
        });
    }

    private revealTaunt() {
        setTimeout(() => {
            this.firstLine = true;
        }, 200);

        setTimeout(() => {
            this.secondLine = true;
        }, 1750);

        setTimeout(() => {
            this.thirdLine = true;
            this.buttonReady = true;
        }, 4000);
    }

    ngOnInit() {}

    ionViewDidEnter() {
        this.aService.play('loseAudio');
    }
}
