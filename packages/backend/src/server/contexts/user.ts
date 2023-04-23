import { User } from '@prisma/client'
import { ObjectId } from 'bson'
import { FastifyRequest, FastifyReply } from 'fastify'
import { $db } from '../../services/db/index.js'
import { Status, ErrorResponse, error } from '../status.js'

export interface UserContextDeps {
  req: FastifyRequest
  res?: FastifyReply
}

export interface UserContext {
  success: true
  user: User
}

export const createUserContext = async ({ req }: UserContextDeps): Promise<UserContext | ErrorResponse> => {
  const userId = req.session.get('userId')
  if (!userId || !ObjectId.isValid(userId)) return error(Status.NotAuthenticated)

  const user = await $db.user.findUnique({ where: { id: userId } })

  if (!user) {
    return error(Status.NotAuthenticated)
  }

  return {
    success: true,
    user,
  }
}

export const withUserContext = async (
  ctx: UserContextDeps,
  fn: (userCtx: UserContext) => Promise<unknown> | unknown,
  errFn?: () => unknown
) => {
  const context = await createUserContext(ctx)
  if (!context.success) {
    if (ctx.res) return ctx.res.status(401).send(context)
    return errFn?.()
  }

  return fn(context)
}

export const withOptionalUserContext = async (
  ctx: UserContextDeps,
  fn: (userCtx: UserContext | null) => Promise<unknown> | unknown
) => {
  const context = await createUserContext(ctx)
  return fn(context.success ? context : null)
}