// import { Base64 } from "js-base64";
import { util, Counter, ModeOfOperation } from "aes-js";

export function encrypt(msg: string, pswd: string): string {
    console.log(msg);
    console.log(pswd);

    msg = toHex(msg);
    console.log(msg);

    const msgBytes = util.convertStringToBytes(msg, "hex");
    const pswdBytes = util.convertStringToBytes(toHex(addChars(pswd)), "hex");
    let cyp = util.convertBytesToString(encryptBytes(msgBytes, pswdBytes), "hex");
    console.log(cyp);

    // cyp = Base64.encode(cyp);
    // console.log(cyp);
    
    return cyp;
}

function encryptBytes(msgBytes: number[], pswdBytes: number[]): number[] {
    console.log(msgBytes);
    console.log(pswdBytes);

    const aesCtr = new ModeOfOperation.ctr(pswdBytes, new Counter(5));
    const encryptedBytes = aesCtr.encrypt(msgBytes);
    console.log(encryptedBytes);

    return encryptedBytes;
}

export function decrypt(cyp: string, pswd: string): string {
    console.log(cyp);
    console.log(pswd);

    // cyp = Base64.decode(cyp);
    // console.log(cyp);

    const cypBytes = util.convertStringToBytes(cyp, "hex");
    const pswdBytes = util.convertStringToBytes(toHex(addChars(pswd)), "hex");
    const msgBytes = decryptBytes(cypBytes, pswdBytes);

    let msg = util.convertBytesToString(msgBytes, "hex");
    console.log(msg);

    msg = fromHex(msg);
    console.log(msg);

    return msg;
}

function decryptBytes(cypBytes: number[], pswdBytes: number[]): number[] {
    console.log(cypBytes);
    console.log(pswdBytes);

    const aesCtr = new ModeOfOperation.ctr(pswdBytes, new Counter(5));
    const decryptedBytes = aesCtr.decrypt(cypBytes);
    console.log(decryptedBytes);

    return decryptedBytes;
}

function addChars(str: string): string {
    if (str.length < 16) {
        const restCount = 16 - str.length;
        for (let i = 0; i < restCount; i++) {
            str += "0";
        }
    }

    return str;
}

function toHex(text: string): string {
    let hex = "";
    for (let i = 0; i < text.length; i++){
        hex += ("000" + text.charCodeAt(i).toString(16)).slice(-4);
    }
    return hex;
}

function fromHex(hex: string): string {
    let text = "";

    for (let i = 0; i < hex.length; i+=4){
        text += String.fromCharCode(parseInt(hex.charAt(i) + hex.charAt(i+1) + hex.charAt(i+2) + hex.charAt(i+3), 16));
    }
    return text;
}
