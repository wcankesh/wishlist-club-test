import React,{Fragment} from 'react';
import {
    FormLayout,
    TextField,
    Layout,
    Box,
    Card,
    InlineStack,
    BlockStack,
    RadioButton,
    Thumbnail,
    DropZone,
    Text,
    Checkbox,
    Select,
    Button,
    Tabs, Divider,
    Grid,
    InlineGrid,
    Icon,
    Badge
} from "@shopify/polaris";
import { Product1, Product2, Product3, Product5 } from "../../../utils/AppImages";
const WishlistPage = ({wishlistSetting, setWishlistSetting}) => {


    const products = [
        {
            "title": "Elegant Classic Leather Handbag",
            "options": [
                {
                    "name": "Color",
                    "position": 1,
                    "values": ["Black", "Brown", "Navy", "Red", "Beige"]
                },
                {
                    "name": "Size",
                    "position": 2,
                    "values": ["Small", "Medium", "Large"]
                }
            ],
            "variants": [
                {
                    "title": "Black / Small",
                    "price": "249.99",
                    "compare_at_price": "299.99",
                    "sku": "ELH-BLK-S",
                    "inventory_quantity": 12,
                    "barcode": "8901234567890",
                    "weight": 0.8,
                    "weight_unit": "kg",
                    "option1": "Black",
                    "option2": "Small"
                },
                {
                    "title": "Black / Medium",
                    "price": "269.99",
                    "compare_at_price": "319.99",
                    "sku": "ELH-BLK-M",
                    "inventory_quantity": 15,
                    "barcode": "8901234567891",
                    "weight": 0.95,
                    "weight_unit": "kg",
                    "option1": "Black",
                    "option2": "Medium"
                },
                {
                    "title": "Brown / Small",
                    "price": "249.99",
                    "compare_at_price": "299.99",
                    "sku": "ELH-BRN-S",
                    "inventory_quantity": 10,
                    "barcode": "8901234567893",
                    "weight": 0.8,
                    "weight_unit": "kg",
                    "option1": "Brown",
                    "option2": "Small"
                },
                {
                    "title": "Navy / Medium",
                    "price": "269.99",
                    "compare_at_price": "319.99",
                    "sku": "ELH-NVY-M",
                    "inventory_quantity": 9,
                    "barcode": "8901234567895",
                    "weight": 0.95,
                    "weight_unit": "kg",
                    "option1": "Navy",
                    "option2": "Medium"
                }
            ],
            "images": Product1

        },
        {
            "title": "Crossbody Mini Purse",
            "options": [
                {
                    "name": "Color",
                    "position": 1,
                    "values": [
                        "Blush Pink",
                        "Emerald Green",
                        "Black",
                        "Tan",
                        "White"
                    ]
                },
                {
                    "name": "Material",
                    "position": 2,
                    "values": [
                        "Vegan Leather",
                        "Canvas",
                        "Nylon"
                    ]
                }
            ],
            "variants": [
                {
                    "title": "Blush Pink / Vegan Leather",
                    "price": "119.99",
                    "compare_at_price": "149.99",
                    "sku": "CBM-PNK-VL",
                    "inventory_quantity": 18,
                    "barcode": "8901234567900",
                    "weight": 0.4,
                    "weight_unit": "kg",
                    "option1": "Blush Pink",
                    "option2": "Vegan Leather"
                },
                {
                    "title": "Emerald Green / Vegan Leather",
                    "price": "119.99",
                    "compare_at_price": "149.99",
                    "sku": "CBM-GRN-VL",
                    "inventory_quantity": 15,
                    "barcode": "8901234567901",
                    "weight": 0.4,
                    "weight_unit": "kg",
                    "option1": "Emerald Green",
                    "option2": "Vegan Leather"
                },
                {
                    "title": "Black / Nylon",
                    "price": "99.99",
                    "compare_at_price": "129.99",
                    "sku": "CBM-BLK-NY",
                    "inventory_quantity": 24,
                    "barcode": "8901234567902",
                    "weight": 0.3,
                    "weight_unit": "kg",
                    "option1": "Black",
                    "option2": "Nylon"
                },
                {
                    "title": "Tan / Canvas",
                    "price": "89.99",
                    "compare_at_price": "109.99",
                    "sku": "CBM-TAN-CV",
                    "inventory_quantity": 22,
                    "barcode": "8901234567903",
                    "weight": 0.35,
                    "weight_unit": "kg",
                    "option1": "Tan",
                    "option2": "Canvas"
                }
            ],
            "images":Product2
        },
        {
            "title": "Structured Tote Bag",
            "options": [
                {
                    "name": "Color",
                    "position": 1,
                    "values": [
                        "Black",
                        "Camel",
                        "Navy",
                        "Taupe",
                        "Burgundy"
                    ]
                },
                {
                    "name": "Size",
                    "position": 2,
                    "values": [
                        "Medium",
                        "Large"
                    ]
                }
            ],
            "variants": [
                {
                    "title": "Black / Medium",
                    "price": "189.99",
                    "compare_at_price": "229.99",
                    "sku": "STB-BLK-M",
                    "inventory_quantity": 14,
                    "barcode": "8901234567910",
                    "weight": 0.9,
                    "weight_unit": "kg",
                    "option1": "Black",
                    "option2": "Medium"
                },
                {
                    "title": "Black / Large",
                    "price": "209.99",
                    "compare_at_price": "249.99",
                    "sku": "STB-BLK-L",
                    "inventory_quantity": 11,
                    "barcode": "8901234567911",
                    "weight": 1.1,
                    "weight_unit": "kg",
                    "option1": "Black",
                    "option2": "Large"
                },
                {
                    "title": "Camel / Medium",
                    "price": "189.99",
                    "compare_at_price": "229.99",
                    "sku": "STB-CML-M",
                    "inventory_quantity": 9,
                    "barcode": "8901234567912",
                    "weight": 0.9,
                    "weight_unit": "kg",
                    "option1": "Camel",
                    "option2": "Medium"
                },
                {
                    "title": "Navy / Large",
                    "price": "209.99",
                    "compare_at_price": "249.99",
                    "sku": "STB-NVY-L",
                    "inventory_quantity": 7,
                    "barcode": "8901234567913",
                    "weight": 1.1,
                    "weight_unit": "kg",
                    "option1": "Navy",
                    "option2": "Large"
                }
            ],
            "images": Product3
        },
        {
            "title": "Convertible Backpack Purse",
            "options": [
                {
                    "name": "Color",
                    "position": 1,
                    "values": [
                        "Black",
                        "Grey",
                        "Burgundy",
                        "Olive"
                    ]
                }
            ],
            "variants": [
                {
                    "title": "Black",
                    "price": "159.99",
                    "compare_at_price": "189.99",
                    "sku": "CBP-BLK",
                    "inventory_quantity": 16,
                    "barcode": "8901234567920",
                    "weight": 0.75,
                    "weight_unit": "kg",
                    "option1": "Black"
                },
                {
                    "title": "Grey",
                    "price": "159.99",
                    "compare_at_price": "189.99",
                    "sku": "CBP-GRY",
                    "inventory_quantity": 12,
                    "barcode": "8901234567921",
                    "weight": 0.75,
                    "weight_unit": "kg",
                    "option1": "Grey"
                },
                {
                    "title": "Burgundy",
                    "price": "159.99",
                    "compare_at_price": "189.99",
                    "sku": "CBP-BRG",
                    "inventory_quantity": 8,
                    "barcode": "8901234567922",
                    "weight": 0.75,
                    "weight_unit": "kg",
                    "option1": "Burgundy"
                },
                {
                    "title": "Olive",
                    "price": "159.99",
                    "compare_at_price": "189.99",
                    "sku": "CBP-OLV",
                    "inventory_quantity": 10,
                    "barcode": "8901234567923",
                    "weight": 0.75,
                    "weight_unit": "kg",
                    "option1": "Olive"
                }
            ],
            "images": Product5
        },
        {
            "title": "Evening Clutch with Chain",
            "options": [
                {
                    "name": "Color",
                    "position": 1,
                    "values": [
                        "Black",
                        "Gold",
                        "Silver",
                        "Rose Gold",
                        "Champagne"
                    ]
                },
                {
                    "name": "Material",
                    "position": 2,
                    "values": [
                        "Satin",
                        "Metallic",
                        "Sequin",
                        "Velvet"
                    ]
                }
            ],
            "variants": [
                {
                    "title": "Black / Satin",
                    "price": "79.99",
                    "compare_at_price": "99.99",
                    "sku": "ECC-BLK-STN",
                    "inventory_quantity": 20,
                    "barcode": "8901234567930",
                    "weight": 0.25,
                    "weight_unit": "kg",
                    "option1": "Black",
                    "option2": "Satin"
                },
                {
                    "title": "Gold / Metallic",
                    "price": "89.99",
                    "compare_at_price": "109.99",
                    "sku": "ECC-GLD-MTL",
                    "inventory_quantity": 17,
                    "barcode": "8901234567931",
                    "weight": 0.3,
                    "weight_unit": "kg",
                    "option1": "Gold",
                    "option2": "Metallic"
                },
                {
                    "title": "Silver / Sequin",
                    "price": "94.99",
                    "compare_at_price": "114.99",
                    "sku": "ECC-SLV-SEQ",
                    "inventory_quantity": 15,
                    "barcode": "8901234567932",
                    "weight": 0.35,
                    "weight_unit": "kg",
                    "option1": "Silver",
                    "option2": "Sequin"
                },
                {
                    "title": "Rose Gold / Metallic",
                    "price": "89.99",
                    "compare_at_price": "109.99",
                    "sku": "ECC-RSG-MTL",
                    "inventory_quantity": 12,
                    "barcode": "8901234567933",
                    "weight": 0.3,
                    "weight_unit": "kg",
                    "option1": "Rose Gold",
                    "option2": "Metallic"
                }
            ],
            "images": Product1
        },
        {
            "title": "Quilted Chain Shoulder Bag",
            "options": [
                {
                    "name": "Color",
                    "position": 1,
                    "values": [
                        "Black",
                        "Cream",
                        "Red",
                        "Dusty Pink",
                        "Powder Blue"
                    ]
                },
                {
                    "name": "Size",
                    "position": 2,
                    "values": [
                        "Small",
                        "Medium"
                    ]
                },
                {
                    "name": "Hardware",
                    "position": 3,
                    "values": [
                        "Gold",
                        "Silver"
                    ]
                }
            ],
            "variants": [
                {
                    "title": "Black / Small / Gold",
                    "price": "229.99",
                    "compare_at_price": "279.99",
                    "sku": "QCS-BLK-S-GLD",
                    "inventory_quantity": 9,
                    "barcode": "8901234567940",
                    "weight": 0.6,
                    "weight_unit": "kg",
                    "option1": "Black",
                    "option2": "Small",
                    "option3": "Gold"
                },
                {
                    "title": "Black / Medium / Gold",
                    "price": "249.99",
                    "compare_at_price": "299.99",
                    "sku": "QCS-BLK-M-GLD",
                    "inventory_quantity": 7,
                    "barcode": "8901234567941",
                    "weight": 0.7,
                    "weight_unit": "kg",
                    "option1": "Black",
                    "option2": "Medium",
                    "option3": "Gold"
                },
                {
                    "title": "Cream / Small / Gold",
                    "price": "229.99",
                    "compare_at_price": "279.99",
                    "sku": "QCS-CRM-S-GLD",
                    "inventory_quantity": 6,
                    "barcode": "8901234567942",
                    "weight": 0.6,
                    "weight_unit": "kg",
                    "option1": "Cream",
                    "option2": "Small",
                    "option3": "Gold"
                },
                {
                    "title": "Red / Medium / Silver",
                    "price": "249.99",
                    "compare_at_price": "299.99",
                    "sku": "QCS-RED-M-SLV",
                    "inventory_quantity": 5,
                    "barcode": "8901234567943",
                    "weight": 0.7,
                    "weight_unit": "kg",
                    "option1": "Red",
                    "option2": "Medium",
                    "option3": "Silver"
                }
            ],
            "images": Product2
        },
        {
            "title": "Bohemian Woven Straw Bag",
            "options": [
                {
                    "name": "Style",
                    "position": 1,
                    "values": [
                        "Round",
                        "Tote",
                        "Basket"
                    ]
                },
                {
                    "name": "Accent",
                    "position": 2,
                    "values": [
                        "Pom Pom",
                        "Tassel",
                        "Embroidered",
                        "Plain"
                    ]
                }
            ],
            "variants": [
                {
                    "title": "Round / Pom Pom",
                    "price": "59.99",
                    "compare_at_price": "79.99",
                    "sku": "BSB-RND-POM",
                    "inventory_quantity": 25,
                    "barcode": "8901234567950",
                    "weight": 0.5,
                    "weight_unit": "kg",
                    "option1": "Round",
                    "option2": "Pom Pom"
                },
                {
                    "title": "Tote / Tassel",
                    "price": "69.99",
                    "compare_at_price": "89.99",
                    "sku": "BSB-TOT-TAS",
                    "inventory_quantity": 20,
                    "barcode": "8901234567951",
                    "weight": 0.6,
                    "weight_unit": "kg",
                    "option1": "Tote",
                    "option2": "Tassel"
                },
                {
                    "title": "Basket / Embroidered",
                    "price": "74.99",
                    "compare_at_price": "94.99",
                    "sku": "BSB-BSK-EMB",
                    "inventory_quantity": 18,
                    "barcode": "8901234567952",
                    "weight": 0.65,
                    "weight_unit": "kg",
                    "option1": "Basket",
                    "option2": "Embroidered"
                },
                {
                    "title": "Round / Plain",
                    "price": "54.99",
                    "compare_at_price": "74.99",
                    "sku": "BSB-RND-PLN",
                    "inventory_quantity": 22,
                    "barcode": "8901234567953",
                    "weight": 0.5,
                    "weight_unit": "kg",
                    "option1": "Round",
                    "option2": "Plain"
                }
            ],
            "images": Product3
        },
        {
            "title": "Eco-Friendly Canvas Shopper",

            "options": [
                {
                    "name": "Design",
                    "position": 1,
                    "values": [
                        "Natural",
                        "Botanical Print",
                        "Ocean Print",
                        "Recycling Message",
                        "Plain Black"
                    ]
                }
            ],
            "variants": [
                {
                    "title": "Natural",
                    "price": "29.99",
                    "compare_at_price": "39.99",
                    "sku": "ECS-NAT",
                    "inventory_quantity": 30,
                    "barcode": "8901234567960",
                    "weight": 0.3,
                    "weight_unit": "kg",
                    "option1": "Natural"
                },
                {
                    "title": "Botanical Print",
                    "price": "34.99",
                    "compare_at_price": "44.99",
                    "sku": "ECS-BOT",
                    "inventory_quantity": 28,
                    "barcode": "8901234567961",
                    "weight": 0.3,
                    "weight_unit": "kg",
                    "option1": "Botanical Print"
                },
                {
                    "title": "Ocean Print",
                    "price": "34.99",
                    "compare_at_price": "44.99",
                    "sku": "ECS-OCN",
                    "inventory_quantity": 26,
                    "barcode": "8901234567962",
                    "weight": 0.3,
                    "weight_unit": "kg",
                    "option1": "Ocean Print"
                },
                {
                    "title": "Recycling Message",
                    "price": "32.99",
                    "compare_at_price": "42.99",
                    "sku": "ECS-RCY",
                    "inventory_quantity": 25,
                    "barcode": "8901234567963",
                    "weight": 0.3,
                    "weight_unit": "kg",
                    "option1": "Recycling Message"
                }
            ],
            "images": Product5
        },
        {
            "title": "Functional Diaper Bag Backpack",
            "options": [
                {
                    "name": "Color",
                    "position": 1,
                    "values": ["Grey", "Black", "Navy", "Sage Green"]
                }
            ],
            "variants": [
                {
                    "title": "Grey",
                    "price": "89.99",
                    "compare_at_price": "109.99",
                    "sku": "FDB-GRY",
                    "inventory_quantity": 22,
                    "barcode": "8901234567970",
                    "weight": 0.9,
                    "weight_unit": "kg",
                    "option1": "Grey"
                },
                {
                    "title": "Black",
                    "price": "89.99",
                    "compare_at_price": "109.99",
                    "sku": "FDB-BLK",
                    "inventory_quantity": 20,
                    "barcode": "8901234567971",
                    "weight": 0.9,
                    "weight_unit": "kg",
                    "option1": "Black"
                },
                {
                    "title": "Navy",
                    "price": "89.99",
                    "compare_at_price": "109.99",
                    "sku": "FDB-NVY",
                    "inventory_quantity": 17,
                    "barcode": "8901234567972",
                    "weight": 0.9,
                    "weight_unit": "kg",
                    "option1": "Navy"
                },
                {
                    "title": "Sage Green",
                    "price": "89.99",
                    "compare_at_price": "109.99",
                    "sku": "FDB-SGE",
                    "inventory_quantity": 15,
                    "barcode": "8901234567973",
                    "weight": 0.9,
                    "weight_unit": "kg",
                    "option1": "Sage Green"
                }
            ],
            "images": Product1

        }
    ]

    const options = [
        { label: 'Grid', value: '0' },
        { label: 'List', value: '1' },
    ];

    const GridParRow = [
        { label: '2', value: '2' },
        { label: '3', value: '3' },
        { label: '4', value: '4' },
        { label: '5', value: '5' },
    ];

    const variantType = [
        { label: 'Default', value: 'default' },
        { label: 'Swatch', value: 'swatch' },
        { label: 'Dropdown', value: 'dropdown' },
    ];


    const handleChange = (e) => {
        const { name, value } = e.target;
        setWishlistSetting({
            ...wishlistSetting,
            [name]: value
        })
    }
    return (
        <Layout.Section>
            <Grid gap={{
                xs: '3',
                sm: '4',
                md: '5',
                lg: 100,
            }} >
                <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 4 }}>
                    <Card>
                        <FormLayout>
                            <Select
                                label={"Layout"}
                                options={options}
                                value={wishlistSetting.layout_type.toString()}
                                onChange={(value) => {
                                    handleChange({
                                        target: {
                                            name: "layout_type",
                                            value
                                        }
                                    })
                                }}
                            />
                            {
                                wishlistSetting.layout_type.toString() === "0" ?
                                    <Select
                                        label={"Grid per row"}
                                        options={GridParRow}
                                        value={wishlistSetting?.grid_per_row?.toString()}
                                        onChange={(value) => {
                                            handleChange({
                                                target: {
                                                    name: "grid_per_row",
                                                    value
                                                }
                                            })
                                        }}
                                    /> : ""
                            }
                            <Checkbox label={"Show variant"} checked={wishlistSetting.show_variant == 1}  onChange={(newChecked) => {
                                handleChange({
                                    target: {
                                        name: "show_variant",
                                        value : newChecked ? 1 : 0
                                    }
                                })
                            }}/>
                            {
                                wishlistSetting.show_variant ?
                                    <Select
                                        label={"Variant type"}
                                        options={variantType}
                                        value={wishlistSetting.variant_type}
                                        onChange={(value) => {
                                            handleChange({
                                                target: {
                                                    name: "variant_type",
                                                    value
                                                }
                                            })
                                        }}
                                    /> : ""
                            }
                        </FormLayout>
                    </Card>
                </Grid.Cell>
                <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 8 }}>
                    <Card>
                        <div className={`wcProduct_${wishlistSetting.layout_type == 0 ? 'grid' :'list'}View ${wishlistSetting.layout_type == 0 ? `wcGrid_${wishlistSetting.grid_per_row}` : ''}`}>
                            {
                                    (products).map((product, index) => {

                                        return (
                                            <div key={`wcProIndex_${index}`} className="wcProductList">
                                                <div className="wcProductCard">
                                                    <div className="wcPcMedia">
                                                        <a >
                                                            <img src={product?.images} alt={product?.title}/>
                                                        </a>
                                                        <div className="wcProductTrigger" >
                                                            <svg viewBox="0 0 20 20"><path d="M13.97 15.03a.75.75 0 1 0 1.06-1.06l-3.97-3.97 3.97-3.97a.75.75 0 0 0-1.06-1.06l-3.97 3.97-3.97-3.97a.75.75 0 0 0-1.06 1.06l3.97 3.97-3.97 3.97a.75.75 0 1 0 1.06 1.06l3.97-3.97 3.97 3.97Z"/></svg>
                                                        </div>
                                                    </div>
                                                    <div className="wcPcContent">
                                                        <h4><a >{product?.title}</a></h4>
                                                        <div className="wcPcPrice">
                                                            {
                                                                product.variants[0].compare_at_pric > product.variants[0].price ? <span className="wcPcComparePrice">
                                                                    <span className='money'>${product.variants[0].compare_at_pric}</span>
                                                                </span> : ''
                                                            }
                                                            <span className="wcPcSalePrice">
                                                                <span className='money'>${product.variants[0].price}</span>
                                                            </span>
                                                        </div>
                                                        {
                                                            (wishlistSetting?.show_variant) ?
                                                                <div className="wcPcVariantBox">
                                                                    {
                                                                        wishlistSetting?.variant_type === 'swatch' ?
                                                                            <Fragment>
                                                                                {
                                                                                    (product?.options || []).map((option, oIndex) => {
                                                                                        debugger
                                                                                        const colorOption = option.name.toLowerCase().indexOf('color') != -1 || option.name.toLowerCase().indexOf('colour') != -1;
                                                                                        return (
                                                                                            <fieldset className="wcPcVariants" key={`wishlistI${index}_Pid_${index}Oindex_${oIndex}`}>
                                                                                                <legend className="wcPcVariantsLegend">
                                                                                                    {option.name}
                                                                                                    {/*<span>{product?.options[oIndex]}</span>*/}
                                                                                                </legend>
                                                                                                <div className={`wcPcSwatch ${colorOption ? 'wcColorSwatch' : ''}`} data-index={oIndex} data-option={option.name}>
                                                                                                    {
                                                                                                        (option.values || []).map((value, vIndex) => {
                                                                                                            const checkedData = product?.options[oIndex] == value;
                                                                                                            const swatchSlug = value.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
                                                                                                            return (
                                                                                                                <div className="wcPcSwatchField" key={`wcI${index}_Pid${index}Oid_${oIndex}Vid_${vIndex}`}>
                                                                                                                    <input
                                                                                                                        type="radio" checked={checkedData}
                                                                                                                        name={`wcI${index}_Pid${index}Oid_${oIndex}`}
                                                                                                                        id={`wcI${index}_Pid${index}Oid_${oIndex}Vid_${vIndex}`}
                                                                                                                        className="wcPcSwatchFieldBtn"
                                                                                                                        value={value}

                                                                                                                    />
                                                                                                                    <label className={`wcPcSwatchFieldLabel ${swatchSlug}`} style={colorOption ? {'backgroundColor': swatchSlug} : {}} htmlFor={`wcI${index}_Pid${index}Oid_${oIndex}Vid_${vIndex}`}>{value}</label>
                                                                                                                </div>
                                                                                                            )
                                                                                                        })
                                                                                                    }
                                                                                                </div>
                                                                                            </fieldset>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </Fragment>
                                                                            : wishlistSetting?.variant_type === 'dropdown' ? <Fragment>
                                                                                {
                                                                                    (product?.options || []).map((option, oIndex) => {
                                                                                        return (
                                                                                            <fieldset className="wcPcVariants" key={`wishlistI${index}_Pid_${index}Oindex_${oIndex}`}>
                                                                                                <legend className="wcPcVariantsLegend">{option?.name}
                                                                                                    {/*<span>{product?.options[oIndex]}</span>*/}
                                                                                                </legend>
                                                                                                <select className="wcPcSelector">
                                                                                                    {
                                                                                                        (option.values || []).map((value, vIndex) => {
                                                                                                            return (
                                                                                                                <option key={`wishlistI${index}_Pid${index}Oid_${oIndex}Vid_${vIndex}`} value={value}>{value}</option>
                                                                                                            )
                                                                                                        })
                                                                                                    }
                                                                                                </select>
                                                                                            </fieldset>
                                                                                        )
                                                                                    })
                                                                                }
                                                                            </Fragment> : <fieldset className="wcPcVariants">
                                                                                <select className="wcPcSelector" value={product?.variant_id} >
                                                                                    {
                                                                                        (product?.variants || []).map((vData, vIndex) => {
                                                                                            return (
                                                                                                <option value={vIndex} key={`wcI${index}_Pid${index}Vid_${vIndex}`}>{vData.title}</option>
                                                                                            )
                                                                                        })
                                                                                    }
                                                                                </select>
                                                                            </fieldset>
                                                                    }
                                                                </div>
                                                                : ''
                                                        }

                                                    </div>

                                                </div>
                                            </div>
                                        )
                                    })
                            }
                        </div>
                    </Card>
                </Grid.Cell>
            </Grid>
        </Layout.Section>
    );
};

export default WishlistPage;