import React from "react";
import './style/OverviewItem.scss';

const OverviewItem = ({props}) => {
    const { n, colour, type } = props;
    const { r, g, b } = colour;

    return (
        <div 
            className="OverviewItem"
            style={{border: `2px solid rgb(${r}, ${g}, ${b})`}}
        >
            {n}
        </div>
    )
}

export default OverviewItem