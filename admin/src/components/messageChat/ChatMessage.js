import React, {useState, useEffect } from 'react'
import moment from 'moment'
import user from '../../images/human-clipart-old-boy-8.png'
import { toast } from 'react-toastify'
import { BsCheck, BsCheckAll } from 'react-icons/bs';
import axios from 'axios'
import './chatMessage.css'

const ChatMessage = ({ own, messageChat, setMessage, getMessage, otherId, token, socket }) => {

    const newDate = new Date(messageChat.date)

    const [show, setShow] = useState(false)

    // const oneDelete = (messageId) => {
    //     axios.get(`/api/message/other?messageId=${messageId}`)
    //         .then(response => {
    //             let data = response.data
    //             socket.emit("send_delete", messageId, data)
    //             setMessage((list) => [...list, response.data.user])
    //             getMessage(otherId, token)
    //             toast.success(response.data.successMessage)
    //         }).catch(err => console.log(err))

    // }

    const onModal = () => {
        getMessage(otherId, token)
        setShow(!show)
    }


    // useEffect(() => {
    //     socket.on("data_message", (data) => {
    //         setMessage((list) => [...list, data])
    //     })

    // }, [socket])

    return (
        <div className={own ? 'chatMessage own' : 'chatMessage'}>
            <div className="chatTop">
                {own ?
                    <>
                        <div className='text' onClick={() => onModal()}>
                            <p>{messageChat.text}</p>
                            <div className={show ? 'modal' : 'modal active'}
                            // onClick={() => oneDelete(messageChat._id)}
                            >delete</div>
                            <span>{newDate.getHours()}:{newDate.getMinutes()} <BsCheckAll /> </span>
                        </div>
                    </> :
                    <>
                        {messageChat.userImages ? <img src={`/avatar/${messageChat.userImages}`} alt="" /> : <img src={user} alt="" />}
                        <div className='text'>
                            <div className="name">{messageChat.name}</div>
                            <p>{messageChat.text}</p>
                            <span>{newDate.getHours()}:{newDate.getMinutes()}</span>
                        </div>
                    </>
                }
            </div>
        </div>
    )
}

export default ChatMessage
