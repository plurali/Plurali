import { FastifyInstance } from "fastify";
import type { FastifyError, FastifyRequest, FastifyReply } from "fastify";

export type ErrorHandler = Parameters<FastifyInstance["setErrorHandler"]>[0];

/**
 * Error Handler
 *
 * @param {FastifyError} e
 * @param {FastifyRequest} req
 * @param {FastifyReply} res
 */
export const errorHandler: ErrorHandler = (e: FastifyError, req: FastifyRequest, res: FastifyReply) => {
    // ...
};
