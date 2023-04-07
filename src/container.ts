import { PrismaClient } from "@prisma/client";
import { FastifyInstance } from "fastify";
import { Container, setContainer } from "contairy";
import { $server } from "./server";
import { $db } from "./db";
import { $env } from "./Env";

export interface ServiceContainer {
    db: PrismaClient;
    server: FastifyInstance;
    [key: string]: unknown;
}

export const $container = new Container<ServiceContainer>({
    db: $db,
    server: $server,
    env: $env
})

setContainer($container);

export const services = (): ServiceContainer => <ServiceContainer>$container._services;

export const $s = (name: keyof ServiceContainer): ServiceContainer[typeof name] => services()[name];