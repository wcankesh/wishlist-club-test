import React from 'react'
import {EmptyState} from '@shopify/polaris'
import {EmptyStateFiles} from "../../utils/AppImages";

const NoDataFound = ({title}) => {
    return (
        <EmptyState heading={title} image={EmptyStateFiles}/>
    )
}
export default NoDataFound