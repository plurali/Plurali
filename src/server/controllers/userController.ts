import { controller } from "../plugins/controllers";
import { data, error, Status } from "../status";
import { withUserContext } from "../contexts/userContext";
import { UserDto } from "../../db/UserDto";
import S from "fluent-json-schema";
import {getUser} from "../../simplyApi/api/users";
import { $db } from "../../db";
import {testKey} from "../../simplyApi/client";

export const userUpdateSchema = S.object()
    .prop("body", S.object()
        .prop("pluralKey", S.string())
    )

export interface UserUpdateSchema {
    Body: {
        pluralKey?: string
        overridePluralId?: string
    }
}

export default controller(async (server) => {
    server.get("/", async (req, res) =>
        withUserContext(
            { req, res }, ({ user }) => res.send(data({ user: UserDto.from(user) }))
        )
    )

    server.post<UserUpdateSchema>("/", { schema: userUpdateSchema.valueOf() }, async (req, res) =>
        withUserContext({ req, res }, async ({ user }) => {
            if ('pluralKey' in req.body) {
                const pluralKey = req.body.pluralKey;
                if (typeof pluralKey !== "string" || !(await testKey(pluralKey))) {
                    await $db.user.update({ where: { id: user.id }, data: { pluralKey: null } })
                    return res.status(400).send(error(Status.InvalidPluralKey));
                }

                user = await $db.user.update({ where: { id: user.id }, data: { pluralKey } })
            }

            if (typeof req.body.overridePluralId === "string") {
                const overridePluralId = req.body.overridePluralId;
                if (!user.admin) {
                    return res.status(400).send(error(Status.Unauthorized));
                }
                if (!(await getUser({user, id: overridePluralId}))) {
                    return res.status(400).send(error(Status.ResourceNotFound))
                }
                user = await $db.user.update({ where: { id: user.id }, data: { overridePluralId } })
            }

            res.send(data({
                user: UserDto.from(user)
            }))
        })
    )
}, "/user");