import fastify from "fastify";
import cors from "@fastify/cors";
import {$env} from "../Env";
import view from "@fastify/view"
import session from "@fastify/secure-session";
import {controllers} from "./plugins/controllers";
import {__app} from "../constants";
import {Liquid} from "liquidjs";
import path from "path";
import {existsSync, readFileSync} from "fs";
import {createSecret} from "../secret";

const server = fastify({
    logger: {
        // Pretty printing log output in development
        transport: $env.dev ? {target: "pino-pretty"} : undefined,
    },
});

server.register(cors, {
    origin: $env.get("CORS_ORIGIN", false) ?? "*",
    credentials: true
});

// server.setErrorHandler(errorHandler);

server.register(controllers, {
    paths: [process[Symbol.for("ts-node.register.instance")] ? "src/server/controllers/*.{ts,js}" : "dist/server/controllers/*.{ts,js}"],
});

server.register(view, {
    engine: {
        liquid: new Liquid({
            root: path.join(__app, "server/views"),
            extname: ".liquid",
        }),
    },
    root: path.join(__app, "server/views"),
});

const sessionKeyPath = path.join(__app, '..', '.session_key')

if (!existsSync(sessionKeyPath)) {
    createSecret(sessionKeyPath)
}

server.register(session, {
    cookieName: "_session",
    key: readFileSync(sessionKeyPath),
    cookie: {
        path: '/',
    },
})

export {server as $server};
