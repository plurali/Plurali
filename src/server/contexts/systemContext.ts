import {FastifyRequest, FastifyReply} from 'fastify'
import {fetchMember, fetchMembers} from '../../simplyApi/api/members'
import {fetchMe} from '../../simplyApi/api/users'
import {Member} from '../../system/Member'
import {System} from '../../system/System'
import {Status, ErrorResponse, error} from '../status'
import {createUserContext, UserContext} from './userContext'

interface UseSystemContext {
    req: FastifyRequest
    res?: FastifyReply
}

interface SystemContext extends UserContext {
    system: System
    members: Promise<Member[]>
    member: (id: string) => Promise<Member | null>
}

/**
 * Creates the System Context and returns it,
 * if an error occurs it returns an ErrorResponse.
 *
 * @param {Omit<UseSystemContext, 'res'>}
 * @returns {SystemContext | ErrorResponse}
 */
const createSystemContext = async ({
                                       req,
                                   }: Omit<UseSystemContext, 'res'>): Promise<SystemContext | ErrorResponse> => {
    const userContext = await createUserContext({req});
    // typechecking forced me to write this fuck you
    if (userContext.success === false) return userContext;

    if (!userContext.user.pluralKey) {
        return error(Status.PluralKeyNotSpecified);
    }

    const system = await fetchMe({key: userContext.user.pluralKey});

    if (!system) {
        return error(Status.InvalidPluralKey);
    }

    return {
        ...userContext,
        system,
        get members(): Promise<Member[]> {
            return fetchMembers({key: userContext.user.pluralKey}, system)
        },
        async member(id: string): Promise<Member | null> {
            return fetchMember({key: userContext.user.pluralKey, id}, system)
        }
    }
}

/**
 * Creates the System Context and passes it to the callback
 * passed in the first function.
 *
 * If an error occurs while fetching (eg. missing token, etc..),
 * the callback does not get executed and an error response gets sent.
 *
 * @param {(systemCtx: SystemContext) => Promise<unknown>} fn The callback
 * @param {UseSystemContext} deps The required dependencies for SystemContext
 */
const withSystemContext = async (
    ctx: UseSystemContext,
    fn: (systemCtx: SystemContext) => Promise<unknown> | unknown,
    errFn?: () => unknown
) => {
    const context = await createSystemContext(ctx)
    if (!context.success) {
        if (ctx.res) return ctx.res.send(context)
        return errFn?.()
    }

    return fn(context)
}

const withOptionalSystemContext = async (
    ctx: UseSystemContext,
    fn: (systemCtx: SystemContext | null) => Promise<unknown> | unknown
) => {
    const context = await createSystemContext(ctx)
    return fn(context.success ? context : null)
}

export {
    UseSystemContext,
    SystemContext,
    withSystemContext,
    withOptionalSystemContext,
    createSystemContext,
}
