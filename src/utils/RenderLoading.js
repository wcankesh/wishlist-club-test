import React from 'react';
import {Badge, Box, IndexTable, SkeletonBodyText,} from "@shopify/polaris";
import {CalendarMinor, ArrowRightMinor} from "@shopify/polaris-icons";

export const RenderLoading = {
    badge: <Badge><div style={{width: 62}}>&nbsp;</div></Badge>,
    button: <Badge><div style={{width: '100px', height: '30px'}}>&nbsp;</div></Badge>,
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
