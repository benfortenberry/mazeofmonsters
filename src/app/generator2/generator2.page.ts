import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { HostListener } from '@angular/core';
@Component({
    selector: 'app-generator2',
    templateUrl: './generator2.page.html',
    styleUrls: ['./generator2.page.scss']
})
export class Generator2Page implements OnInit {
    htmlToAdd = '';
    safeHtml;
    currentRoom;
    currentRoute;
    routes;
    hasLeft;
    hasTop;
    hasBottom;
    hasRight;
    currentDirection = 'n';

    constructor(private sanitizer: DomSanitizer) {}

    generate() {
        this.currentRoom = '0-0';
        this.routes = [];
        const disp = this.newMaze(40, 40);
        // console.log(disp);
        // console.log(disp.length);
        for (let i = 0; i < disp.length; i++) {
            this.htmlToAdd = this.htmlToAdd + '<tr>';
            // $('#maze > tbody').append("<tr>");
            for (let j = 0; j < disp[i].length; j++) {
                const routeId = i + '-' + j;

                const routeObj = { id: routeId };

                // console.log('2nd for');
                // const selector = i + '-' + j;
                this.htmlToAdd = this.htmlToAdd + '<td style="height:20px; width:20px;';
                // $('#maze > tbody').append("<td id='" + selector + "'>&nbsp;</td>");
                if (disp[i][j][0] === 0) {
                    routeObj['wallTop'] = true;
                    this.htmlToAdd = this.htmlToAdd + 'border-top:solid 2px black;';
                } else {
                    routeObj['wallTop'] = false;
                }
                if (disp[i][j][1] === 0) {
                    routeObj['wallRight'] = true;
                    this.htmlToAdd = this.htmlToAdd + 'border-right:solid 2px black;';
                } else {
                    routeObj['wallRight'] = false;
                }
                if (disp[i][j][2] === 0) {
                    routeObj['wallBottom'] = true;
                    this.htmlToAdd = this.htmlToAdd + 'border-bottom:solid 2px black;';
                } else {
                    routeObj['wallBottom'] = false;
                }
                if (disp[i][j][3] === 0) {
                    routeObj['wallLeft'] = true;
                    this.htmlToAdd = this.htmlToAdd + 'border-left:solid';
                } else {
                    routeObj['wallLeft'] = false;
                }

                let wallCount = 0;

                if (routeObj['wallTop']) {
                    wallCount++;
                }
                if (routeObj['wallLeft']) {
                    wallCount++;
                }
                if (routeObj['wallRight']) {
                    wallCount++;
                }
                if (routeObj['wallBottom']) {
                    wallCount++;
                }

                // console.log(wallCount);
                if (wallCount === 3) {
                    routeObj['monster'] = true;
                }

                this.routes.push(routeObj);

                this.htmlToAdd =
                    this.htmlToAdd + '" onmouseover="style.backgroundColor=\'red\'" title="' + i + '-' + j + '"></td>';
            }
            this.htmlToAdd = this.htmlToAdd + '</tr>';

            // $('#maze > tbody').append('</tr>');
        }
        // console.log(this.routes);
        this.safeHtml = this.sanitizer.bypassSecurityTrustHtml(this.htmlToAdd);
        // console.log(this.routes);
        this.getRoute('0-0');
    }

    getRoute(routeId) {
        if (routeId == '2-2') {
            alert('win');
        } else {
            this.currentRoute = this.routes.find(x => x.id === routeId);
            // console.log(this.currentRoute);
            let hasTop, hasBottom, hasLeft, hasRight;

            if (this.currentDirection === 'n') {
                hasTop = !this.currentRoute['wallTop'];
                hasRight = !this.currentRoute['wallRight'];
                hasBottom = !this.currentRoute['wallBottom'];
                hasLeft = !this.currentRoute['wallLeft'];
            }

            if (this.currentDirection === 's') {
                hasTop = !this.currentRoute['wallBottom'];
                hasRight = !this.currentRoute['wallLeft'];
                hasBottom = !this.currentRoute['wallTop'];
                hasLeft = !this.currentRoute['wallRight'];
            }

            if (this.currentDirection === 'e') {
                hasTop = !this.currentRoute['wallRight'];
                hasRight = !this.currentRoute['wallBottom'];
                hasBottom = !this.currentRoute['wallLeft'];
                hasLeft = !this.currentRoute['wallTop'];
            }

            if (this.currentDirection === 'w') {
                hasTop = !this.currentRoute['wallLeft'];
                hasRight = !this.currentRoute['wallTop'];
                hasBottom = !this.currentRoute['wallRight'];
                hasLeft = !this.currentRoute['wallBottom'];
            }

            this.hasTop = hasTop;
            this.hasBottom = hasBottom;
            this.hasRight = hasRight;
            this.hasLeft = hasLeft;
        }
    }

