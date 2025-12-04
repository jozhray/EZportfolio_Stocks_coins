import React from 'react'
import clsx from 'clsx'

const Card = ({ children, className }) => {
    return (
        <div className={clsx("card-on-gradient rounded-xl shadow-lg p-6", className)}>
            {children}
        </div>
    )
}

export default Card
