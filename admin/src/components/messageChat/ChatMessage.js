import React, {useEffect} from 'react'
import moment from 'moment'
import user from '../../images/human-clipart-old-boy-8.png'
import { toast } from 'react-toastify'
import axios from 'axios'
import './chatMessage.css'

const ChatMessage = ({own, data, socket, messageChat, setMessage, getMessage, otherId, token}) => {

    const newDate = new Date(messageChat.date)


    const oneDelete = (id) => {
        axios.get(`/api/message/other?messageId=${id}`)
            .then(response => {
                // let data = response.data
                socket.emit("send_delete", id)
                // setMessage((list) => [...list, response.data.user])
                getMessage(otherId, token)
                // toast.success(response.data.successMessage)
            })
     
    }

    // useEffect(() => {
    //     socket.on("receive_delete", (data) => {
    //         setMessage((list) => [...list, data])
    //     })
    // }, [socket])

    return (
        <div className={own ? 'chatMessage own' : 'chatMessage'}>
            <div className="chatTop">
                    {own ? 
                    <>                    
                    <div className='text'>
                        <p>{messageChat.text}</p>
                    <span>{newDate.getHours()}:{newDate.getMinutes()}</span>
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
