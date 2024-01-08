import { MeiliService } from "@infra/meili/MeiliService";
import { Injectable } from "@nestjs/common";
import { System } from "@prisma/client";
import { SearchIndexPrefix } from "./SearchIndexPrefix";
import { MemberMeiliDoc } from "./documents/MemberMeiliDoc";

@Injectable()
export class SearchService {
    constructor(
        private readonly meili: MeiliService,
    ) {
    }

    getIndexForSystem(system: System | string) {
        return this.meili.getIndex<MemberMeiliDoc>([SearchIndexPrefix.System, typeof system === "string" ? system : system.id])
    }

    async reindexMembers(system: System | string, members: MemberMeiliDoc[]) {
        const index = this.getIndexForSystem(system);
        await index.deleteAllDocuments();

        return await index.addDocuments(members);
    }

    async findSystemMembers(system: System | string, query: string) {
        const index = this.getIndexForSystem(system);
        return (await index.search(query)).hits;
    }

    async findAllMembers(system: System | string) {
        const index = this.getIndexForSystem(system);
        return await index.getDocuments({});
    }
}