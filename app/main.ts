import { Base64 } from "js-base64";
import { util, Counter, ModeOfOperation } from "aes-js";

//////////////////////////////////////////////////////////////
console.log(toHex("poi"));
console.log(fromHex("706f69"));
// console.log(String.fromCharCode(0xa5, 0x0b, 0x25))
// console.log(String.fromCharCode(0xa5, 0x0b, 0x25))
// console.log(String.fromCharCode(0xef, 0xbf, 0xbd, 0x0b, 0x25))
decrypt(encrypt("poi", "iop"), "iop");

// var key = util.convertStringToBytes("Example128BitKey");
 
// // Convert text to bytes 
// var text = 'Text may be any length you wish, no padding is required.';
// var textBytes = util.convertStringToBytes(text);
 
// // The counter is optional, and if omitted will begin at 0 
// var aesCtr = new ModeOfOperation.ctr(key, new Counter(5));
// var encryptedBytes = aesCtr.encrypt(textBytes);
// var encryptedText = util.convertBytesToString(encryptedBytes);
// console.log(Base64.encode(encryptedText));
 
// // The counter mode of operation maintains internal state, so to 
// // decrypt a new instance must be instantiated. 
// var aesCtr = new ModeOfOperation.ctr(key, new Counter(5));
// var decryptedBytes = aesCtr.decrypt(encryptedBytes);
 
// // Convert our bytes back into text 
// var decryptedText = util.convertBytesToString(decryptedBytes);
// console.log(decryptedText);
// // "Text may be any length you wish, no padding is required." 



/////////////////////////////////////////////////////////////////

function addChars(str: string): string {
    if (str.length < 32) {
        const restCount = 32 - str.length;
        for (let i = 0; i < restCount; i++) {
            str += "0";
        }
    }

    return str;
}

function toHex(text: string): string {
    let hex = "";
    for (let i = 0; i < text.length; i++){
        hex += text.charCodeAt(i).toString(16);
    }
    return hex;
}

function fromHex(hex: string): string {
    let text = "";

    for (let i = 0; i < hex.length; i+=2){
        text += String.fromCharCode(parseInt(hex.charAt(i) + hex.charAt(i+1), 16));
    }
    return text;
}

function $<T extends HTMLElement>(id: string): T {
    return <T>document.getElementById(id);
}

function encrypt(msg: string, pswd: string): string {

    const msgBytes = util.convertStringToBytes(toHex(msg), "hex");
    console.log(msgBytes);
    const pswdBytes = util.convertStringToBytes(addChars(toHex(pswd)), "hex");
    console.log(pswdBytes);
    const aesCtr = new ModeOfOperation.ctr(pswdBytes, new Counter(5));
    const encryptedBytes = aesCtr.encrypt(msgBytes);
    console.log(encryptedBytes);
    const encryptedText = util.convertBytesToString(encryptedBytes, "hex");
    console.log(encryptedText);
    console.log(Base64.encode(encryptedText));
    
    return Base64.encode(encryptedText);
}

function decrypt(cyp: string, pswd: string): string {

    console.log(cyp);
    const encryptedText = Base64.decode(cyp);
    console.log(encryptedText);
    const encryptedBytes = util.convertStringToBytes(encryptedText, "hex");
    console.log(encryptedBytes);
    const pswdBytes = util.convertStringToBytes(addChars(toHex(pswd)), "hex");
    console.log(pswdBytes);
    const aesCtr = new ModeOfOperation.ctr(pswdBytes, new Counter(5));
    const decryptedBytes = aesCtr.decrypt(encryptedBytes);
    console.log(decryptedBytes);
    const decryptedText = util.convertBytesToString(decryptedBytes, "hex");
    console.log(decryptedText);
    console.log(fromHex(decryptedText));

    return fromHex(decryptedText);
}

function updateCypher(e: Event) {
    const msg = $<HTMLInputElement>("msg").value;
    const pswd = $<HTMLInputElement>("pswd").value;
    $<HTMLInputElement>("cyp").value = encrypt(msg, pswd);
}

function updateMessage(e: Event) {
    const cyp = $<HTMLInputElement>("dec-cyp").value;
    const pswd = $<HTMLInputElement>("dec-pswd").value;
    $<HTMLInputElement>("dec-msg").value = decrypt(cyp, pswd);
}

for (let id of ["msg", "pswd"]){
    $(id).onkeyup = updateCypher;
    $(id).onpaste = updateCypher;
    $(id).oninput = updateCypher;
}

for (let id of ["dec-cyp", "dec-pswd"]){
    $(id).onkeyup = updateMessage;
    $(id).onpaste = updateMessage;
    $(id).oninput = updateMessage;
}
