const b64chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const byteToAdd = [0, 2, 1];
const masks = [
    0x3f << (6 * 3), // 111111 000000 000000 000000
    0x3f << (6 * 2), // 000000 111111 000000 000000
    0x3f << (6 * 1), // 000000 000000 111111 000000
    0x3f << (6 * 0), // 000000 000000 000000 111111
];
const shifts = [
    6 * 3,
    6 * 2,
    6 * 1,
    6 * 0,
];

export function toBase64(bytes: number[]): string {
    const postfixLength = byteToAdd[bytes.length % 3];
    let base64Str = "";

    for (let i = 0; i < postfixLength; i ++) {
        bytes.push(0);
    }

    for (let i = 0; i < bytes.length; i+=3) {
        let bytesBlock = getByteBlock(bytes[i], bytes[i+1], bytes[i+2]);
        const base64SymbolIndeces = getBase64SymbolIndeces(bytesBlock);

        for (let index of base64SymbolIndeces) {
            base64Str += b64chars[index];
        }
    }

    base64Str = base64Str.substr(0, base64Str.length - postfixLength) + "=".repeat(postfixLength);

    return base64Str;
}

export function getByteBlock(byte1: number, byte2: number, byte3: number): number {
    return (byte1 << 16) + (byte2 << 8) + byte3;
}

export function getBase64SymbolIndeces(byteBlock: number): number[] {
    return masks.map((mask, index) => (byteBlock & mask) >>> shifts[index]);
}

export function fromBase64(base64: string): number[] {
    return [];
}
