import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-generate',
    templateUrl: './generate.page.html',
    styleUrls: ['./generate.page.scss']
})
export class GeneratePage implements OnInit {
    constructor() {}

    w;
    h;
    map;
    nextCell;
    startY;
    startX;
    gridMap;
    gridH;
    gridW;

    generate() {
        console.log('generate');
        this.maze(5, 5, undefined, 4, 7);
        console.log(this.gridMap);
    }

    maze(w, h, nextCell, startX, startY) {
        console.log('maze');
        this.w = isNaN(w) || w < 5 || w > 999 ? 20 : w;
        this.h = isNaN(h) || h < 5 || h > 999 ? 20 : h;

        this.map = new Array();
        for (let mh = 0; mh < h; ++mh) {
            this.map[mh] = new Array();

            for (let mw = 0; mw < w; ++mw) {
                this.map[mh][mw] = { n: 0, s: 0, e: 0, w: 0, v: 0 };
            }
        }

        this.nextCell =
            typeof nextCell === 'undefined' || (nextCell !== 'first' && nextCell !== ' last' && nextCell !== 'random')
                ? 'random'
                : nextCell;

        this.startX = isNaN(startX) || startX < 0 || startX >= w ? 0 : startX;
        this.startY = isNaN(startY) || startY < 0 || startY >= h ? 0 : startY;

        this.build();
    }

    build() {
        console.log('build');
        const c = new Array();
        c.push({ x: this.startX, y: this.startY });

        this.map[this.startY][this.startX]['v'] = 1;

        const modDir = {
            n: { y: -1, x: 0, o: 's' },
            s: { y: 1, x: 0, o: 'n' },
            w: { y: 0, x: -1, o: 'e' },
            e: { y: 0, x: 1, o: 'w' }
        };

        while (c.length > 0) {
            const i =
                this.nextCell === 'first'
                    ? 0
                    : this.nextCell === 'last'
                    ? c.length - 1
                    : Math.floor((Math.random() * 10000) % c.length);
            const cell = c[i];

            const n = new Array();
            if (cell.x > 0 && this.map[cell.y][cell.x - 1]['v'] === 0) {
                n.push('w');
            }
            if (cell.x < this.w - 1 && this.map[cell.y][cell.x + 1]['v'] === 0) {
                n.push('e');
            }
            if (cell.y > 0 && this.map[cell.y - 1][cell.x]['v'] === 0) {
                n.push('n');
            }
            if (cell.y < this.h - 1 && this.map[cell.y + 1][cell.x]['v'] === 0) {
                n.push('s');
            }

            if (n.length === 0) {
                c.splice(i, 1);
                continue;
            }

            const dir = n[Math.floor((Math.random() * 10000) % n.length)];

            const destX = cell.x + modDir[dir].x;
            const destY = cell.y + modDir[dir].y;

            this.map[cell.y][cell.x][dir] = 1;
            this.map[destY][destX][modDir[dir].o] = 1;
            this.map[destY][destX]['v'] = 1;
            c.push({ x: destX, y: destY });
        }

        this.toGrid();
    }

    toGrid() {
        console.log('to grid');
        const grid = new Array();
        for (let mh = 0; mh < this.h * 2 + 1; ++mh) {
            grid[mh] = new Array();
            for (let mw = 0; mw < this.w * 2 + 1; ++mw) {
                grid[mh][mw] = 0;
            }
        }

        for (let y = 0; y < this.h; ++y) {
            const py = y * 2 + 1;

            for (let x = 0; x < this.w; ++x) {
                const px = x * 2 + 1;

                grid[py][px] = 1;

                if (this.map[y][x]['n'] === 1) {
                    grid[py - 1][px] = 1;
                }
                if (this.map[y][x]['s'] === 1) {
                    grid[py + 1][px] = 1;
                }
                if (this.map[y][x]['e'] === 1) {
                    grid[py][px + 1] = 1;
                }
                if (this.map[y][x]['w'] === 1) {
                    grid[py][px - 1] = 1;
                }
            }
        }

        this.gridMap = grid;
        this.gridW = grid.length;
        this.gridH = grid[0].length;
    }

    ngOnInit() {}
}
