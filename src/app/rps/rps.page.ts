import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
@Component({
    selector: 'app-rps',
    templateUrl: './rps.page.html',
    styleUrls: ['./rps.page.scss']
})
export class RpsPage implements OnInit {
    constructor(private modalController: ModalController) {}

    closeModal() {
        this.modalController.dismiss({ result: true });
    }
    ngOnInit() {}
}
