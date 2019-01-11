import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-generate',
    templateUrl: './generate.page.html',
    styleUrls: ['./generate.page.scss']
})
export class GeneratePage implements OnInit {
    //type a is a north south only route
    //type b is a east west only route
    //type c has north, south and east
    ids = [1436, 1477, 1518, 1559, 1600, 1641];
    directions = ['n', 's', 'e', 'w'];
    paths = [];
    constructor() {}

    generate() {
        this.ids.forEach(id => {
            const path = {};
            path['id'] = id;
            path['routes'] = [];
            this.directions.forEach(dir => {
                path['routes'].push({
                    direction: dir,
                    doors: []
                });
            });

            this.paths.push(path);
        });

        console.log(JSON.stringify(this.paths));
        console.log(this.paths);
    }

    ngOnInit() {}
}
