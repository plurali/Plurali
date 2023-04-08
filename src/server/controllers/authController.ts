import { controller } from "../plugins/controllers";
import { S } from "fluent-json-schema"
import { RouteGenericInterface } from "fastify/types/route";
import bcrypt from "bcrypt";
import { $db } from "../../db";
import { data, error, Status } from "../status";
import { UserDto } from "../../db/UserDto";
import {syncWithApi} from "../../simplyApi/sync";

const authSchema = S.object()
    .prop(
        "body",
        S.object()
            .prop("username", S.string().required())
            .prop("password", S.string().required())
    )

export interface AuthSchema extends RouteGenericInterface {
    Body: {
        username: string;
        password: string;
    }
}

export default controller(async (server) => {
    server.put<AuthSchema>("/register", { schema: authSchema.valueOf() }, async (req, res) => {
        const { username, password } = req.body;

        if (!!(await $db.user.findUnique({ where: { username } }))) {
            return res.status(400).send({
                error: 'This username is already used!'
            })
        }

        const user = await $db.user.create({
            data: {
                username,
                passwordHash: await bcrypt.hash(password, 10),
                visible: false,
            }
        })

        req.session.set("userId", user.id);

        return res.send(data({
            user
        }))
    })

    server.post<AuthSchema>("/login", { schema: authSchema.valueOf() }, async (req, res) => {
        const { username, password } = req.body;

        const user = await $db.user.findUnique({
            where: {
                username
            },
        })

        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            return res.status(400).send(error(Status.Login.InvalidCredentials))
        }

        await syncWithApi(user);

        req.session.set("userId", user.id);

        res.send(data({
            user: UserDto.from(user)
        }))
    })

    server.post<AuthSchema>("/logout", { schema: authSchema.valueOf() }, async (req, res) => {
        req.session.delete();

        res.send(data({
            message: 'ok'
        }))
    })
}, "/auth");