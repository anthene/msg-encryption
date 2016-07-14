function $<T extends HTMLElement>(id: string): T {
    return <T>document.getElementById(id);
}

function encrypt(msg: string, pswd: string): string {
    return msg + ' ' + pswd;
}

function updateCypher(e: Event) {
    const msg = $<HTMLInputElement>("msg").value;
    const pswd = $<HTMLInputElement>("pswd").value;
    $<HTMLInputElement>("cyp").value = encrypt(msg, pswd);
}

for (let id of ["msg", "pswd"]){
    $(id).onkeyup = updateCypher;
    $(id).onpaste = updateCypher;
    $(id).oninput = updateCypher;
}
