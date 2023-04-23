import { AxiosResponse } from 'axios';
import { $axios, Response } from '.';
import { Member, MemberField, System } from '@plurali/common/src/system';
import { SuccessData } from '@plurali/backend/src/server/status';

export interface UpdateSystemData extends SuccessData {
  visible?: boolean;
  customDescription?: string | null;
  backgroundColor?: string;
}

export interface SystemData extends SuccessData {
  system: System;
}

export interface UpdateSystemMemberData extends SuccessData {
  visible?: boolean;
  customDescription?: string | null;
  backgroundColor?: string;
}

export interface SystemMembersData extends SuccessData {
  members: Member[];
}

export interface SystemMemberData extends SuccessData {
  member: Member;
}

export interface UpdateSystemFieldRequest {
  visible?: boolean;
  customDescription?: string | null;
}

export interface SystemFieldData extends SuccessData {
  field: MemberField;
}

export interface SystemFieldsData extends SuccessData {
  fields: MemberField[];
}

export const getSystem = (): Promise<AxiosResponse<Response<SystemData>>> =>
  $axios.request<Response<SystemData>>({
    url: '/system',
    method: 'GET',
  });

export const updateSystem = (data: UpdateSystemData): Promise<AxiosResponse<Response<SystemData>>> =>
  $axios.request<Response<SystemData>>({
    url: `/system`,
    method: 'POST',
    data,
  });

export const updateSystemBackgroundImage = (file: Blob): Promise<AxiosResponse<Response<SystemMemberData>>> =>
  $axios.postForm<Response<SystemMemberData>>('/system/background', { file });

export const getMembers = (): Promise<AxiosResponse<Response<SystemMembersData>>> =>
  $axios.request<Response<SystemMembersData>>({
    url: '/system/members',
    method: 'GET',
  });

export const getMember = (id: string): Promise<AxiosResponse<Response<SystemMemberData>>> =>
  $axios.request<Response<SystemMemberData>>({
    url: `/system/members/${id}`,
    method: 'GET',
  });

export const updateMember = (
  id: string,
  data: UpdateSystemMemberData
): Promise<AxiosResponse<Response<SystemMemberData>>> =>
  $axios.request<Response<SystemMemberData>>({
    url: `/system/members/${id}`,
    method: 'POST',
    data,
  });

export const updateMemberBackgroundImage = (
  id: string,
  file: Blob
): Promise<AxiosResponse<Response<SystemMemberData>>> =>
  $axios.postForm<Response<SystemMemberData>>(`/system/members/${id}/background`, { file })

  export const updateField = (
  id: string,
  data: UpdateSystemFieldRequest
): Promise<AxiosResponse<Response<SystemFieldData>>> =>
  $axios.request<Response<SystemFieldData>>({
    url: `/system/fields/${id}`,
    method: 'POST',
    data,
  });
