export class AsyncArray {
    static async map<T, U>(array: T[], cb: (value: T, index: number, array: T[]) => Promise<U>): Promise<U[]> {
        let mapped: U[] = [];

        for (let key = 0; key < array.length; key++) {
            mapped[key] = await cb(array[key], key, array);
        }

        return mapped;
    }

    static async filter<T>(array: T[], cb: (value: T, index: number, array: T[]) => Promise<boolean>): Promise<T[]> {
        for (let key = 0; key < array.length; key++) {
            const result = await cb(array[key], key, array)
            if (!result) {
                array.splice(key, 1);
            }
        }

        return array;
    }
}