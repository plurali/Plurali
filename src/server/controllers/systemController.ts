import { controller } from "../plugins/controllers";
import {data, error, Status} from "../status";
import { withSystemContext } from "../contexts/systemContext";
import S from "fluent-json-schema";

export interface IdSchema {
    Params: {
        id: string
    }
}

export const idSchema = S.object().prop("params", S.object().prop("id", S.string().required()))

export default controller(async (server) => {
    server.get("/", async (req, res) =>
        withSystemContext(
            { req, res }, ({ system }) => res.send(data({ system }))
        )
    )

    server.get("/members", async (req, res) =>
        withSystemContext(
            { req, res }, async ({ members }) => res.send(data({ members: await members }))
        )
    )

    server.get<IdSchema>("/member/:id", {schema: idSchema.valueOf()}, async (req, res) =>
        withSystemContext(
            { req, res }, async ({ member: get }) => {
                const member = await get(req.params.id)
                if (!member) {
                    return res.status(400).send(error(Status.ResourceNotFound))
                }

                res.send(data({ member }))
            }
        )
    )
}, "/system");