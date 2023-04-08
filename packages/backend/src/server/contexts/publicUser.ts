import { User } from '@prisma/client'
import { FastifyRequest, FastifyReply } from 'fastify'
import { $db } from '../../services/db'
import { Status, ErrorResponse, error } from '../status'
import { Member, System } from '@plurali/common/dist/system'
import { getMember } from '@plurali/common/dist/plural'
import { fetchMe, fetchMembers, transformMember } from '../../plural'

export interface UsePublicUserContext {
  req: FastifyRequest
  res?: FastifyReply
}

export interface PublicUserContext {
  success: true
  user: User
  system: System
  getSystemMembers: () => Promise<Member[]>
  getSystemMember: (id: string) => Promise<Member | null>
}

export const createPublicUserContext = async ({
  req,
}: Omit<UsePublicUserContext, 'res'>): Promise<PublicUserContext | ErrorResponse> => {
  const identifier = (req.params as any).id
  if (!identifier) return error(Status.ResourceNotFound)

  const user = await $db.user.findFirst({
    where: {
      slug: identifier,
      visible: true,
    },
  })
  if (!user) return error(Status.ResourceNotFound)

  const system = await fetchMe({ user }, { visible: true })

  return {
    success: true,
    user,
    system,
    async getSystemMembers(): Promise<Member[]> {
      return fetchMembers({ user }, system, { visible: true }, { visible: true })
    },
    async getSystemMember(id: string): Promise<Member | null> {
      try {
        const userMember = await $db.userMember.findFirst({
          where: {
            slug: id,
            pluralOwnerId: system.id,
            visible: true,
          },
        })

        return userMember
          ? await transformMember(
              (
                await getMember({ user, systemId: system.id, memberId: userMember.pluralId })
              ).data,
              system,
              userMember,
              { visible: true }
            )
          : null
      } catch {
        return null
      }
    },
  }
}

export const withPublicUserContext = async (
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

export const withOptionalPublicUserContext = async (
  ctx: UsePublicUserContext,
  fn: (userCtx: PublicUserContext | null) => Promise<unknown> | unknown
) => {
  const context = await createPublicUserContext(ctx)
  return fn(context.success ? context : null)
}