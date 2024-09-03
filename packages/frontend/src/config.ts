import { CurrencyCode } from "@code-wallet/library";

interface AppConfig {
    readonly hostname: string;

    readonly storeCurrency: CurrencyCode;
    readonly storeVerifier: string;
    readonly defaultPrice: string;

    readonly betaFlag: boolean;
}

export const useConfig = () : AppConfig => {
    // TODO: it's possible to use environment variables here rather than
    // hardcoding values. However, keep in mind that there are two entry points
    // and two different environments to consider (browser/SSR, dev/prod). It is
    // a bit more complex than just using `process.env`.

    // Keeping it simple for now (hardcoding values)

    return {
        hostname: 'pennypost.co',
        storeVerifier: '9k6B2zu9gN7TdENtSuzH6dAbePxKffDiQFnbzgFa2YA1',
        storeCurrency: 'usd',
        defaultPrice: '0.25',

        betaFlag: true, // Example of using a feature flag to enable something (search for "betaFlag" in the codebase)
    };

};