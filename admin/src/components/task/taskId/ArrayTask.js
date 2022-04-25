import React, { useState, useEffect } from 'react'
import { TiDeleteOutline } from 'react-icons/ti';
import './arrayTask.css'

const ArrayTask = ({ items, taskCircle, taskArray, setTaskArray, role }) => {

    const [show, setShow] = useState(false)

    const onDelete = (id) => {
        const deleteItem = taskArray.filter(item => item.text !== id)
        setTaskArray(deleteItem)
    }


    return (
        <div className='line'>
            <div
                className={items.isClick ? 'circle active' : 'circle'}
                onClick={() => taskCircle(items._id)}
            ></div>
            <p>{items.text}</p>
            {
                role === 'user' ? '' :
                    <TiDeleteOutline
                        className='task-delete'
                        onClick={() => setShow(!show)}
                    />
            }
            <div className={show ? 'delete-modal' : 'delete-modal active'}>
                <div className='modal'>
                    <h5>Delete</h5>
                    <div>
                        <p
                            onClick={() => onDelete(items.text)}
                        >Yes</p>
                        <p
                            onClick={() => setShow(!show)}
                        >No</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ArrayTask