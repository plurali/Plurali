import {controller} from "../plugins/controllers";
import {data, error, Status} from "../status";
import {withSystemContext} from "../contexts/systemContext";
import S from "fluent-json-schema";
import {$db} from "../../db";
import {transformMemberField} from "../../simplyApi/api/users";

export interface IdSchema {
    Params: {
        id: string
    },
}

export interface FieldSchema extends IdSchema {
    Body: {
        visible?: boolean
        description?: string
    }
}

export const idSchema = S.object()
    .prop("params", S.object().prop("id", S.string().required()))

export const fieldSchema = {...idSchema}
    .prop("body", S.object().prop("visible", S.boolean()).prop("description", S.string()))

export default controller(async (server) => {
    server.get("/", async (req, res) =>
        withSystemContext(
            {req, res}, ({system}) => res.send(data({system}))
        )
    )

    server.get("/members", async (req, res) =>
        withSystemContext(
            {req, res}, async ({members}) => res.send(data({members: await members}))
        )
    )

    server.get<IdSchema>("/member/:id", {schema: idSchema.valueOf()}, async (req, res) =>
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

    server.post<FieldSchema>("/field/:id", {schema: fieldSchema.valueOf()}, async (req, res) =>
        withSystemContext(
            {req, res}, async ({system, member: get}) => {
                let field = await $db.userField.findFirst({
                    where: {
                        pluralId: req.params.id,
                        pluralOwnerId: system.id
                    },
                    include: {
                        data: true
                    }
                })

                if (!field) {
                    return res.status(400).send(error(Status.ResourceNotFound))
                }

                field = await $db.userField.update({
                    where: {
                        id: field.id
                    },
                    data: {
                        data: {
                            update: {
                                ...(typeof req.body.visible === 'boolean' ? { visible: req.body.visible } : {}),
                                ...(req.body.description?.trim().length >= 1 ? { visible: req.body.visible } : {})
                            }
                        }
                    },
                    include: {
                        data: true
                    }
                })

                res.send(data({field: transformMemberField(field.pluralId, system, field.data)}))
            }
        )
    )
}, "/system");