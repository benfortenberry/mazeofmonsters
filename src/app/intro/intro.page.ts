import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, IonRouterOutlet } from '@ionic/angular';
@Component({
    selector: 'app-intro',
    templateUrl: './intro.page.html',
    styleUrls: ['./intro.page.scss']
})
export class IntroPage implements OnInit {
    constructor(public navCtrl: NavController) {}

    ngOnInit() {}

    beginMaze() {
        this.navCtrl.navigateForward('maze');
    }
}
