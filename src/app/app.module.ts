import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';

import { MazeProvider } from '../providers/maze-service';
import { CountdownService } from '../providers/countdown-service';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

@NgModule({
    declarations: [AppComponent],
    entryComponents: [],
    imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule, HttpClientModule, BrowserAnimationsModule],
    providers: [
        StatusBar,
        SplashScreen,
        NativeAudio,
        ScreenOrientation,
        { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
        MazeProvider,
        CountdownService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
