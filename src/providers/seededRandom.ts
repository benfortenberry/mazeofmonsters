/**
 * Deterministic, seedable pseudo-random number generator for the maze.
 *
 * Why this exists: the maze is generated procedurally, but a single run must be
 * reproducible. If the player dies and retries, they should re-enter the *same*
 * maze, and a page reload must not reshuffle the walls underneath them. We get
 * that by generating every maze from a stored numeric seed instead of the
 * non-reproducible Math.random(). Roll a new seed only when the player finishes
 * a maze (or explicitly starts a new game).
 *
 * mulberry32 is a tiny, fast 32-bit generator with good-enough distribution for
 * maze carving. It is not cryptographically secure and does not need to be.
 */
export class SeededRandom {
    private state: number;

    constructor(seed: number) {
        // Force to an unsigned 32-bit integer so behavior is stable across
        // platforms regardless of how the seed was produced.
        this.state = seed >>> 0;
    }

    /** Next float in the half-open range [0, 1), same contract as Math.random(). */
    next(): number {
        this.state = (this.state + 0x6d2b79f5) >>> 0;
        let t = this.state;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    }

    /** Integer in [0, maxExclusive). */
    nextInt(maxExclusive: number): number {
        return Math.floor(this.next() * maxExclusive);
    }
}

/** Produce a fresh random seed for starting a brand-new maze. */
export function createSeed(): number {
    return (Math.floor(Math.random() * 0xffffffff)) >>> 0;
}
