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
