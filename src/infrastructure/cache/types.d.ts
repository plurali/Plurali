export interface LazyCachedResult<T> {
    hot: boolean
    data: T
}