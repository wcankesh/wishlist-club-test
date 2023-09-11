import React,{Fragment} from 'react';
import {Toast} from "@shopify/polaris";

const ToastMessage = ({message,setMessage, isErrorServer, setIsErrorServer}) => {
    const toggleDismiss = ()=>{
        setMessage("")
        if(setIsErrorServer){
            setIsErrorServer(false)
        }
    }

    return  (
        <Fragment>
            {message !== "" && <Toast error={isErrorServer} content={message} onDismiss={toggleDismiss} duration={3000} />}
        </Fragment>
    )
};

export default ToastMessage;