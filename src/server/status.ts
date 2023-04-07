export const Status = {
    InvalidRequest: "Invalid request",
    InvalidPluralKey: "Invalid plural key",
    NotAuthenticated: "Not authenticated",
    PluralKeyNotSpecified: "Plural key not specified",
    Login: {
        InvalidCredentials: "Invalid credentials",
    },
    Register: {
        UsernameAlreadyUsed: "Username is already used",
    },
    UserUpdate: {
        InvalidOverride: "Invalid Override Plural ID",
    },
    ResourceNotFound: "Resource not found",
    Unauthorized: "Unauthorized"

}

export interface SuccessResponse<TData extends object = object> {
    success: true
    data: TData
}

export interface ErrorResponse {
    success: false
    error: string
}

export type Response<TData extends object> = SuccessResponse<TData> | ErrorResponse;

export const error = (error: string): ErrorResponse => ({ success: false, error })

export const data = <TData extends object>(data: TData): SuccessResponse<TData> => ({ success: true, data })