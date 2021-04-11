import React from "react";

const TrackedTabsDescription = (props) => {
    
    return (
        <div className="TrackedTabs__description">
            Here, you'll find the contents of the most recent snapshot of your Stash.
            You can choose to either periodically automatically grab a new snapshot, or manually grab a snapshot whenever you wish (with a slight cooldown for rate limiting purposes).
        </div>
    )
}

export default TrackedTabsDescription