    newMaze(x, y) {
        // Establish variables and starting grid
        const totalCells = x * y;
        const cells = new Array();
        const unvis = new Array();
        for (let i = 0; i < y; i++) {
            cells[i] = new Array();
            unvis[i] = new Array();
            for (let j = 0; j < x; j++) {
                cells[i][j] = [0, 0, 0, 0];
                unvis[i][j] = true;
            }
        }

        // Set a random position to start from
        let currentCell = [Math.floor(Math.random() * y), Math.floor(Math.random() * x)];
        const path = [currentCell];
        unvis[currentCell[0]][currentCell[1]] = false;
        let visited = 1;

        // Loop through all available cell positions
        while (visited < totalCells) {
            // Determine neighboring cells
            const pot = [
                [currentCell[0] - 1, currentCell[1], 0, 2],
                [currentCell[0], currentCell[1] + 1, 1, 3],
                [currentCell[0] + 1, currentCell[1], 2, 0],
                [currentCell[0], currentCell[1] - 1, 3, 1]
            ];
            const neighbors = new Array();

            // Determine if each neighboring cell is in game grid, and whether it has already been checked
            for (let l = 0; l < 4; l++) {
                if (pot[l][0] > -1 && pot[l][0] < y && pot[l][1] > -1 && pot[l][1] < x && unvis[pot[l][0]][pot[l][1]]) {
                    neighbors.push(pot[l]);
                }
            }

            // If at least one active neighboring cell has been found
            if (neighbors.length) {
                // Choose one of the neighbors at random
                const next = neighbors[Math.floor(Math.random() * neighbors.length)];

                // Remove the wall between the current cell and the chosen neighboring cell
                cells[currentCell[0]][currentCell[1]][next[2]] = 1;
                cells[next[0]][next[1]][next[3]] = 1;

                // Mark the neighbor as visited, and set it as the current cell
                unvis[next[0]][next[1]] = false;
                visited++;
                currentCell = [next[0], next[1]];
                path.push(currentCell);
            } else {
                // Otherwise go back up a step and keep going

                currentCell = path.pop();
            }
        }
        return cells;
    }

    @HostListener('document:keyup', ['$event'])
    handleKeyboardEvent(event: KeyboardEvent) {
        const splitCoords = this.currentRoom.split('-');
        // console.log(splitCoords);

        let currentY = +splitCoords[0];
        let currentX = +splitCoords[1];
        // console.log(event.key);
        const key = event.key;

        if (key === 'ArrowUp' && this.hasTop) {
            //   this.move('f');
            if (this.currentDirection == 's') {
                currentY++;
            }

            if (this.currentDirection === 'e') {
                currentX++;
            }

            if (this.currentDirection === 'w') {
                currentX--;
            }

            if (this.currentDirection === 'n') {
                currentY--;
            }

            this.currentRoom = currentY + '-' + currentX;
            this.getRoute(this.currentRoom);
        }

        if (key === 'ArrowLeft' && this.hasLeft) {
            // this.move('l');
            if (this.currentDirection === 'n') {
                currentX--;
                this.currentDirection = 'w';
            } else if (this.currentDirection === 's') {
                currentX++;
                this.currentDirection = 'e';
            } else if (this.currentDirection === 'e') {
                currentY--;
                this.currentDirection = 'n';
            } else if (this.currentDirection === 'w') {
                currentY++;
                this.currentDirection = 's';
            }
            this.currentRoom = currentY + '-' + currentX;
            this.getRoute(this.currentRoom);
        }

        if (key === 'Enter') {
            // this.clearAlerts();
        }

        if (key === 'ArrowRight' && this.hasRight) {
            if (this.currentDirection === 'n') {
                currentX++;
                this.currentDirection = 'e';
            } else if (this.currentDirection === 's') {
                currentX--;
                this.currentDirection = 'w';
            } else if (this.currentDirection === 'e') {
                currentY++;
                this.currentDirection = 's';
            } else if (this.currentDirection === 'w') {
                currentY--;
                this.currentDirection = 'n';
            }

            this.currentRoom = currentY + '-' + currentX;
            this.getRoute(this.currentRoom);
            //   this.move('r');
            // currentX++;
        }

        if (key === 'ArrowDown') {
            if (this.currentDirection === 'n') {
                this.currentDirection = 's';
            } else if (this.currentDirection === 's') {
                this.currentDirection = 'n';
            } else if (this.currentDirection === 'e') {
                this.currentDirection = 'w';
            } else if (this.currentDirection === 'w') {
                this.currentDirection = 'e';
            }

            this.getRoute(this.currentRoom);
            // currentY++;
            // this.clearAlerts();
            //  this.move('back');
        }
    }

    ngOnInit() {}
}
