import {controller} from "../plugins/controllers";
import {data, error, Status} from "../status";
import S from "fluent-json-schema";
import {withPublicUserContext} from "../contexts/publicUserContext";

export interface IdSchema {
    Params: {
        id: string
    }
}

export interface MemberIdSchema {
    Params: {
        id: string
        memberId: string
    }
}

export const idSchema = S.object().prop("params", S.object().prop("id", S.string().required()))

export const memberIdSchema = S.object().prop("params", S.object().prop("id", S.string().required()).prop("memberId", S.string().required()))

export default controller(async (server) => {
    server.get<IdSchema>("/:id", {schema: idSchema.valueOf()}, async (req, res) =>
        withPublicUserContext({req, res}, async ({system}) => res.send(data({system}))))

    server.get<IdSchema>("/:id/members", {schema: idSchema.valueOf()}, async (req, res) =>
        withPublicUserContext({req, res}, async ({members}) => {
            res.send(data({members: await members}))
        })
    )

    server.get<MemberIdSchema>("/:id/members/:memberId", {schema: memberIdSchema.valueOf()}, async (req, res) =>
        withPublicUserContext({req, res}, async ({member: get}) => {
            const member = await get(req.params.memberId);
            if (!member) {
                return res.status(400).send(error(Status.ResourceNotFound))
            }
            res.send(data({member}))
        })
    )
}, "/public/system");