import { UserDto } from '@plurali/common/src/dto'
import { AxiosResponse } from 'axios'
import { $axios, Response } from '.'

export interface UserUpdateInput {
  pluralKey: string
}

export interface UserData {
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
