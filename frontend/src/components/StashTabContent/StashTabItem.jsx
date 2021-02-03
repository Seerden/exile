import React from "react";
import './style/StashTabItem.scss'

const StashTabItem = ({ item }) => {

    return (
        <li className="StashTabItem">
            {/* <span>
                {item.stackSize || 1} 
            </span>
            <img 
                alt={item.typeLine} 
                src={item.icon} 
                height={35}
                width={35}
            /> 
            <span>
                <strong>{+item.totalChaosValue.toFixed(1)}</strong> <em>c</em>
            </span> */}

            <div className="StashTabItem__icon">
                <img 
                    className="StashTabItem__icon--image"
                    alt={item.typeLine} 
                    src={item.icon} 
                    // height={45}
                    // width={45}
                /> 
                <span className="StashTabItem__icon--count">
                    {/* {item.stackSize || 1} */}
                    {+item.totalChaosValue.toFixed(1)}<em>c</em> 
                </span>

            </div>
        </li>)
}

export default StashTabItem