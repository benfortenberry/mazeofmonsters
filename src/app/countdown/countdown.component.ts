import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';

@Component({
    standalone: false,
    selector: 'app-progress',
    templateUrl: './countdown.component.html',
    styleUrls: ['./countdown.component.scss']
})
export class ProgressComponent implements OnInit, OnChanges {
    @Input() value: number;
    // Total time the ring represents; the fill is value / total. Defaults to
    // 900 so existing usage is unchanged, but the maze passes its MAZE_SECONDS
    // so the ring stays correct if the timer length is tuned.
    @Input() total = 900;
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
        const progress = this.total > 0 ? value / this.total : 0;
        this.dashoffset = this.circumference * (1 - progress);
    }
}
