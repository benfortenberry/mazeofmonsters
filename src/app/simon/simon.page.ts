import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
@Component({
    selector: 'app-simon',
    templateUrl: './simon.page.html',
    styleUrls: ['./simon.page.scss']
})
export class SimonPage implements OnInit {
    constructor(private modalController: ModalController) {}
    ngOnInit() {}

    closeModal() {
        this.modalController.dismiss({ result: true });
    }
}
