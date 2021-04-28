import React, { useCallback, useState } from "react";
import './style/StashTabItem.scss'

const StashTabItem = ({ item }) => {
    const totalChaosValue = item.chaosValue * (item.stackSize || 1);
    const [showTotalValue, setShowTotalValue] = useState(true);

    const toggleValueDisplay = useCallback(() => {
        if (totalChaosValue > 0) {
            setShowTotalValue(cur => !cur)
        }
    }, [showTotalValue])

    return (
        <li className="StashTabItem">
            <div className="StashTabItem__icon">
                <img 
                    className="StashTabItem__icon--image"
                    title={item.typeLine} 
                    alt={item.typeLine}
                    src={item.icon} 
                /> 

                <span 
                    className="StashTabItem__icon--value"
                    onMouseEnter={toggleValueDisplay}
                    onMouseLeave={toggleValueDisplay}
                >
                    {showTotalValue ? +totalChaosValue.toFixed(1) : item.chaosValue.toFixed(2)}<em>c</em> 
                </span>

                <span 
                    className="StashTabItem__icon--count"
                    title="item count"
                >
                    {item.stackSize}
                </span>

            </div>
        </li>)
}

export default StashTabItem