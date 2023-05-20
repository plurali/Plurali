import { AxiosResponse } from 'axios'
import { $axios } from '.'
import type { Status } from '@app/v1/dto/Status'
import type { SystemResponse } from '@app/v1/dto/user/system/response/SystemResponse'
import type { SystemMemberResponse } from '@app/v1/dto/user/system/response/SystemMemberResponse'
import type { SystemMembersResponse } from '@app/v1/dto/user/system/response/SystemMembersResponse'

export const getSystem = (systemId: string): Promise<AxiosResponse<Status<SystemResponse>>> =>
  $axios.request<Status<SystemResponse>>({
    url: `/public/system/${systemId}`,
    method: 'GET',
  })

export const getMember = (
  systemId: string,
  memberId: string
): Promise<AxiosResponse<Status<SystemMemberResponse>>> =>
  $axios.request<Status<SystemMemberResponse>>({
    url: `/public/system/${systemId}/members/${memberId}`,
    method: 'GET',
  })

export const getMembers = (
  systemId: string
): Promise<AxiosResponse<Status<SystemMembersResponse>>> =>
  $axios.request<Status<SystemMembersResponse>>({
    url: `/public/system/${systemId}/members`,
    method: 'GET',
  })
