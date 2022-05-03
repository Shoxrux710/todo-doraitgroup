import React from 'react'
import './workTop.css'


const WorkTop = ({ items, setGroupName, groupName}) => {
    return (
        <h5
            className={items === groupName ? 'active' : ''}
            onClick={() => {
                setGroupName(items)
            }}
        >{items}</h5>
    )
}

export default WorkTop