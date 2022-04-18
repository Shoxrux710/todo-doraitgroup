import React, { useState, useEffect } from 'react'
import './conversation.css'
import { FiMoreVertical } from 'react-icons/fi';
import person from '../../images/human-clipart-old-boy-8.png'
import { toast } from 'react-toastify'
import axios from 'axios'

const Conversation = ({ message, count, userId, id, type, token, getGroup, role, avatar }) => {

    const [showed, setShowed] = useState(false)

    console.log("fsdfsdfsdfsdf", message)

    const oneRoom = (items) => {
        axios.delete(`/api/room/delete/${items}`)
            .then(response => {
                getGroup(token)
                toast.success(response.data.successMessage)
            })
        setShowed(false)
    }

    const oneUser = (id) => {
        axios.delete(`/api/users/delete/${id}`)
        .then(response => {
            getGroup(token)
            toast.success(response.data.successMessage)
        })
            
        setShowed(false)
    }

    console.log("wekfmweklfmwke", message)

    const images = message.groupImage ? message.groupImage.fileName : '' 

    return (
        <div className='conversation' key={message._id}>
            <div>
                {message.avatar ?  <img src={`/avatar/${message.avatar}`} alt="" /> : (images ? <img src={`/group/${images}`} alt="" /> : <img src={person} alt="" />)}
                <span>
                    {
                        type === "newChat" ? message.array[0] === id ? message.name : message.username : message.name
                    }
                </span>
            </div>
            {/* {count !== 0 && <div className="circle">{count}</div>} */}
            {
                type === "newChat" ? (
                    <div className='delete'>
                        <FiMoreVertical
                            className="more"
                            onClick={() => setShowed(!showed)}
                        />
                        <div className={showed ? 'delete_items' : 'delete_items active'}>
                            <div
                                className='del'
                                onClick={() => oneUser(message._id)}
                            >delete
                            </div>
                            <div>update</div>
                        </div>
                    </div>
                ) : (
                    role === 'super-admin' && <div className='delete'>
                        <FiMoreVertical
                            className="more"
                            onClick={() => setShowed(!showed)}
                        />
                        <div className={showed ? 'delete_items' : 'delete_items active'}>
                            <div
                                className='del'
                                onClick={() => oneRoom(message._id)}
                            >delete
                            </div>
                            <div>update</div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

export default Conversation