import { UserDto } from '@plurali/common/src/dto'
import { AxiosResponse } from 'axios'
import { $axios, Response } from '.'
import { SuccessData } from '@plurali/backend/src/server/status'

export interface UserUpdateInput {
  pluralKey: string
}

export interface UserData extends SuccessData {
  user: UserDto
}

export const getUser = (): Promise<AxiosResponse<Response<UserData>>> =>
  $axios.request<Response<UserData>>({
    url: '/user',
    method: 'GET',
  })

export const updateUser = (
  data: UserUpdateInput
): Promise<AxiosResponse<Response<UserData>>> =>
  $axios.request<Response<UserData>>({
    url: '/user',
    method: 'POST',
    data,
  })
