export function friendlyPaymentMethod(method) {
    return (method || '')
        .replace('_', ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());
}
