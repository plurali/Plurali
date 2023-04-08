import dotenv from "dotenv";
import { EnvMissingException, EnvNotFoundException } from "./exceptions/EnvException";
import { UnexpectedValueException } from "./exceptions/ValidationException";

export interface Variables {
    NODE_ENV: string;
    HOST: string;
    PORT: string;
    CORS_ORIGIN: string;
    REDIS_HOST: string;
    REDIS_PASS: string;
}

export class Env<T extends { [key: string]: any }> {
    private _env: T;

    constructor() {
        const out = dotenv.config();

        console.warn("No .env file found, skipping dotenv")

        this._env = {
            ...process.env,
            ...(out.error ? (out.parsed as any) ?? {} : {})
        };
    }

    get<Throw extends boolean = true>(key: keyof T, throwException: Throw): Throw extends true ?  T[typeof key] : T[typeof key] | null {
        const value =  this._env[key] as T[typeof key];

        if (!value && throwException) {
            throw new EnvNotFoundException(String(key));
        }

        return value ?? null as any;
    }

    bool(key: keyof T): boolean {
        return this.get(key, true) === "true";
    }

    num(key: keyof T): number {
        const value = this.get(key, false);

        if (!value) {
           throw new UnexpectedValueException(Number, value);
        }

        const parsed = parseInt(value);

        if (isNaN(parsed)) {
            throw new UnexpectedValueException(Number, parsed);
        }

        return value;
    }

    get dev(): boolean {
        return this.get("NODE_ENV", false) === "development";
    }

    get prod(): boolean {
        return !this.dev;
    }
}

export const $env = new Env<Variables>();