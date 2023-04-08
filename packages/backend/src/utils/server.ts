import { FastifyPluginAsync } from 'fastify'
import S from 'fluent-json-schema'
import { __app, __root } from '../constants'

// Common Schemas

export interface IdSchema {
  Params: {
    id: string
  }
}

export const idSchema = S.object().prop('params', S.object().prop('id', S.string().required()))

export interface SystemBaseDataSchema extends IdSchema {
  Body: {
    visible?: boolean
    description?: string
  }
}

export const systemBaseDataSchema = { ...idSchema }.prop(
  'body',
  S.object().prop('visible', S.boolean()).prop('description', S.string())
)

// Controllers

export interface ControllersPluginOpts {
  paths: string[]
}

export interface ControllerConfig {
  plugin: FastifyPluginAsync
  prefix: string
}

export const controller = (plugin: FastifyPluginAsync, prefix = '/') => ({
  plugin,
  prefix,
})
