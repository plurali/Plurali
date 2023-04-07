import { controller } from "../plugins/controllers";
import { data, error, Status } from "../status";
import { withSystemContext } from "../contexts/systemContext";
import { withUserContext } from "../contexts/userContext";
import { UserDto } from "../../db/UserDto";
import S from "fluent-json-schema";
import { testKey } from "../../simplyApi/api/users";
import { $db } from "../../db";

export const userUpdateSchema = S.object()
    .prop("body", S.object()
        .prop("pluralKey", S.string())
    )

export interface UserUpdateSchema {
    Body: {
        pluralKey?: string
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

            res.send(data({
                user: UserDto.from(user)
            }))
        })
    )
}, "/user");