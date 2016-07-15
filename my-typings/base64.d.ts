declare module 'js-base64' {
    export namespace Base64 {
        export function encode(input: string): string;
        export function decode(input: string): string;
    }
}