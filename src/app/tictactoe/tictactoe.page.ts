import { Component, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
@Component({
    selector: 'app-tictactoe',
    templateUrl: './tictactoe.page.html',
    styleUrls: ['./tictactoe.page.scss']
})
export class TictactoePage implements OnInit {
    constructor(private modalController: ModalController) {}
    ngOnInit() {}

    closeModal() {
        this.modalController.dismiss({ result: true });
    }
}
