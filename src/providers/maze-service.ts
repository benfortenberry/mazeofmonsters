import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createSeed } from './seededRandom';

/**
 * Loads static game data (monster lists) and owns the maze seed.
 *
 * The maze layout itself is no longer loaded from maze-routes.json. It is
 * generated procedurally in MazePage from a numeric seed that lives here so a
 * run is reproducible: dying and retrying, or reloading the page, rebuilds the
 * exact same maze. A fresh seed is rolled only when the player completes a maze
 * (WinPage) or explicitly starts a new game.
 */
@Injectable()
export class MazeProvider {
    imageUrl = './assets/monster-list.json';
    deathList = './assets/death.monster.list.json';

    private static readonly SEED_KEY = 'mom_maze_seed';

    constructor(public http: HttpClient) {}

    /**
     * Current maze seed. Reads the persisted seed if present; otherwise creates
     * and stores a new one. Call this when entering the maze so retries and
     * reloads reproduce the same layout.
     */
    getSeed(): number {
        let seed = this.readStoredSeed();
        if (seed === null) {
            seed = createSeed();
            this.writeStoredSeed(seed);
        }
        return seed;
    }

    /** Roll a brand-new maze. Called on completion / new game. */
    newSeed(): number {
        const seed = createSeed();
        this.writeStoredSeed(seed);
        return seed;
    }

    private readStoredSeed(): number | null {
        try {
            const raw = localStorage.getItem(MazeProvider.SEED_KEY);
            if (raw === null) {
                return null;
            }
            const parsed = Number(raw);
            return Number.isFinite(parsed) ? parsed >>> 0 : null;
        } catch (e) {
            // localStorage can throw in some privacy modes; fall back to a
            // volatile seed for this session only.
            return null;
        }
    }

    private writeStoredSeed(seed: number) {
        try {
            localStorage.setItem(MazeProvider.SEED_KEY, String(seed >>> 0));
        } catch (e) {
            // Non-fatal: without persistence the maze simply won't survive a
            // reload, but the current session still works.
        }
    }

    getImages() {
        return new Promise(resolve => {
            this.http.get(this.imageUrl).subscribe(
                data => {
                    resolve(data);
                },
                err => {
                    console.log(err);
                }
            );
        });
    }

    getDeathImages() {
        return new Promise(resolve => {
            this.http.get(this.deathList).subscribe(
                data => {
                    resolve(data);
                },
                err => {
                    console.log(err);
                }
            );
        });
    }
}
