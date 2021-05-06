import React, { useCallback, useState } from "react";
import './style/StashTabItem.scss'
import { getPoeItemId, makePoeTradeExchangeUrl } from 'helpers/poeApi'

const StashTabItem = ({ item }) => {
    const totalChaosValue = item.chaosValue * (item.stackSize || 1);
    const [showTotalValue, setShowTotalValue] = useState(true);

    const toggleValueDisplay = useCallback(() => {
        if (totalChaosValue > 0) {
            setShowTotalValue(cur => !cur)
        }
    }, [showTotalValue])

    const query: { have: string[], want: string[], minimum: number } = {
        want: [getPoeItemId(item.typeLine)],
        have: ['chaos'],
        minimum: 5
    }

    return (
        <li className="StashTabItem">
            <div className="StashTabItem__icon">
                <a 
                    href={makePoeTradeExchangeUrl(query)}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    <img 
                        className="StashTabItem__icon--image"
                        title={item.typeLine} 
                        alt={item.typeLine}
                        src={item.icon} 
                    /> 
                </a>

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