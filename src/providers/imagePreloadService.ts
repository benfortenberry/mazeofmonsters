import { Injectable } from '@angular/core';

/**
 * Warms images into the browser cache, fetched AND decoded so they're
 * paint-ready (not just downloaded). Used to eliminate the first-show "pop" on
 * CSS-background art, and to drive an accurate loading bar on the intro: every
 * image is a decode() promise, so progress is a real decoded/total count.
 */
@Injectable({
    providedIn: 'root'
})
export class ImagePreloadService {
    // Remember what we've already warmed so repeated calls are cheap no-ops.
    private done = new Set<string>();
    // Keep references so decoded bitmaps aren't garbage-collected before use.
    private held: HTMLImageElement[] = [];

    /**
     * Fetch + decode every url. Returns a promise that resolves when all are
     * settled. Optional onProgress(loaded, total) fires after each image
     * settles so a caller can render a true progress bar.
     */
    decode(urls: string[], onProgress?: (loaded: number, total: number) => void): Promise<void> {
        const total = urls.length;
        let loaded = 0;

        const tick = () => {
            loaded++;
            if (onProgress) {
                onProgress(loaded, total);
            }
        };

        const jobs = urls.map(src => {
            if (this.done.has(src)) {
                // Already warmed — count it immediately so progress stays honest.
                tick();
                return Promise.resolve();
            }
            this.done.add(src);
            const img = new Image();
            img.src = src;
            this.held.push(img);

            let p: Promise<any>;
            if (typeof img.decode === 'function') {
                p = img.decode().catch(() => {});
            } else {
                p = new Promise<void>(resolve => {
                    img.onload = () => resolve();
                    img.onerror = () => resolve();
                });
            }
            return p.then(() => tick());
        });

        // Edge case: nothing to load — report complete immediately.
        if (total === 0 && onProgress) {
            onProgress(0, 0);
        }

        return Promise.all(jobs).then(() => undefined);
    }
}
