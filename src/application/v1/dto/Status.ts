import { ApiProperty } from '@nestjs/swagger';

export interface SuccessData extends Record<string, unknown> {
  warning?: string;
}

export const StatusMap = {
  InvalidRequest: 'Invalid request',
  InvalidPluralKey: 'Invalid plural key',
  NotAuthenticated: 'Not authenticated',
  PluralKeyNotSpecified: 'Plural key not specified',
  InvalidCredentials: 'Invalid credentials',
  UsernameAlreadyUsed: 'Username or email is already used',
  EmailTaken: 'The provided email address is already taken',
  InvalidOverride: 'Invalid Override Plural ID',
  ResourceNotFound: 'Resource not found',
  Unauthorized: 'Unauthorized',
  UnsupportedFile: 'Unsupported or invalid file given',
  FileProcessingFailed: 'Failed to process the given file',
  MultipartEndpoint: 'This endpoint is only accepting requests in the multipart form',
  CacheDemand:
    'Due to unexpected higher demand, we were not able to clear cached content, so your changes may not be visible immediately.',
  SystemAlreadyAssociated: 'The provided system is already associated to another account.',
};

export type StatusMapType = typeof StatusMap;

export type StatusMapKey = StatusMapType[keyof StatusMapType];

export type Ok<D = SuccessData> = Status<D, undefined>;

export type Error<E extends StatusMapKey = StatusMapKey> = Status<undefined, E>;

export class Status<D = SuccessData, E extends StatusMapKey = StatusMapKey> {
  @ApiProperty()
  public success: boolean;

  @ApiProperty()
  public data: D;

  @ApiProperty()
  public error: E;

  constructor(data?: D, error?: typeof data extends undefined ? E : undefined) {
    this.success = !error;
    this.data = data;
    this.error = error;
  }

  public static ok<D = SuccessData>(data: D): Ok<D> {
    return new Status<D, undefined>(data);
  }

  public static error<E extends StatusMapKey = StatusMapKey>(error: E): Status<undefined, E> {
    return new Status<undefined, E>(undefined, error);
  }
}
