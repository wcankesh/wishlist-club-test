import React from "react";
import {Badge} from "@shopify/polaris";

export const isChecked = (value) => {
    if (typeof value === "string") {
        return value === "1" || value === "true";
    } else if (typeof value === "number") {
        return value === 1;
    } else if (typeof value === "boolean") {
        return value;
    }
    return false;
};

export const toggleFlag = (value) => {
    if (typeof value === 'string') {
        return value === '0' ? '1' : '0';
    } else if (typeof value === 'number') {
        return value === 0 ? 1 : 0;
    } else if (typeof value === 'boolean') {
        return !value;
    } else {
        throw new Error('Invalid input type. Expected string or number.');
    }
};

export const LabelWrapper = ({label})=>{
    return(
        <div className="Polaris-Labelled__LabelWrapper">
            <div className="Polaris-Label">
                <label id=":Rq6:Label" htmlFor=":Rq6:" className="Polaris-Label__Text">
                    <span className="Polaris-Text--root Polaris-Text--bodyMd">{label}</span>
                </label>
            </div>
        </div>
    )
};

export const badgeSkeleton =(<Badge><div style={{width: 62}}>&nbsp;</div></Badge>);