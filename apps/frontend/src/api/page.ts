import { AxiosResponse } from 'axios';
import { $axios } from '.';
import type { Status } from '@app/v1/dto/Status';
import type { OkResponse } from '@app/v1/dto/OkResponse';
import type { PageResponse } from '@app/v1/dto/page/response/PageResponse';
import type { PagesResponse } from '@app/v1/dto/page/response/PagesResponse';
import type { CreatePageRequest } from '@app/v1/dto/page/request/CreatePageRequest';
import type { UpdatePageRequest } from '@app/v1/dto/page/request/UpdatePageRequest';

export const getSystemPages = (): Promise<AxiosResponse<Status<PagesResponse>>> =>
  $axios.request<Status<PagesResponse>>({
    url: `/v1/system/page`,
    method: 'GET',
  });

export const getSystemPage = (pageId: string): Promise<AxiosResponse<Status<PageResponse>>> =>
  $axios.request<Status<PageResponse>>({
    url: `/v1/system/page/${pageId}`,
    method: 'GET',
  });

export const updateSystemPage = (
  pageId: string,
  data: Partial<UpdatePageRequest>
): Promise<AxiosResponse<Status<PageResponse>>> =>
  $axios.request<Status<PageResponse>>({
    url: `/v1/system/page/${pageId}`,
    method: 'POST',
    data,
  });

export const deleteSystemPage = (pageId: string): Promise<AxiosResponse<Status<OkResponse>>> =>
  $axios.request<Status<OkResponse>>({
    url: `/v1/system/page/${pageId}`,
    method: 'DELETE',
  });

export const createSystemPage = (data: CreatePageRequest): Promise<AxiosResponse<Status<PageResponse>>> =>
  $axios.request<Status<PageResponse>>({
    url: `/v1/system/page`,
    method: 'PUT',
    data,
  });

export const getMemberPages = (memberId: string): Promise<AxiosResponse<Status<PagesResponse>>> =>
  $axios.request<Status<PagesResponse>>({
    url: `/v1/member/${memberId}/page`,
    method: 'GET',
  });

export const getMemberPage = (memberId: string, pageId: string): Promise<AxiosResponse<Status<PageResponse>>> =>
  $axios.request<Status<PageResponse>>({
    url: `/v1/member/${memberId}/page/${pageId}`,
    method: 'GET',
  });

export const updateMemberPage = (
  memberId: string,
  pageId: string,
  data: Partial<UpdatePageRequest>
): Promise<AxiosResponse<Status<PageResponse>>> =>
  $axios.request<Status<PageResponse>>({
    url: `/v1/member/${memberId}/page/${pageId}`,
    method: 'POST',
    data,
  });

export const deleteMemberPage = (memberId: string, pageId: string): Promise<AxiosResponse<Status<OkResponse>>> =>
  $axios.request<Status<OkResponse>>({
    url: `/v1/member/${memberId}/page/${pageId}`,
    method: 'DELETE',
  });

export const createMemberPage = (
  memberId: string,
  data: CreatePageRequest
): Promise<AxiosResponse<Status<PageResponse>>> =>
  $axios.request<Status<PageResponse>>({
    url: `/v1/member/${memberId}/page`,
    method: 'PUT',
    data,
  });
