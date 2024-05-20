const intialState = {
  currency: "INR",
  email_count: "",
  id: "",
  is_app_embedded: "",
  is_install: "",
  is_older_shop: "",
  is_reinstall: "",
  myshopify_domain: "",
  plan_interval: "",
  plan_type: "",
  shop: "",
  shop_owner: "",
  shopify_plan: "",
  shopify_plan_display_name: "",
  store_email: "",
  store_name: "",
  totalItem: "",
  notification: [],
  bannerDisplaySetting: {},
  extension_status: true,
  on_boardig: {},
  upgrade: "1",
  install_url: "",
  bis_import_export_btn:false,
  onboarding:"0",
}

export const StoreReducer = (state = intialState, action) => {
  switch (action.type) {
    case "SHOP_DETAILS":
      return {
        ...state,
        ...action.payload
      }
    default:
      return state;
  }
}
