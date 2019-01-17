import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
@Component({
    selector: 'app-memory',
    templateUrl: './memory.page.html',
    styleUrls: ['./memory.page.scss']
})
export class MemoryPage implements OnInit {
    constructor(private modalController: ModalController) {}

    ngOnInit() {}

    closeModal() {
        this.modalController.dismiss({ result: false });
    }
}
