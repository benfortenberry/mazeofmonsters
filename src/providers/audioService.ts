import { Injectable } from '@angular/core';

interface Sound {
    key: string;
    asset: string;
    volume: number;
    loop: boolean;
    audio: HTMLAudioElement;
}

/**
 * Web audio service (HTML5 Audio).
 *
 * Each sound gets its own HTMLAudioElement so overlapping effects can coexist
 * and per-sound volume is preserved. Looping sounds (background music) are
 * handled with autoplay-policy awareness: a loop requested before the user has
 * interacted is retried on the next gesture, and a watchdog resumes a loop that
 * the browser pauses unexpectedly.
 */
@Injectable({
    providedIn: 'root'
})
export class AudioService {
    private sounds: Sound[] = [];

    // Browsers block audio that starts without a user gesture, so a loop()
    // requested during page/route init can be silently rejected. We remember
    // loops that haven't started yet and retry them on every user gesture until
    // one actually plays.
    private pendingLoopKeys: string[] = [];
    private webUnlockInstalled = false;
    private boundUnlock: () => void;

    // Keys meant to keep looping. If the browser pauses one (buffering stall,
    // tab backgrounding, autoplay re-gating), a watchdog resumes it.
    private loopingKeys: string[] = [];

    preload(key: string, asset: string, volume: number, _complex?: boolean): void {
        if (this.sounds.some(sound => sound.key === key)) {
            return;
        }
        const audio = new Audio();
        audio.volume = volume;
        audio.preload = 'auto';
        audio.src = asset;

        this.sounds.push({ key, asset, volume, loop: false, audio });
    }

    play(key: string): void {
        const sound = this.sounds.find(s => s.key === key);
        if (sound) {
            // Restart from the beginning so rapid repeats (clicks, hurts)
            // retrigger instead of being ignored while already playing.
            sound.audio.currentTime = 0;
            sound.audio.play().catch(() => {}); // ignore web player errors (e.g. autoplay gating)
        }
    }

    // Start a looping sound (e.g. background music).
    loop(key: string): void {
        const sound = this.sounds.find(s => s.key === key);
        if (sound) {
            // Queue the loop and try to start it right away. If we're inside the
            // user gesture that navigated here, it starts immediately; if the
            // browser still blocks it, the gesture listener retries on the next
            // touch/click/key.
            if (this.pendingLoopKeys.indexOf(key) === -1) {
                this.pendingLoopKeys.push(key);
            }
            this.installWebUnlockHandler();
            this.flushPendingLoops();
        }
    }

    // Stop a playing sound.
    stop(key: string): void {
        const sound = this.sounds.find(s => s.key === key);
        if (sound) {
            // Clear from both lists first so the watchdog doesn't immediately
            // resume this intentional stop.
            this.pendingLoopKeys = this.pendingLoopKeys.filter(k => k !== key);
            this.loopingKeys = this.loopingKeys.filter(k => k !== key);
            sound.audio.pause();
            sound.audio.currentTime = 0;
        }
    }

    // Adjust volume for a sound.
    setVolume(key: string, volume: number): void {
        const sound = this.sounds.find(s => s.key === key);
        if (sound) {
            sound.volume = volume;
            sound.audio.volume = volume;
        }
    }

    // --- autoplay unlock + loop watchdog ---------------------------------

    private installWebUnlockHandler(): void {
        if (typeof document === 'undefined' || this.webUnlockInstalled) {
            return;
        }
        this.webUnlockInstalled = true;
        this.boundUnlock = () => this.flushPendingLoops();
        document.addEventListener('pointerdown', this.boundUnlock);
        document.addEventListener('touchstart', this.boundUnlock);
        document.addEventListener('keydown', this.boundUnlock);
        document.addEventListener('click', this.boundUnlock);
    }

    private removeWebUnlockHandler(): void {
        if (typeof document === 'undefined' || !this.boundUnlock) {
            return;
        }
        document.removeEventListener('pointerdown', this.boundUnlock);
        document.removeEventListener('touchstart', this.boundUnlock);
        document.removeEventListener('keydown', this.boundUnlock);
        document.removeEventListener('click', this.boundUnlock);
    }

    private flushPendingLoops(): void {
        this.pendingLoopKeys.slice().forEach(key => {
            const sound = this.sounds.find(s => s.key === key);
            if (!sound) {
                return;
            }
            const audio = sound.audio;
            audio.loop = true;
            this.attachLoopWatchdog(key, audio);
            const attempt = audio.play();
            if (attempt && typeof attempt.then === 'function') {
                attempt.then(
                    () => {
                        if (this.loopingKeys.indexOf(key) === -1) {
                            this.loopingKeys.push(key);
                        }
                        this.pendingLoopKeys = this.pendingLoopKeys.filter(k => k !== key);
                        if (this.pendingLoopKeys.length === 0) {
                            this.removeWebUnlockHandler();
                        }
                    },
                    () => {
                        /* still blocked; leave queued and retry on next gesture */
                    }
                );
            } else {
                // Older browsers: play() returns undefined (no promise). Assume
                // it worked since we're inside a user gesture.
                if (this.loopingKeys.indexOf(key) === -1) {
                    this.loopingKeys.push(key);
                }
                this.pendingLoopKeys = this.pendingLoopKeys.filter(k => k !== key);
            }
        });
    }

    private attachLoopWatchdog(key: string, audio: HTMLAudioElement): void {
        if ((audio as any)._loopWatchdogAttached) {
            return;
        }
        (audio as any)._loopWatchdogAttached = true;
        audio.addEventListener('pause', () => {
            if (this.loopingKeys.indexOf(key) !== -1 && !audio.ended) {
                audio.play().catch(() => {});
            }
        });
    }
}
