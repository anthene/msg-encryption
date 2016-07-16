import { encrypt, decrypt } from "./aes";

function $<T extends HTMLElement>(id: string): T {
    return <T>document.getElementById(id);
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
