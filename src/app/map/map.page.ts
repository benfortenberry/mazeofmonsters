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
    currentDirection;
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

                this.htmlToAdd = this.htmlToAdd + '<td style="text-align:center;  height:20px; width:20px;';
                if (disp[i][j][0] === 0 && showRoute) {
                    this.htmlToAdd = this.htmlToAdd + 'background-color:#754c2e;border-top:solid 2px #fff;';
                } else {
                }
                if (disp[i][j][1] === 0 && showRoute) {
                    this.htmlToAdd = this.htmlToAdd + 'background-color:#754c2e;border-right:solid 2px #fff;';
                } else {
                }
                if (disp[i][j][2] === 0 && showRoute) {
                    this.htmlToAdd = this.htmlToAdd + 'background-color:#754c2e;border-bottom:solid 2px #fff;';
                } else {
                }
                if (disp[i][j][3] === 0 && showRoute) {
                    this.htmlToAdd = this.htmlToAdd + 'background-color:#754c2e;border-left:solid 2px #fff;';
                } else {
                }

                this.htmlToAdd = this.htmlToAdd + '"  id="' + i + '-' + j + '">&nbsp;</td>';
            }
            this.htmlToAdd = this.htmlToAdd + '</tr>';
        }
        this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(this.htmlToAdd);
        // console.log(this.routes);

        setTimeout(() => {
            document.getElementById('29-29').innerHTML = '<ion-icon style="color:#fff" name="star"></ion-icon>';

            if (this.currentDirection === 's') {
                document.getElementById(this.currentRoom).innerHTML =
                    '<ion-icon style="color:#fff" name="person"></ion-icon>';
            }

            if (this.currentDirection === 'n') {
                document.getElementById(this.currentRoom).innerHTML =
                    '<ion-icon style="color:#fff;   transform: rotate(-180deg);" name="person"></ion-icon>';
            }

            if (this.currentDirection === 'w') {
                document.getElementById(this.currentRoom).innerHTML =
                    '<ion-icon style="color:#fff; transform: rotate(90deg);" name="person"></ion-icon>';
            }

            if (this.currentDirection === 'e') {
                document.getElementById(this.currentRoom).innerHTML =
                    '<ion-icon style="color:#fff; transform: rotate(-90deg);" name="person"></ion-icon>';
            }
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
