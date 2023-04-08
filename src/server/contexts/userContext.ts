import {User} from '@prisma/client'
import { FastifyRequest, FastifyReply } from 'fastify'
import { $db } from '../../db'
import { Status, ErrorResponse, error } from '../status'

interface UseUserContext {
    req: FastifyRequest
    res?: FastifyReply
}

interface UserContext {
    success: true,
    user: User,
}

/**
 * Creates the User Context and returns it,
 * if an error occurs it returns an ErrorResponse.
 *
 * @param {Omit<UseUserContext, 'res'>}
 * @returns {UserContext | ErrorResponse}
 */
const createUserContext = async ({
    req,
}: Omit<UseUserContext, 'res'>): Promise<UserContext | ErrorResponse> => {
    const userId = req.session.get('userId')

    if (!userId)
        return error(Status.NotAuthenticated)

    /**
     * Query the user by the ID in the session.
     */
    const user = await $db.user.findUnique({
        where: {
            id: userId,
        },
    })

    if (!user) {
        return error(Status.NotAuthenticated)
    }

    return {
        success: true,
        user,
    }
}

/**
 * Creates the User Context and passes it to the callback
 * passed in the first function.
 *
 * If an error occurs while fetching (eg. missing token, etc..),
 * the callback does not get executed and an error response gets sent.
 *
 * @param {(userCtx: UserContext) => Promise<unknown>} fn The callback
 * @param {UseUserContext} deps The required dependencies for UserContext
 */
const withUserContext = async (
    ctx: UseUserContext,
    fn: (userCtx: UserContext) => Promise<unknown> | unknown,
    errFn?: () => unknown
) => {
    const context = await createUserContext(ctx)
    if (!context.success) {
        if (ctx.res) return ctx.res.send(context)
        return errFn?.()
    }

    return fn(context)
}

const withOptionalUserContext = async (
    ctx: UseUserContext,
    fn: (userCtx: UserContext | null) => Promise<unknown> | unknown
) => {
    const context = await createUserContext(ctx)
    return fn(context.success ? context : null)
}

export {
    UseUserContext,
    UserContext,
    withUserContext,
    withOptionalUserContext,
    createUserContext,
}
