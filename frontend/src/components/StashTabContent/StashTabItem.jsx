import React from "react";
import './style/StashTabItem.scss'

const StashTabItem = ({ item }) => {

    return (
        <li className="StashTabItem">
            <div className="StashTabItem__icon">
                <img 
                    className="StashTabItem__icon--image"
                    alt={item.typeLine} 
                    src={item.icon} 
                /> 

                <span className="StashTabItem__icon--count">
                    {+item.totalChaosValue.toFixed(1)}<em>c</em> 
                </span>

            </div>
        </li>)
}

export default StashTabItem