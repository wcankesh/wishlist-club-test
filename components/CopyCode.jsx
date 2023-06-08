import React, {Fragment, useState} from 'react'
import {Icons} from '../utils/Icons'
import {ToastMessage} from "./ToastMessage";
import {LegacyStack} from "@shopify/polaris";

export function CopyCode  ({value,label})  {

    const characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

    let secondId = '';
    for (let i = 0; i < 6; i++) {
        secondId += characters[Math.floor(Math.random() * characters.length)];
    }
    let firstId = '';
    for (let i = 0; i < 6; i++) {
        firstId += characters[Math.floor(Math.random() * characters.length)];
    }


    const [message, setMessage] = useState("");
    const onCopyCode = (step1, step2) => {
        let copyCode = document.getElementById(step1);
        copyCode.classList.add("copy-true");
        let copyText = document.getElementById(step2);
        copyText.select();
        copyText.setSelectionRange(0, 99999);
        document.execCommand("copy");
        setMessage("Copied")
        setTimeout(() => {
            copyCode.classList.remove("copy-true");
            copyText.setSelectionRange(0, 0);
        }, 4000)
    }

    return (
        <Fragment>
            <ToastMessage message={message} setMessage={setMessage}/>
            <LegacyStack vertical spacing={"tight"}>
                {label && <label>{label}</label> }
                <div className='copy-code' id={`cc_${firstId}_copy`} >
                    <input readOnly className='cc-input-text' value={value} id={`cc_${secondId}_text`} />
                    <button className='cc-copy' onClick={() => onCopyCode(`cc_${firstId}_copy`, `cc_${secondId}_text`)}>{Icons.copyIcon}{Icons.copyIconTrue}</button>
                </div>
            </LegacyStack>
        </Fragment>
    )
}


