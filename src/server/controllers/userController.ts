import {controller} from "../plugins/controllers";
import {data, error, Status} from "../status";
import {withUserContext} from "../contexts/userContext";
import {UserDto} from "../../db/UserDto";
import S from "fluent-json-schema";
import {fetchUser} from "../../simplyApi/api/users";
import {$db} from "../../db";
import {testKey} from "../../simplyApi/client";
import {Prisma} from "@prisma/client";
import {syncWithApi} from "../../simplyApi/sync";

export const userUpdateSchema = S.object()
    .prop("body", S.object()
        .prop("pluralKey", S.string().minLength(32).default(null))
        .prop("overridePluralId", S.string().minLength(1).default(null))
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
            {req, res}, ({user}) => res.send(data({user: UserDto.from(user)}))
        )
    )

    server.post<UserUpdateSchema>("/", {schema: userUpdateSchema.valueOf()}, async (req, res) =>
        withUserContext({req, res}, async ({user}) => {
            const input: Prisma.UserUpdateInput = {};
            if (req.body.pluralKey) {
                if (!(await testKey(req.body.pluralKey))) {
                    return res.status(400).send(error(Status.InvalidPluralKey));
                }
                input.pluralKey = req.body.pluralKey;
            } else {
                input.pluralKey = null;
            }

            if (req.body.overridePluralId) {
                if (!user.admin) {
                    return res.status(400).send(error(Status.Unauthorized));
                }
                if (!(await fetchUser({user, id: req.body.overridePluralId}))) {
                    return res.status(400).send(error(Status.UserUpdate.InvalidOverride))
                }
                input.overridePluralId = req.body.overridePluralId;
            } else {
                input.overridePluralId = null;
            }

            user = await $db.user.update({
                where: {id: user.id},
                data: input,
            });

            user = await syncWithApi(user);

            res.send(data({
                user: UserDto.from(user)
            }))
        })
    )
}, "/user");