import React from 'react'

const ArrayTask = ({ items, taskCircle }) => {

    return (
        <div className='line'>
            <div
                className={items.isClick ? 'circle active' : 'circle'}
                onClick={() => taskCircle(items._id)}
            ></div>
            <p>{items.text}</p>
        </div>
    )
}

export default ArrayTask