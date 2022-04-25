import React from 'react'
import './workTop.css'


const WorkTop = ({ items, setGroupName, groupName }) => {

    return (
        <h5
            className={items.group === groupName ? 'active' : ''}
            onClick={() => {
                setGroupName(items.group)
            }}
        >{items.group}</h5>
    )
}

export default WorkTop