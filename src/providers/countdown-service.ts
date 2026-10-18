import { Injectable } from '@angular/core';
import { timer, Subject, Observable } from 'rxjs';
import { takeWhile, map } from 'rxjs/operators';

@Injectable()
export class CountdownService {
    private _countdown = new Subject<number>();
    private isCounting = false;
    public count;
    private timer;
    public mapObservable = this._countdown.asObservable();
    countdown(): Observable<number> {
        return this.mapObservable;
    }
    stop() {
        this.timer.unsubscribe();
        this.isCounting = false;
    }

    /**
     * Apply a time penalty by lowering the countdown ceiling.
     *
     * The remaining time the stream emits is computed live as (count - elapsed)
     * and the timer completes via takeWhile(elapsed < count). So reducing
     * `count` by N both subtracts N seconds from what's shown and pulls the
     * end-point N seconds closer — a clean penalty with no extra state.
     *
     * Returns the approximate remaining seconds after the penalty so the caller
     * can trigger death if the clock has run out. (The timer's own completion
     * path doesn't signal death, so an out-of-time penalty must be handled by
     * the caller.)
     */
    penalize(seconds: number, elapsedRemaining: number): number {
        this.count = Math.max(0, this.count - seconds);
        return Math.max(0, elapsedRemaining - seconds);
    }

    start(): void {
        // Ensure that only one timer is in progress at any given time.
        if (!this.isCounting) {
            this.isCounting = true;
            this.timer = timer(0, 1000)
                .pipe(
                    takeWhile(t => t < this.count),
                    map(t => this.count - t)
                )
                .subscribe(t => this._countdown.next(t), null, () => {
                    this._countdown.complete();
                    this.isCounting = false;
                    // Reset the countdown Subject so that a
                    // countdown can be performed more than once.
                    this._countdown = new Subject<number>();
                });
        }
    }
}
