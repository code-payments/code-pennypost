import { Keypair } from '@code-wallet/library';
import dotenv from 'dotenv';

interface AppConfig {
    readonly prod: boolean;

    readonly hostname: string;
    readonly port: number | string;
    readonly base: string;

    readonly storeCurrency: string;
    readonly storeVerifier: string;

    readonly defaultCost: number;
    readonly codeSequencerPublicKey: string;

    getVerifierKeypair(): Keypair;
}

dotenv.config();

export const useConfig = () : AppConfig => {

    const env = getEnvValues();
    const prod = env.NODE_ENV === 'production';
    const port = env.PORT || 3000;
    const base = '/app/';

    const hostname = env.STORE_HOSTNAME || 'pennypost.co';
    const secret = new Uint8Array(Buffer.from(env.STORE_VERIFIER_SECRET, 'hex'));
    const verifier = Keypair.fromRawPrivateKey(secret);

    const config = {
        prod,
        hostname,
        port,
        base,

        storeCurrency: env.STORE_CURRENCY,
        storeVerifier: verifier.getPublicKey().toBase58(),

        defaultCost: parseFloat(env.DEFAULT_COST),
        codeSequencerPublicKey: env.CODE_SEQUENCER_PUBLIC_KEY,

        getVerifierKeypair(): Keypair {
            return Keypair.fromRawPrivateKey(secret);
        }
    };

    return config;
};

type CheckedEnv = {
    NODE_ENV: string;
    PORT: string;
    STORE_HOSTNAME: string;
    STORE_CURRENCY: string;
    STORE_VERIFIER_SECRET: string;
    CODE_SEQUENCER_PUBLIC_KEY: string;
    DEFAULT_COST: string;
};

function getEnvValues() {
    if (!process.env.STORE_HOSTNAME) {
        throw new Error('Missing HOSTNAME environment variable');
    }

    if (!process.env.PORT) {
        throw new Error('Missing PORT environment variable');
    }

    if (!process.env.STORE_CURRENCY) {
        throw new Error('Missing STORE_CURRENCY environment variable');
    }

    if (!process.env.STORE_VERIFIER_SECRET) {
        throw new Error('Missing STORE_VERIFIER_SECRET environment variable');
    }

    if (!process.env.CODE_SEQUENCER_PUBLIC_KEY) {
        throw new Error('Missing CODE_SEQUENCER_PUBLIC_KEY environment variable');
    }

    if (!process.env.DEFAULT_COST) {
        throw new Error('Missing DEFAULT_COST environment variable');
    }

    return process.env as CheckedEnv;
}
