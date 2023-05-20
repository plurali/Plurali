import type { UpdateSystemRequest } from '@app/v1/dto/user/system/request/UpdateSystemRequest';
import type { SystemResponse } from '@app/v1/dto/user/system/response/SystemResponse';
import type { SystemMemberResponse } from '@app/v1/dto/user/system/response/SystemMemberResponse';
import type { SystemMembersResponse } from '@app/v1/dto/user/system/response/SystemMembersResponse';
import type { UpdateSystemMemberRequest } from '@app/v1/dto/user/system/request/UpdateSystemMemberRequest';
import type { UpdateSystemFieldRequest } from '@app/v1/dto/user/system/request/UpdateSystemFieldRequest';
import type { SystemFieldResponse } from '@app/v1/dto/user/system/response/SystemFieldResponse';
import type { Status } from '@app/v1/dto/Status';
import { AxiosResponse } from 'axios';
import { $axios } from '.';

export const getSystem = (): Promise<AxiosResponse<Status<SystemResponse>>> =>
  $axios.request<Status<SystemResponse>>({
    url: '/system',
    method: 'GET',
  });

export const updateSystem = (data: Partial<UpdateSystemRequest>): Promise<AxiosResponse<Status<SystemResponse>>> =>
  $axios.request<Status<SystemResponse>>({
    url: `/system`,
    method: 'POST',
    data,
  });

export const updateSystemBackgroundImage = (file: Blob): Promise<AxiosResponse<Status<SystemResponse>>> =>
  $axios.postForm<Status<SystemResponse>>('/system/background', { file });

export const getMembers = (): Promise<AxiosResponse<Status<SystemMembersResponse>>> =>
  $axios.request<Status<SystemMembersResponse>>({
    url: '/system/members',
    method: 'GET',
  });

export const getMember = (id: string): Promise<AxiosResponse<Status<SystemMemberResponse>>> =>
  $axios.request<Status<SystemMemberResponse>>({
    url: `/system/members/${id}`,
    method: 'GET',
  });

export const updateMember = (
  id: string,
  data: Partial<UpdateSystemMemberRequest>
): Promise<AxiosResponse<Status<SystemMemberResponse>>> =>
  $axios.request<Status<SystemMemberResponse>>({
    url: `/system/members/${id}`,
    method: 'POST',
    data,
  });

export const updateMemberBackgroundImage = (
  id: string,
  file: Blob
): Promise<AxiosResponse<Status<SystemMemberResponse>>> =>
  $axios.postForm<Status<SystemMemberResponse>>(`/system/members/${id}/background`, { file });

export const updateField = (
  id: string,
  data: Partial<UpdateSystemFieldRequest>
): Promise<AxiosResponse<Status<SystemFieldResponse>>> =>
  $axios.request<Status<SystemFieldResponse>>({
    url: `/system/fields/${id}`,
    method: 'POST',
    data,
  });
