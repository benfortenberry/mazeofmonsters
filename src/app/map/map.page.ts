import { Component, OnInit, Input } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';
@Component({
    selector: 'app-map',
    templateUrl: './map.page.html',
    styleUrls: ['./map.page.scss']
})
export class MapPage implements OnInit {
    currentRoom = null;
    routes;
    htmlToAdd = '';
    safeHtml;

    routeHistory = null;
    mazeData = null;

    clickAudio = new Audio();

    constructor(
        private navParams: NavParams,
        private sanitizer: DomSanitizer,
        private modalController: ModalController
    ) {
        this.clickAudio.src = '../../assets/audio/ui click 11 [2018-10-13 162315].wav';
        this.clickAudio.load();
    }

    ionViewWillEnter() {
        this.generate();
    }

    generate() {
        // console.log(this.routeHistory);

        this.routes = [];
        const disp = this.mazeData;
        for (let i = 0; i < disp.length; i++) {
            this.htmlToAdd = this.htmlToAdd + '<tr>';
            for (let j = 0; j < disp[i].length; j++) {
                // check if in route history to choose wether to show

                const routeId = i + '-' + j;

                let showRoute;

                const found = this.routeHistory.find(function(r) {
                    return r === routeId;
                });
                if (found) {
                    showRoute = true;
                }

                // showRoute = true;

                this.htmlToAdd = this.htmlToAdd + '<td style="text-align:center; height:20px; width:20px;';
                if (disp[i][j][0] === 0 && showRoute) {
                    this.htmlToAdd = this.htmlToAdd + 'border-top:solid 2px #f7f7f7;';
                } else {
                }
                if (disp[i][j][1] === 0 && showRoute) {
                    this.htmlToAdd = this.htmlToAdd + 'border-right:solid 2px #f7f7f7;';
                } else {
                }
                if (disp[i][j][2] === 0 && showRoute) {
                    this.htmlToAdd = this.htmlToAdd + 'border-bottom:solid 2px #f7f7f7;';
                } else {
                }
                if (disp[i][j][3] === 0 && showRoute) {
                    this.htmlToAdd = this.htmlToAdd + 'border-left:solid 2px #f7f7f7;';
                } else {
                }

                this.htmlToAdd = this.htmlToAdd + '"  id="' + i + '-' + j + '">&nbsp;</td>';
            }
            this.htmlToAdd = this.htmlToAdd + '</tr>';
        }
        this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(this.htmlToAdd);
        // console.log(this.routes);

        setTimeout(() => {
            document.getElementById('39-39').innerHTML = '<ion-icon style="color:#ffd400" name="home"></ion-icon>';
            document.getElementById(this.currentRoom).innerHTML =
                '<ion-icon style="color:#ffd400" name="star"></ion-icon>';
        }, 100);
    }

    ngOnInit() {
        this.mazeData = this.navParams.get('mazeData');
        this.routeHistory = this.navParams.get('routeHistory');
        this.currentRoom = this.navParams.get('currentRoom');
    }

    closeModal() {
        this.clickAudio.play();
        this.modalController.dismiss();
    }
}
