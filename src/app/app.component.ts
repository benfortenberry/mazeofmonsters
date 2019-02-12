import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { enableProdMode } from '@angular/core';
import { AudioService } from '../providers/audioService';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
enableProdMode();
@Component({
    selector: 'app-root',
    templateUrl: 'app.component.html'
})
export class AppComponent {
    constructor(
        private platform: Platform,
        private splashScreen: SplashScreen,
        private statusBar: StatusBar,
        private screenOrientation: ScreenOrientation,
        private aService: AudioService,
        private nativeAudio: NativeAudio
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.platform.ready().then(() => {
            this.statusBar.styleLightContent();
            this.statusBar.isVisible = false;

            this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
            this.aService.preload('backgroundAudio', 'assets/audio/theme.ogg', 0.2, true);
            this.aService.preload('clickAudio', 'assets/audio/click11.wav', 1, true);

            this.aService.preload('fire', 'assets/audio/Fire.mp3', 1, true);
            this.aService.preload('dragon', 'assets/audio/grunt1.wav', 1, true);
            this.aService.preload('goblin', 'assets/audio/click11.wav', 1, true);

            this.aService.preload('lichlord', 'assets/audio/Magic Smite.wav', 1, true);
            this.aService.preload('naga', 'assets/audio/painb.wav', 1, true);
            this.aService.preload('orc', 'assets/audio/deathb.wav', 1, true);

            this.aService.preload('ratman', 'assets/audio/MonsterCreaturesVoiceSound005.mp3', 1, true);
            this.aService.preload('treefolk', 'assets/audio/2.wav', 1, true);
            this.aService.preload('troll', 'assets/audio/3.wav', 1, true);

            this.aService.preload('zombie', 'assets/audio/1.wav', 1, true);

            this.aService.preload('loseAudio', 'assets/audio/lose music 1 - 1_0.wav', 0.5, true);
            this.aService.preload('woopAudio', 'assets/audio/Socapex - hurt.wav', 1, true);
            this.aService.preload('matchAudio', 'assets/audio/dingCling-positive.ogg', 1, true);
            this.aService.preload('beepAudio', 'assets/audio/beep.wav', 1, true);
            this.aService.preload('winAudio', 'assets/audio/HappyMusic.ogg', 0.5, true);
            this.splashScreen.hide();
        });
    }
}
