import React,{Fragment} from 'react';
import {Toast} from "@shopify/polaris";

export function ToastMessage ({message,setMessage}) {
    const toggleDismiss = ()=>{
        setMessage("")
    }
    return  (
        <Fragment>
            {message !== "" && <Toast content={message} onDismiss={toggleDismiss} duration={3000}/>}
        </Fragment>
    )
};
