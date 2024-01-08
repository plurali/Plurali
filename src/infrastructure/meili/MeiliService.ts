import { MeiliConfig } from "@app/Config";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import MeiliClient from "meilisearch";

@Injectable()
export class MeiliService {
    public readonly client: MeiliClient;

    constructor(config: ConfigService) {
        const meiliConfig = config.get<MeiliConfig>("meili");

        this.client = new MeiliClient({
            host: meiliConfig.fullHost,
            apiKey: meiliConfig.masterKey,
        });
    }

    createIndexKey(nameOrNames: string[]|string) {
        return [nameOrNames].flat().join("_");
    }

    getIndex<T = Record<string, unknown>>(name: string[]|string) {
        return this.client.index<T>(this.createIndexKey(name));
    }
}