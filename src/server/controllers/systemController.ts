import {controller} from "../plugins/controllers";
import {data, error, Status} from "../status";
import {withSystemContext} from "../contexts/systemContext";
import S from "fluent-json-schema";
import {$db} from "../../db";
import {fetchMe, transformMemberField} from "../../simplyApi/api/users";

export interface IdSchema {
    Params: {
        id: string
    },
}

export interface FieldAndMemberSchema extends IdSchema {
    Body: {
        visible?: boolean
        description?: string
    }
}

export interface SystemSchema {
    Body: FieldAndMemberSchema["Body"]
}

export const idSchema = S.object()
    .prop("params", S.object().prop("id", S.string().required()))

export const fieldAndMemberSchema = {...idSchema}
    .prop("body", S.object().prop("visible", S.boolean()).prop("description", S.string()))

export const systemSchema = S.object()
    .prop("body", S.object().prop("visible", S.boolean()).prop("description", S.string()))

export default controller(async (server) => {
    server.get("/", async (req, res) =>
        withSystemContext(
            {req, res}, ({system}) => res.send(data({system}))
        )
    )

    server.post<SystemSchema>("/", {schema: systemSchema.valueOf()}, async (req, res) =>
        withSystemContext(
            {req, res}, async ({user}) => {
                user = await $db.user.update({
                    where: {
                        id: user.id
                    },
                    data: {
                        ...(typeof req.body.visible === 'boolean' ? {visible: req.body.visible} : {}),
                        ...(req.body.description?.trim().length >= 1 ? {visible: req.body.visible} : {})
                    },
                })

                res.send(data({system: await fetchMe({user})}))
            }
        )
    )

    server.get("/members", async (req, res) =>
        withSystemContext(
            {req, res}, async ({members}) => res.send(data({members: await members}))
        )
    )

    server.get<IdSchema>("/members/:id", {schema: idSchema.valueOf()}, async (req, res) =>
        withSystemContext(
            {req, res}, async ({member: get}) => {
                const member = await get(req.params.id)
                if (!member) {
                    return res.status(400).send(error(Status.ResourceNotFound))
                }

                res.send(data({member}))
            }
        )
    )

    server.post<FieldAndMemberSchema>("/members/:id", {schema: fieldAndMemberSchema.valueOf()}, async (req, res) =>
        withSystemContext(
            {req, res}, async ({system, member: get}) => {
                const member = await $db.userMember.findFirst({
                    where: {
                        pluralId: req.params.id,
                        pluralOwnerId: system.id
                    },
                })

                if (!member) {
                    return res.status(400).send(error(Status.ResourceNotFound))
                }

                await $db.userMember.update({
                    where: {
                        id: member.id
                    },
                    data: {
                        ...(typeof req.body.visible === 'boolean' ? {visible: req.body.visible} : {}),
                        ...(req.body.description?.trim().length >= 1 ? {visible: req.body.visible} : {})
                    },
                })

                res.send(data({member: await get(req.params.id)}))
            }
        )
    )

    server.get("/fields", async (req, res) =>
        withSystemContext(
            {req, res}, async ({system}) => res.send(data({fields: system.fields}))
        )
    )

    server.post<FieldAndMemberSchema>("/fields/:id", {schema: fieldAndMemberSchema.valueOf()}, async (req, res) =>
        withSystemContext(
            {req, res}, async ({system, member: get}) => {
                let field = await $db.userField.findFirst({
                    where: {
                        pluralId: req.params.id,
                        pluralOwnerId: system.id
                    },
                })

                if (!field) {
                    return res.status(400).send(error(Status.ResourceNotFound))
                }

                field = await $db.userField.update({
                    where: {
                        id: field.id
                    },
                    data: {
                        ...(typeof req.body.visible === 'boolean' ? {visible: req.body.visible} : {}),
                        ...(req.body.description?.trim().length >= 1 ? {visible: req.body.visible} : {})
                    },
                })

                res.send(data({field: transformMemberField(field.pluralId, system, field)}))
            }
        )
    )
}, "/system");