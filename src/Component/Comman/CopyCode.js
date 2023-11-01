import React, {Fragment, useState, useId} from 'react'
import {Icons} from '../../utils/Icons'
import ToastMessage from "./ToastMessage";
import {TextField} from "@shopify/polaris";

const CopyCode = ({value,label}) => {
    const secondId = useId();
    const firstId = useId();
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
            <ToastMessage message={message} setMessage={setMessage} isErrorServer={false}/>

                {label && <label>{label}</label> }
                <div className='copy-code' id={`cc${firstId}copy`} >
                    <TextField className='cc-input-text' value={value} id={`cc${secondId}text`} />
                    <button className='cc-copy' onClick={() => onCopyCode(`cc${firstId}copy`, `cc${secondId}text`)} disabled={!value}>{Icons.copyIcon}{Icons.copyIconTrue}</button>
                </div>

        </Fragment>
    );
};

export default CopyCode;