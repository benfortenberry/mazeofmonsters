import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { enableProdMode } from '@angular/core';
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
        private nativeAudio: NativeAudio
    ) {
        this.initializeApp();
    }

    initializeApp() {
        this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);

        this.platform.ready().then(() => {
            this.statusBar.styleLightContent();
            this.statusBar.isVisible = false;
            this.nativeAudio.preloadComplex('backgroundAudio', '../../assets/audio/theme.ogg', 0.2, 1, 0);
            // if (this.platform.is('desktop')) {

            // } else {
            // desktop browser only code
            // }

            this.splashScreen.hide();
        });
    }
}
