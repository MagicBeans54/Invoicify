/** Copy text with a legacy fallback for non-secure contexts. Returns true on success. */
export async function copyText(value) {
    try {
        await navigator.clipboard.writeText(value);
        return true;
    } catch {
        try {
            const input = document.createElement('input');
            input.value = value;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            return true;
        } catch {
            return false;
        }
    }
}
