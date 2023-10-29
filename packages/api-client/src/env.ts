export const apiUrl = (() => {
    if (typeof process !== "undefined") {
        return process.env?.NEXT_PUBLIC_API_URL ?? process.env?.API_URL;
    }

    return (import.meta as any).env.VITE_API_URL ?? "https://plurali.icu/api";
})();

export const cdnUrl = (() => {
    if (typeof process !== "undefined") {
        return process.env?.NEXT_PUBLIC_CDN_URL ?? process.env?.CDN_URL;
    }

    return (import.meta as any).env.VITE_CDN_URL ?? "https://cdn.plurali.icu";
})();
