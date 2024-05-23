import React, {useState} from 'react';
import {Spinner, Text, InlineStack} from "@shopify/polaris";

const LazyLoadImage = ({src, alt, className = "", ...rest}) => {
        const [isLoading, setIsLoading] = useState(true);
        const [isError, setIsError] = useState(false);

        const handleImageLoad = () => {
            setIsLoading(false);
        };

        const handleImageError = () => {
            setIsLoading(false);
            setIsError(true);
        };

        return (
            <div className={`lazy-load-image-container`}>
                {isLoading && <div className="loading-placeholder">
                    <InlineStack gap={"200"} blockAlign={"center"} align={"center"}>
                        <Text tone={"subdued"}>Loading... </Text>
                        <Spinner accessibilityLabel="Small spinner example" size="small"/>
                    </InlineStack>
                </div>}
                {isError && <div className="error-placeholder">Failed to load image</div>}
                <img src={src} alt={alt} onLoad={handleImageLoad} onError={handleImageError} {...rest}
                     className={`${className}`}/>
            </div>
        );
    }
;

export default LazyLoadImage;
