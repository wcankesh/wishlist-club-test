import React, { Fragment, useId} from 'react';

// import React, {useEffect, useRef, useState, Fragment} from 'react';
// import { SketchPicker } from 'react-color'

const ColorInput = ({ name,value, onChange, label }) => {
    const uniqId = useId();

    // const [clickedOutside, setClickedOutside] = useState(false);
    // const myRef = useRef();
    // const handleClickOutside = (e) => {
    //     if (!myRef.current.contains(e.target)) {
    //         setClickedOutside(false);
    //     }
    // };
    //
    // const handleClickInside = () => setClickedOutside(true);
    //
    // useEffect(() => {
    //     document.addEventListener("mousedown", handleClickOutside);
    //     return () => document.removeEventListener("mousedown", handleClickOutside);
    // });

    console.log("value", value)


    return (
        <div>
            <div className="Polaris-Labelled__LabelWrapper">
                <div className="Polaris-Label">
                    <label className="Polaris-Label__Text" htmlFor={`color${uniqId}picker`}>
                        {label}
                    </label>
                </div>
            </div>


            <div className="color_picker">
                <input
                    type="color"
                    name={name}
                    id={`color${uniqId}picker`}
                    value={value}
                    onChange={(e) =>
                        onChange({
                            target: {
                                name: e.target.name,
                                value: `#${e.target.value.substring(1)}`, // Ensures # is included
                            },
                        })
                    }
                />
                <input
                    className="lbl-color"
                    value={value}
                    type="text"
                    name={name}
                    onChange={(e) =>
                        onChange({
                            target: {
                                name: e.target.name,
                                value: `#${e.target.value.replaceAll(' ', '').replace(/^#*/, '')}`, // Ensures # is included
                            },
                        })
                    }
                />
            </div>

            {/*<div className="color_picker" onClick={handleClickInside} ref={myRef}>*/}
            {/*    <div style={{background: value}} className="color_picker_color"></div>*/}
            {/*    <span id={name}>{value ? value: "#000000"}</span>*/}
            {/*    {*/}
            {/*        clickedOutside && <SketchPicker presetColors={[]} color={ value ? value: "#000000" } onChange={ (color) => onChange({target: {name:name, value:color.hex}})}/>*/}
            {/*    }*/}
            {/*</div>*/}
        </div>
    );
};

export default ColorInput;