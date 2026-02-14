export function safeJsonParse(value: string | null | undefined, fallback: any = []) {
    if (!value) return fallback;
    try {
        return JSON.parse(value);
    } catch {
        return fallback;
    }
}
