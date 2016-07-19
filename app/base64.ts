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
    const bytesCopy = bytes.map(item => item);

    for (let i = 0; i < postfixLength; i ++) {
        bytesCopy.push(0);
    }

    for (let i = 0; i < bytesCopy.length; i+=3) {
        let bytesBlock = getByteBlock(bytesCopy[i], bytesCopy[i+1], bytesCopy[i+2]);
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

const base64CharSetIndeces: {[char:string]:number} = {};
for (let i = 0; i < b64chars.length; i++) {
    base64CharSetIndeces[b64chars[i]] = i;
}

export function fromBase64(base64: string): number[] {
    if (!base64)
        return [];

    const length = base64.length;
    if (length % 4 !== 0)
        return [];
        // throw new Error("incorrect base64 string");

    let result: number[] = [];
    
    let postfixLength = 0;
    if (base64[length-1] === "=") {
        if (length > 1 && base64[length-2] === "=") {
            postfixLength = 2;
        }
        else {
            postfixLength = 1;
        }
    }

    for (let i = 0; i < length; i += 4) {
        var bytesBlock = base64.substr(i, 4);
        result = result.concat(getBytesBlock(bytesBlock));
    }

    for (let i = 0; i < postfixLength; i++) {
        result.pop();
    }

    return result;
}

function getBytesBlock(bytesBlock: string): number[] {

    let bytes: number = 0;
    for (let i = 0; i < 4; i ++) {
        const shift = 6 * (4 - i - 1);
        let index = base64CharSetIndeces[bytesBlock[i]];
        if (index > -1)
            bytes += (index << shift);
    }

    return [ (bytes & (0xff0000)) >>> 16, (bytes & (0xff00)) >>> 8, (bytes & 0xff) >>> 0 ];
}