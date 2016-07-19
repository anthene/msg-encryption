import { toBase64, fromBase64, getByteBlock, getBase64SymbolIndeces } from "./base64";

describe("base64", () => {
    describe("getByteBlock", () => {
        const testCases: [number[], number][] = [
            [[ 0x00, 0x00, 0x00 ], 0x00],
            [[ 0x00, 0x00, 0x01 ], 0x01],
            [[ 0xff, 0xff, 0xff ], 0xffffff],
        ];

        testCases.forEach((testCase) => {
            it(`should return '${testCase[1].toString(16)}'`, () => {
                expect(getByteBlock(testCase[0][0], testCase[0][1], testCase[0][2])).toEqual(testCase[1]);
            });
        });
    });

    describe("getBase64SymbolIndeces", () => {
        const testCases: [number, number[]][] = [
            [ 0x00, [ 0x00, 0x00, 0x00, 0x00 ] ],
            [ 0x01, [ 0x00, 0x00, 0x00, 0x01 ] ],
            [ 0x0f, [ 0x00, 0x00, 0x00, 0x0f ] ],
            [ 0xfc0000, [ 0x3f, 0x00, 0x00, 0x00 ] ]
        ];

        testCases.forEach((testCase) => {
            it(`should return '${testCase[1]}'`, () => {
                expect(getBase64SymbolIndeces(testCase[0])).toEqual(testCase[1]);
            });
        });
    });

    describe("toBase64", () => {
        const testCases: [number[], string][] = [
            [[ 0x00, 0x00, 0x00 ], "AAAA"],
            [[ 0x00, 0x00, 0x01 ], "AAAB"],
            [[ 0x00, 0x00 ], "AAA="],
            [[ 0x00 ], "AA=="],
            // "abc"
            [[ 0x61, 0x62, 0x63 ], "YWJj"],
            // "hell"
            [[ 0x68, 0x65, 0x6c, 0x6c ], "aGVsbA=="],
            // "hello"
            [[ 0x68, 0x65, 0x6c, 0x6c, 0x6f ], "aGVsbG8="],
            // "hello, man"
            [[ 0x68, 0x65, 0x6C, 0x6C, 0x6F, 0x2C, 0x20, 0x6D, 0x61, 0x6E ], "aGVsbG8sIG1hbg=="],
            // 
            [[ 73, 42 ], "SSo="]
        ];

        testCases.forEach((testCase) => {
            it(`should return '${testCase[1]}'`, () => {
                expect(toBase64(testCase[0])).toEqual(testCase[1]);
            });
        });
    });

    describe("fromBase64", () => {
        (<[string, number[]][]> 
        [
            ["", []],
            ["abcd", [ 0x69, 0xB7, 0x1D ]],
            ["abcd445P", [0x69, 0xB7, 0x1D, 0xE3, 0x8E, 0x4F]],
            // asdcasesea
            ["YXNkY2FzZXNlYQ==", [0x61, 0x73, 0x64, 0x63, 0x61, 0x73, 0x65, 0x73, 0x65, 0x61]],
            ["+/+/+/+/", [0xFB, 0xFF, 0xBF, 0xFB, 0xFF, 0xBF]],
            ["abc=", [0x69, 0xB7]],
            ["45==", [0xE3]],
            ["SSo=", [ 73, 42 ]]
        ]).
        forEach(testCase => {
            it(`should return ${testCase[1]}`, () => {
                expect(fromBase64(testCase[0])).toEqual(testCase[1]);
            })
        });
    });

    describe("arrays", () => {
        (<number[][]> [
            [252, 246],
            [179]
        ]).
        forEach(array => {
            it("should return an initial array", () => {
                expect(fromBase64(toBase64(array))).toEqual(array);
            });
        });
    });

    describe("random arrays", () => {
        function getRandomInteger(maxValue: number): number {
            return Math.floor(Math.random() * (maxValue + 1));
        }

        const testCount = 70;
        const maxArrayLength = 30;

        for (let i = 0; i < testCount; i++) {
            it("should return an initial array", () => {
                const arrayLength = getRandomInteger(maxArrayLength);
                const array: number[] = [];
                for (let j = 0; j < arrayLength; j++){
                    array.push(getRandomInteger(0xff));
                }

                expect(fromBase64(toBase64(array))).toEqual(array);
            });
        }
    });
});