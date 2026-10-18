import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { AudioService } from '../../providers/audioService';

@Component({
    standalone: false,
    selector: 'app-instructions',
    templateUrl: './instructions.page.html',
    styleUrls: ['./instructions.page.scss']
})
export class InstructionsPage implements OnInit {
    constructor(private modalController: ModalController, private aService: AudioService) {}

    ngOnInit() {}

    closeModal() {
        this.aService.play('clickAudio');
        this.modalController.dismiss();
    }
}
