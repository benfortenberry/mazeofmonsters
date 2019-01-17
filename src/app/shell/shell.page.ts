import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
@Component({
    selector: 'app-shell',
    templateUrl: './shell.page.html',
    styleUrls: ['./shell.page.scss']
})
export class ShellPage implements OnInit {
    constructor(private modalController: ModalController) {}

    closeModal() {
        this.modalController.dismiss({ result: true });
    }

    ngOnInit() {}
}
