import React, { useState, useCallback } from "react";

const useExpandToggle = (props) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const toggleExpand = useCallback(() => {
        setIsExpanded(!isExpanded);
    }, [isExpanded])

    return [isExpanded, toggleExpand]
}

export default useExpandToggle