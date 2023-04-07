import { FastifyInstance, FastifyPluginAsync } from "fastify";
import fp from "fastify-plugin";
import { sync as glob } from "glob";
import path from "path";
import { __app, __root } from "../../constants";

export interface ControllersPluginOpts {
    paths: string[];
}

export interface ControllerConfig {
    plugin: FastifyPluginAsync;
    prefix: string;
}

export const controller = (plugin: FastifyPluginAsync, prefix: string = "/") => ({
    plugin,
    prefix,
});

/**
 * Controller Plugin
 */
export const controllers = fp<ControllersPluginOpts>(async (server, { paths }) => {
    const globPaths = paths.map((path) => glob(path.replace(/\\/g, "/"))).flat(1)

    const controllers: ControllerConfig[] = (await Promise.all(
        globPaths.map((pth) => import(path.join(__root, pth)).then((module) => module.default))
    )).filter((val) => !!val && typeof val === "object");

    for (const { plugin, prefix } of controllers) {
        server.register(plugin, {
            prefix,
        });
    }
});
