import React from "react";
import useExpandToggle from "helpers/hooks/useExpandToggle";
import './style/ExpandButton.scss';

const ExpandButton = ({ isExpanded, toggleExpand }) => {
    return ([
        isExpanded,
        <button
            className="ExpandButton"
            onClick={toggleExpand}
        >
            {isExpanded ? 'Close' : 'Expand'}
        </button>
    ])
}

export default ExpandButton