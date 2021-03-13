import React from "react";
import './style/StashTabItem.scss'

const StashTabItem = ({ item }) => {
    const totalChaosValue = item.chaosValue * (item.stackSize || 1);
    console.log(item, totalChaosValue);

    return (
        <li className="StashTabItem">
            <div className="StashTabItem__icon">
                <img 
                    className="StashTabItem__icon--image"
                    title={item.typeLine} 
                    alt={item.typeLine}
                    src={item.icon} 
                /> 

                <span className="StashTabItem__icon--value">
                    {+totalChaosValue.toFixed(1)}<em>c</em> 
                </span>

                <span className="StashTabItem__icon--count">
                    {item.stackSize}
                </span>

            </div>
        </li>)
}

export default StashTabItem