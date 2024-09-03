/**
 * Sleep for a given number of milliseconds.
 * @param ms The number of milliseconds to sleep.
 */
export async function sleep(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry a function with exponential backoff.
 * @param minDelay The minimum delay in milliseconds.
 * @param maxDelay The maximum delay in milliseconds.
 * @param fn 
 * @returns The return value of the function.
 */
export async function retry<T>(minDelay: number, maxDelay: number, fn: () => Promise<T>): Promise<T> {
    let delay = minDelay;
    while (true) {
        try {
            return await fn();
        } catch (err) {
            console.error(err);
            await sleep(delay);
            delay = Math.min(delay * 2, maxDelay);
        }

        console.log(`Retrying in ${delay}ms...`);
    }
}
