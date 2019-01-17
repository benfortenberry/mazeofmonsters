import { Component, OnInit } from '@angular/core';
import { AlertController, NavController, IonRouterOutlet } from '@ionic/angular';

@Component({
    selector: 'app-death',
    templateUrl: './death.page.html',
    styleUrls: ['./death.page.scss']
})
export class DeathPage implements OnInit {
    constructor(public navCtrl: NavController) {}

    tryAgain() {
        this.navCtrl.navigateForward('intro');
    }

    ngOnInit() {}
}
