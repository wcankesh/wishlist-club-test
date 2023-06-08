import React, {Fragment, useState, useEffect, useCallback} from 'react';
import {FooterHelp, Link, Spinner, Modal, Button, Text} from '@shopify/polaris';
import {useNavigate} from 'react-router-dom';
import {baseUrl, apiService} from "../../utils/Constant";
import {useDispatch, useSelector} from "react-redux";
import {Shop_details} from "../../redux/action/action";
import {Icons} from "../../utils/Icons";
import Routes from "../../Routes";

export function DefaultLayout({pages}) {
    const dispatch = useDispatch()
    const urlParams = new URLSearchParams(window.location.search);
    const shopDetails = useSelector((state) => state.shopDetails)
    const shop = urlParams.get('shop');
    let navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getInstall = async () => {
            const response = await apiService.Install({shop: shop})
            if (response.status === 200) {
                dispatch(Shop_details({...response.data, notification: response.notification}))
                if (response.data.is_app_embedded === "0") {
                    document.querySelector("body").classList.add("remove-close-icon-modal")
                }
                if (response.data.plan_type == "0" && response.data.is_older_shop == "0") {
                    navigate(`${baseUrl}/plan`);
                }
                setIsLoading(false)
            } else if (response.status === 201 && response.data.is_install === false) {
                window.top.location.href = response.data.install_url;
            } else {
                setIsLoading(false);
            }
        };
        getInstall();
    }, [])

    const onAppEmbedded = async () => {
        const data = await apiService.getAppEmbedded();
        if (data.status === 200) {
            dispatch(Shop_details({...shopDetails, is_app_embedded: "1"}))
            document.querySelector("body").classList.remove("remove-close-icon-modal")
            window.open(`https://${shopDetails.shop}/admin/themes/current/editor?context=apps&appEmbed=gid://shopify/OnlineStoreThemeAppEmbed/wishlist-club`, "_top")
        } else {

        }
    }

    const [active, setActive] = useState(true);

    const handleChange = useCallback(() => setActive(!active), [active]);

    const activator = <Button onClick={handleChange}>Open</Button>;

    return (
        isLoading ? <div className="main_spinner"><Spinner/></div> :
            <Fragment>
                {
                    shopDetails && shopDetails.is_app_embedded === "0" &&
                    <Modal
                        activator={activator}
                        open={shopDetails.is_app_embedded === "0"}
                        onClose={handleChange}
                        title="Configure Wishlist Club widget on your theme."
                    >
                        <Modal.Section>
                            <Text>Please click <Link removeUnderline onClick={onAppEmbedded}>here</Link> to activate
                                embedded block of
                                Wishlist Club widget from your theme settings. You can deactivate it anytime.
                            </Text>
                        </Modal.Section>
                    </Modal>
                }
                <Routes pages={pages}/>
                <FooterHelp>
                    <div className="FooterHelp__Content">
                        {Icons.footerAlert}if you need any help, please &nbsp;
                        <Link url="https://help.shopify.com/manual/orders/fulfill-orders">
                            Contact us
                        </Link>
                    </div>
                </FooterHelp>
            </Fragment>
    );
}

