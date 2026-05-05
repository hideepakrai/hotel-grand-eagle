export function getTestMode(req: Request): boolean {
    const header = req.headers.get("x-test-mode");
    return header === "true";
}

export function withTestMode(query: any, isTest: boolean) {
    if (isTest) {
        return { ...query, isTest: true };
    }
    return { ...query, isTest: { $ne: true } };
}

export function attachTestMode(data: any, isTest: boolean) {
    if (isTest) {
        return { ...data, isTest: true };
    }
    return { ...data, isTest: false };
}
