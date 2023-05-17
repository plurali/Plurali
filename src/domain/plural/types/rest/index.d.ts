export interface BaseEntry<TContent extends object = object> {
  exists: boolean;
  id: string;
  content: TContent;
}

export interface VisibilityAttributes {
  private: boolean;
  preventTrusted: boolean;
}

export interface AvatarAttrs {
  avatarUuid: string;
  avatarUrl: string;
}
