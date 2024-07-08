import React, {Fragment} from 'react';
import {Badge, BlockStack, Box, IndexTable, SkeletonBodyText, SkeletonDisplayText,} from "@shopify/polaris";

export const RenderLoading = {
    badge: <Badge><div style={{width: 62}}>&nbsp;</div></Badge>,
    button: <Badge><div style={{width: '100px', height: '30px'}}>&nbsp;</div></Badge>,
    commonParagraph: <Fragment>
        <BlockStack gap={"400"}>
            {
                Array.from(Array(3)).map((_, r) => {
                    return (
                        <BlockStack gap={"200"} key={r}>
                            <SkeletonDisplayText size="small"/>
                            <SkeletonBodyText/>
                        </BlockStack>
                    )
                })
            }
        </BlockStack>
    </Fragment>,
}

export const tableLoading = (rowLength, cellLength) => {
    const loadingRows = Array.from({ length: rowLength }).map((_, rowIndex) => (
            <IndexTable.Row key={rowIndex}>
                {Array.from({ length: cellLength }).map((_, cellIndex) => (
                    <IndexTable.Cell key={cellIndex}><Box padding="200"><SkeletonBodyText lines={1} /></Box></IndexTable.Cell>
                ))}
            </IndexTable.Row>
        )
    );
    return loadingRows;
}
