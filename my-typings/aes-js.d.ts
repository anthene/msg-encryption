declare module 'aes-js' {
    export namespace util {
        export function convertStringToBytes(text: string, encoding?: string): number[];
        export function convertBytesToString(bytes: number[], encoding?: string): string;
        export function decode(input: string): string;
    }

    export namespace ModeOfOperation {
        export class ctr {
            constructor (key: number[], counter: Counter);
            encrypt(bytes: number[]): number[];
            decrypt(bytes: number[]): number[];
        }
    }

    export class Counter {
        constructor (num: number);
    }
}