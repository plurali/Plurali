import {User, UserData} from '@prisma/client'
import {FastifyRequest, FastifyReply} from 'fastify'
import {$db} from '../../db'
import {Status, ErrorResponse, error} from '../status'
import {System} from "../../system/System";
import {fetchMe} from "../../simplyApi/api/users";
import {Member} from "../../system/Member";
import {fetchMember, fetchMembers, getMember, transformMember} from "../../simplyApi/api/members";

interface UsePublicUserContext {
    req: FastifyRequest
    res?: FastifyReply
}

interface PublicUserContext {
    success: true,
    user: User & { data: UserData }
    system: System
    members: Promise<Member[]>

    member(id: string): Promise<Member | null>
}

/**
 * Creates the Public User Context and returns it,
 * if an error occurs it returns an ErrorResponse.
 *
 * @param {Omit<UsePublicUserContext, 'res'>}
 * @returns {PublicUserContext | ErrorResponse}
 */
const createPublicUserContext = async ({req}: Omit<UsePublicUserContext, 'res'>): Promise<PublicUserContext | ErrorResponse> => {
    const userId = (req.params as any).id
    if (!userId)
        return error(Status.ResourceNotFound)

    /**
     * Query the user by the ID in the params.
     */
    const user = await $db.user.findFirst({
        where: {
            OR: [
                {data: {slug: userId}},
                {id: userId}
            ],
            AND: {
                data: {
                    visible: true
                }
            }
        },
        include: {
            data: true
        }
    })

    if (!user) {
        return error(Status.ResourceNotFound)
    }

    const system = await fetchMe({user}, {data: {visible: true}});

    console.log(system)

    return {
        success: true,
        user,
        system,
        get members(): Promise<Member[]> {
            return fetchMembers({user}, system, {data: {visible: true}}, {data: {visible: true}})
        },
        async member(id: string): Promise<Member | null> {
            try {
                const userMember = await $db.userMember.findFirst({
                    where: {
                        OR: [
                            {data: {slug: id}},
                            {id}
                        ],
                        AND: {
                            pluralOwnerId: system.id,
                            data: {
                                visible: true,
                            }
                        }
                    },
                    include: {
                        data: true
                    }
                })

                return userMember ? await transformMember((await getMember({
                    user,
                    systemId: system.id,
                    memberId: userMember.pluralId
                })).data, system, userMember, {data: {visible: true}}) : null;
            } catch {
                return null;
            }
        }
    }
}

/**
 * Creates the Public User Context and passes it to the callback
 * passed in the first function.
 *
 * If an error occurs while fetching (eg. missing token, etc..),
 * the callback does not get executed and an error response gets sent.
 *
 * @param {UsePublicUserContext} deps
 * @param {(userCtx: PublicUserContext) => Promise<unknown>} fn The callback
 * @param errFn
 */
const withPublicUserContext = async (
    deps: UsePublicUserContext,
    fn: (userCtx: PublicUserContext) => Promise<unknown> | unknown,
    errFn?: () => unknown
) => {
    const context = await createPublicUserContext(deps)
    if (!context.success) {
        if (deps.res) return deps.res.send(context)
        return errFn?.()
    }

    return fn(context)
}

const withOptionalPublicUserContext = async (
    ctx: UsePublicUserContext,
    fn: (userCtx: PublicUserContext | null) => Promise<unknown> | unknown
) => {
    const context = await createPublicUserContext(ctx)
    return fn(context.success ? context : null)
}

export {
    UsePublicUserContext,
    PublicUserContext,
    withPublicUserContext,
    withOptionalPublicUserContext,
    createPublicUserContext,
}
