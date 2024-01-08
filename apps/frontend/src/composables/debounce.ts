export function debounce<A extends unknown[] = []>(fn: (...args: A) => unknown, wait = 300) {
    let timer: number | NodeJS.Timeout;
    return function (...args: A) {
        if (timer) {
            clearTimeout(timer);
        }
        const context = this as any;
        timer = setTimeout(() => {
            fn.apply(context, args);
        }, wait);
    }
}