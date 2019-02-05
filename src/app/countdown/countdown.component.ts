import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    selector: 'app-progress',
    templateUrl: './countdown.component.html',
    styleUrls: ['./countdown.component.scss']
})
export class ProgressComponent implements OnInit, OnChanges {
    @Input() value: number;
    radius = 54;
    circumference = 2 * Math.PI * this.radius;
    dashoffset: number;

    constructor() {
        this.progress(0);
    }

    ngOnInit() {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes.value.currentValue !== changes.value.previousValue) {
            this.progress(changes.value.currentValue);
        }
    }

    private progress(value: number) {
        const progress = value / 900;
        this.dashoffset = this.circumference * (1 - progress);
    }
}
