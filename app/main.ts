import { encrypt, decrypt } from "./aes";

function $<T extends HTMLElement>(id: string): T {
    return <T>document.getElementById(id);
}

if (!document.queryCommandEnabled("Paste")) {
    for (let id of ["paste", "copy", "dec-paste", "dec-copy"]){
        $(id).style.display = "none";
    }
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

function getClipEventHandler(operation: string, textareaId: string): (e: Event) => void {
    return (e: Event) => {
        const textarea = $<HTMLInputElement>(textareaId);

        textarea.focus();
        textarea.select();
        
        document.execCommand(operation);
    }
}

$<HTMLInputElement>("paste").onclick = getClipEventHandler("Paste", "msg");
$<HTMLInputElement>("dec-paste").onclick = getClipEventHandler("Paste", "dec-cyp");
$<HTMLInputElement>("copy").onclick = getClipEventHandler("Copy", "cyp");
$<HTMLInputElement>("dec-copy").onclick = getClipEventHandler("Copy", "dec-msg");

let passCopyInProgress = false;
function getPassCopyEventHandler(passInputIdFrom: string, passInputIdTo: string): (e: Event) => void {
    return (e: Event) => {
        if (passCopyInProgress)
            return;

        passCopyInProgress = true;
        try {
            const passInputFrom = $<HTMLInputElement>(passInputIdFrom);
            const passInputTo = $<HTMLInputElement>(passInputIdTo);
            passInputTo.value = passInputFrom.value;
        }
        finally {
            passCopyInProgress = false;
        }
    }
}

$("pswd").onkeyup = getPassCopyEventHandler("pswd", "dec-pswd");
$("dec-pswd").onkeyup = getPassCopyEventHandler("dec-pswd", "pswd");
