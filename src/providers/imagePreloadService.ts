import { Injectable } from '@angular/core';

/**
 * Warms images into the browser cache, fetched AND decoded so they're
 * paint-ready (not just downloaded). Used to eliminate the first-show "pop" on
 * CSS-background art across the mini-games — decoding ahead of time means the
 * image renders instantly the first time an element uses it.
 */
@Injectable({
    providedIn: 'root'
})
export class ImagePreloadService {
    // Remember what we've already warmed so repeated calls are cheap no-ops.
    private done = new Set<string>();
    // Keep references so decoded bitmaps aren't garbage-collected before use.
    private held: HTMLImageElement[] = [];

    decode(urls: string[]): Promise<void> {
        const jobs = urls
            .filter(src => !this.done.has(src))
            .map(src => {
                this.done.add(src);
                const img = new Image();
                img.src = src;
                this.held.push(img);
                if (typeof img.decode === 'function') {
                    return img.decode().catch(() => {});
                }
                return new Promise<void>(resolve => {
                    img.onload = () => resolve();
                    img.onerror = () => resolve();
                });
            });
        return Promise.all(jobs).then(() => undefined);
    }
}
