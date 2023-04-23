import { FastifyRequest, FastifyReply } from 'fastify'
import { Status, ErrorResponse, error } from '../status.js'
import { createUserContext, UserContext } from './user.js'
import { Member, System } from '@plurali/common/dist/system/index.js'
import { fetchMe, fetchMember, fetchMembers } from '../../plural/index.js'

interface SystemContextDeps {
  req: FastifyRequest
  res?: FastifyReply
}

interface SystemContext extends UserContext {
  system: System
  getSystemMembers: () => Promise<Member[]>
  getSystemMember: (id: string) => Promise<Member | null>
}

export const createSystemContext = async ({ req }: SystemContextDeps): Promise<SystemContext | ErrorResponse> => {
  const userContext = await createUserContext({
    req,
  })
  // typechecking forced me to write this fuck you
  if (userContext.success === false) return userContext

  if (!userContext.user.pluralKey) {
    return error(Status.PluralKeyNotSpecified)
  }

  const system = await fetchMe(userContext)

  if (!system) {
    return error(Status.InvalidPluralKey)
  }

  return {
    ...userContext,
    system,
    async getSystemMembers(): Promise<Member[]> {
      return await fetchMembers(userContext, system)
    },
    async getSystemMember(id: string): Promise<Member | null> {
      return await fetchMember({ user: userContext.user, id }, system)
    },
  }
}

export const withSystemContext = async (
  deps: SystemContextDeps,
  fn: (systemCtx: SystemContext) => Promise<unknown> | unknown,
  errFn?: () => unknown
) => {
  const context = await createSystemContext(deps)
  if (!context.success) {
    if (deps.res) return deps.res.send(context)
    return errFn?.()
  }

  return fn(context)
}

export const withOptionalSystemContext = async (
  ctx: SystemContextDeps,
  fn: (systemCtx: SystemContext | null) => Promise<unknown> | unknown
) => {
  const context = await createSystemContext(ctx)
  return fn(context.success ? context : null)
}