import React from "react";

interface SectionInfoProps {
    className: string,
    children: React.ReactNode
}

const SectionInfo = ({ className, children }: SectionInfoProps): JSX.Element => {
    
    return (
        <div className={className}>
            {children}
        </div>
    )
}

export default SectionInfo