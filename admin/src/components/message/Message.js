import React, { useState, useEffect, useRef } from 'react'
import Conversation from '../conversations/Conversation'
import ChatMessage from '../messageChat/ChatMessage'
import { useSelector } from 'react-redux'
import user from '../../images/human-clipart-old-boy-8.png'
import { HiArrowSmLeft } from 'react-icons/hi';
import { toast } from 'react-toastify'
import { MdSend } from 'react-icons/md';
import { FaBars } from 'react-icons/fa';
import chat from '../../images/chat.png'
import ScrollToBottom from 'react-scroll-to-bottom'
import { FaImage } from 'react-icons/fa';
import { TiArrowRight, TiArrowLeft } from 'react-icons/ti';
import User from './User'
import axios from 'axios'
import './message.css'

const Message = ({ socket }) => {

    const { token, id } = useSelector(state => state.userLogin)
    const [show, setShow] = useState(false)
    const [backImages, setBackImages] = useState(true)
    const [name, setName] = useState("")
    const [userName, setUserName] = useState("")
    const [users, setUsers] = useState([])
    const [message, setMessage] = useState([])
    const [userId, setUserId] = useState(null)
    const [newGroup, setNewGroup] = useState([])
    const [currentChat, setCurrentChat] = useState(null)
    const [newMessage, setNewMessage] = useState("")
    const [checked, setChecked] = useState(null)
    const [menu, setMenu] = useState(false)
    const [avatarImage, setAvatarImage] = useState(null)

    const names = currentChat ? (currentChat.array[0] === id ? currentChat.name : currentChat.username) : ''
    const otherId = currentChat ? currentChat._id : ''
    const images = currentChat ? currentChat.avatar : ''

    const userDate = (token) => {
        axios.get('/api/user/date', {
            headers: {
                authorization: `Bearer ${token}`
            }
        }).then(response => {
            setUserName(response.data.user)
        })
    }


    const getUser = (token) => {
        axios.get(`/api/user/other`, {
            headers: {
                authorization: `Bearer ${token}`
            }
        }).then(response => {
            setUsers(response.data.user)
        }).catch(err => console.log(err))
    }

    const getGroup = (token) => {
        axios.get(`/api/users/`, {
            headers: {
                authorization: `Bearer ${token}`
            }
        }).then(response => {
            setNewGroup(response.data.users)
        }).catch(err => console.log(err))
    }



    const handleSubmit = () => {

        const messages = {
            members: [
                id,
                otherId,
            ],
            text: newMessage,
            userImages: userName.avatar.fileName,
            date: new Date(Date.now())
        }

        axios.post(`/api/message`, messages, {
            headers: {
                authorization: `Bearer ${token}`
            }
        }).then(response => {
            setNewMessage("")
            socket.emit("send_message", messages)
            setMessage((list) => [...list, messages])
        }).catch(err => console.log(err))

    }



    const getMessage = (otherId, token) => {
        axios.get(`/api/message/users?otherId=${otherId}`, {
            headers: {
                authorization: `Bearer ${token}`
            }
        }).then(response => {
            setMessage(response.data.user)
        })

    }

    useEffect(() => {
        socket.on("receive_message", (data) => {
            setMessage((list) => [...list, data])
        })
    }, [socket])


    const joinRoom = (otherId) => {
        socket.emit("join_room", otherId)
    }

    const onRight = () => {
        const array = [id, userId]
        const rooms = {
            name,
            username: userName.name,
            array,
            avatar: avatarImage
        }
        console.log("array", array)
        axios.post('/api/users', rooms)
            .then(response => {
                setShow(false)
                setUserId(null)
                setName("")
                getUser(token)
                getGroup(token)
                userDate(token)
                setChecked(null)
                toast.success(response.data.successMessage)
            }).catch(e => {
                toast.error(e.response.data.errorMessage)
            })
    }

    useEffect(() => {
        getMessage(otherId, token)
    }, [otherId, token])

    useEffect(() => {
        getUser(token)
        getGroup(token)
        userDate(token)
    }, [token])

    console.log("message", images)


    return (
        <div className='message'>
            <div className={menu ? "chatMenu active" : "chatMenu"}>
                <div className={show ? "create active" : "create"}>
                    <h3>new User</h3>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        type="text"
                        placeholder='group'
                    />
                    <div className="maps">
                        {
                            users.length ?
                                users.map((items) => {
                                    return (
                                        <>
                                            <User
                                                user={items}
                                                setArray={setUserId}
                                                array={userId}
                                                show={show}
                                                checked={checked}
                                                setChecked={setChecked}
                                                setAvatarImage={setAvatarImage}
                                            />
                                        </>
                                    )
                                }) : <div className="groupEmpty">
                                    <p>Empty</p>
                                </div>
                        }
                    </div>
                    <TiArrowRight
                        onClick={() => onRight()}
                        className={userId ? "faRight" : "faRight active"}
                    />
                    <TiArrowLeft
                        onClick={() => {
                            setShow(false)
                            setChecked(null)
                            setUserId(null)
                            setAvatarImage(null)
                        }}
                        className="faLeft"
                    />
                </div>
                <div className="chatMenuWrapper">
                    <div>
                        <FaBars
                            className="faBars"
                            onClick={() => setShow(true)}
                        />
                        <input type="text" placeholder='Search' />
                    </div>
                    {
                        newGroup.length ?
                            newGroup.map((items) => {
                                return (
                                    <div onClick={() => {
                                        setCurrentChat(items)
                                        joinRoom(items._id)
                                        setMenu(!menu)
                                    }}>
                                        <Conversation
                                            message={items}
                                            key={items._id}
                                            userId={userId}
                                            id={id}
                                            type="newChat"
                                            getGroup={getGroup}
                                            token={token}
                                            avatar={images}
                                        />
                                    </div>
                                )
                            }) : <div className="groupEmpty">
                                <p>Empty</p>
                            </div>
                    }
                </div>
            </div>
            <div className={menu ? "chatBox" : "chatBox active"}>
                <div className="chatBoxWrapper">
                    {
                        currentChat ?
                            <>
                                <div className="chatUser">
                                <HiArrowSmLeft 
                                    onClick={() => setMenu(!menu)}
                                    className='left'/>
                                    <div className="chatFlex">
                                        {images ? <img src={`/avatar/${images}`} alt="" /> : <img src={user} alt="" />}
                                        <p>{names}</p>
                                    </div>
                                    <div>
                                        <FaImage className="back" onClick={() => setBackImages(!backImages)} />
                                        <input type="text" placeholder='Search' />
                                    </div>
                                </div>
                                <div className="chatBoxTop" style={{ backgroundColor: backImages ? "#83C3FF" : "#002046" }}>
                                    <ScrollToBottom className="chatBoxTop-container">
                                        {
                                            message.map((m) => {
                                                return (
                                                    <ChatMessage
                                                        messageChat={m}
                                                        own={m.members[0] === id}
                                                        key={m._id}
                                                        setMessage={setMessage}
                                                        getMessage={getMessage}
                                                        token={token}
                                                        otherId={otherId}
                                                        data={message}
                                                        socket={socket}
                                                        userName={userName}
                                                    />
                                                )
                                            })
                                        }
                                    </ScrollToBottom>
                                </div>
                                <div className="chatBoxBottom">
                                    <input
                                        type="text"
                                        placeholder='write something...'
                                        className='chatInput'
                                        name='newMessage'
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={(event) => {
                                            event.key === "Enter" && handleSubmit()
                                        }}
                                    />
                                    <MdSend
                                        onClick={handleSubmit}
                                        className={newMessage ? "send" : "send active"}
                                    />
                                </div>
                            </> : <span className="noConversation">
                                <img src={chat} alt="" />
                            </span>}
                </div>
            </div>
        </div>
    )
}

export default Message
