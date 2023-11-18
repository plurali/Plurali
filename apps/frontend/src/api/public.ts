import { AxiosResponse } from 'axios';
import { $axios } from '.';
import type { PaginatedStatus, Status } from '@app/v1/dto/Status';
import type { SystemResponse } from '@app/v1/dto/user/system/response/SystemResponse';
import type { SystemMemberResponse } from '@app/v1/dto/user/system/response/SystemMemberResponse';
import type { SystemMembersResponse } from '@app/v1/dto/user/system/response/SystemMembersResponse';
import type { PagesResponse } from '@app/v1/dto/page/response/PagesResponse';
import type { PageResponse } from '@app/v1/dto/page/response/PageResponse';

export const getSystem = (systemId: string): Promise<AxiosResponse<Status<SystemResponse>>> =>
  $axios.request<Status<SystemResponse>>({
    url: `/v1/public/system/${systemId}`,
    method: 'GET',
  });

export const getSystemPages = (systemId: string): Promise<AxiosResponse<Status<PagesResponse>>> =>
  $axios.request<Status<PagesResponse>>({
    url: `/v1/public/system/${systemId}/page`,
    method: 'GET',
  });

export const getSystemPage = (systemId: string, pageId: string): Promise<AxiosResponse<Status<PageResponse>>> =>
  $axios.request<Status<PageResponse>>({
    url: `/v1/public/system/${systemId}/page/${pageId}`,
    method: 'GET',
  });

export const getMember = (systemId: string, memberId: string): Promise<AxiosResponse<Status<SystemMemberResponse>>> =>
  $axios.request<Status<SystemMemberResponse>>({
    url: `/v1/public/system/${systemId}/members/${memberId}`,
    method: 'GET',
  });

export const getMembers = (systemId: string, page = 1): Promise<AxiosResponse<PaginatedStatus<SystemMembersResponse>>> =>
  $axios.request<PaginatedStatus<SystemMembersResponse>>({
    url: `/v1/public/system/${systemId}/members`,
    method: 'GET',
    params: {
      page,
    }
  });

export const getMemberPages = (memberId: string): Promise<AxiosResponse<Status<PagesResponse>>> =>
  $axios.request<Status<PagesResponse>>({
    url: `/v1/public/member/${memberId}/page`,
    method: 'GET',
  });

export const getMemberPage = (memberId: string, pageId: string): Promise<AxiosResponse<Status<PageResponse>>> =>
  $axios.request<Status<PageResponse>>({
    url: `/v1/public/member/${memberId}/page/${pageId}`,
    method: 'GET',
  });
