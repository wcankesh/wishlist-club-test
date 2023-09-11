import React from 'react'
import { EmptyState} from '@shopify/polaris'

const NoDataFound = ({title}) => {
    return (
        <EmptyState
            heading={title}
            image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
        />

    )
}
export default NoDataFound