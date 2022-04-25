import React, { useState, useEffect } from 'react'
import { FaBars } from 'react-icons/fa';
import { MdSend } from 'react-icons/md';
import { useSelector } from 'react-redux'
import { TiArrowRight, TiArrowLeft } from 'react-icons/ti';
import { HiArrowSmLeft } from 'react-icons/hi';
import { FaUserCircle } from 'react-icons/fa';
import { FaImage } from 'react-icons/fa';
import person from '../../images/human-clipart-old-boy-8.png'
import { toast } from 'react-toastify'
import chat from '../../images/chat.png'
import ChatMessage from '../messageChat/ChatMessage'
import Conversation from '../conversations/Conversation'
import ScrollToBottom from 'react-scroll-to-bottom'
import axios from 'axios'
import Create from './Create'
import './group.css'

const Group = ({ socket }) => {

    const { token, id, role } = useSelector(state => state.userLogin)
    const [show, setShow] = useState(false)
    const [backImages, setBackImages] = useState(true)
    const [name, setName] = useState("")
    const [users, setUsers] = useState([])
    const [array, setArray] = useState([id])
    const [message, setMessage] = useState([])
    const [currentChat, setCurrentChat] = useState(null)
    const [newMessage, setNewMessage] = useState("")
    const [newGroup, setNewGroup] = useState([])
    const [userName, setUserName] = useState("")
    const [groupImage, setGroupImage] = useState("")
    const [avatarFront, setAvatarFront] = useState(null);
    const [menu, setMenu] = useState(false)
    const [count, setCount] = useState(0)

    const username = currentChat ? currentChat.name : ''
    const otherId = currentChat ? currentChat._id : ''
    const imageGroup = currentChat ? currentChat.groupImage.fileName : ''

    const userDate = (token) => {
        axios.get('/api/user/date', {
            headers: {
                authorization: `Bearer ${token}`
            }
        }).then(response => {
            setUserName(response.data.user)
        }).catch(err => console.log(err))
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
        axios.get(`/api/room/`, {
            headers: {
                authorization: `Bearer ${token}`
            }
        }).then(response => {
            setNewGroup(response.data.group)
        }).catch(err => console.log(err))
    }

    const getMessage = (otherId) => {
        axios.get(`/api/group?otherId=${otherId}`)
            .then(response => {
                setMessage(response.data.groups)
            }).catch(err => console.log(err))

    }

    const onRight = (e) => {
        e.preventDefault()
        const formData = new FormData(e.target)
        formData.append('array', array)

        axios.post('/api/room', formData)
            .then(response => {
                setShow(false)
                setArray([id])
                setName("")
                getGroup(token)
                setAvatarFront(null)
                toast.success(response.data.successMessage)
            }).catch(e => {
                toast.error(e.response.data.errorMessage)
            })
    }

    const handleSubmit = () => {
        const messages = {
            members: [
                id,
                otherId
            ],
            userImages: userName.avatar.fileName,
            text: newMessage,
            name: userName.name,
            date: new Date(Date.now())
        }

        axios.post('/api/group', messages, {
            headers: {
                authorization: `Bearer ${token}`
            }
        }).then((response) => {
            socket.emit("send_message", messages)
            // getMessage(otherId)
            setMessage((list) => [...list, messages])
            setNewMessage("")
        }).catch(err => console.log(err))


    }


    useEffect(() => {
        socket.on("receive_message", (data) => {
            console.log(data)
            setMessage((list) => [...list, data])
        })
    }, [socket])

    const joinRoom = (otherId) => {
        socket.emit("join_room", otherId)
    }

    let groupImg

    if (avatarFront){
        groupImg = URL.createObjectURL(avatarFront);
    }else{
        groupImg = <>
        <FaUserCircle className='fa' />
        </>
    }

    useEffect(() => {
        getUser(token)
        getGroup(token)
        userDate(token)
    }, [token])

    useEffect(() => {
        getMessage(otherId)
    }, [otherId])

    return (
        <div className="group">
            <div className={menu ? "telegram active" : "telegram"}>
                <form
                    onSubmit={onRight}
                    className={show ? "create active" : "create"}>
                    <h3>new Group</h3>
                    <div className='files'>
                        <label htmlFor='file'>
                            {
                                avatarFront ? <img src={groupImg} alt="" className='fa' /> : groupImg
                            }
                        </label>
                        <input
                            className='file-items'
                            type="file"
                            id="file"
                            name="groupImage"
                            files={groupImage}
                            onChange={e => {
                                const file = Array.from(e.target.files);
                                setGroupImage(e.target.files)
                                setAvatarFront(file[0]);
                            }}
                        />
                        <input
                            value={name}
                            name="name"
                            onChange={(e) => setName(e.target.value)}
                            type="text"
                            placeholder='group'
                        />
                    </div>
                    <div className="maps">
                        {
                            users.map((items) => {
                                return (
                                    <>
                                        <Create
                                            show={show}
                                            create={items}
                                            setArray={setArray}
                                            array={array}
                                        />
                                    </>
                                )
                            })
                        }
                    </div>
                    <button
                        type="submit"
                        className={array.length !== 1 ? "faRight" : "faRight active"}>
                        <TiArrowRight className='fa' />
                    </button>
                    <TiArrowLeft
                        onClick={() => {
                            setShow(false)
                            setArray([id])
                        }}
                        className="faLeft"
                    />
                </form>
                <div className="chatMenu">
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                        {role === 'super-admin' && <FaBars
                            className="faBars"
                            onClick={() => setShow(true)}
                        />}
                        <input type="text" placeholder='Search' />
                    </div>
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
                                        count={count}
                                        getGroup={getGroup}
                                        token={token}
                                        role={role}
                                    />
                                </div>
                            )
                        }) : <div className="groupEmpty">
                            <p>Empty</p>
                        </div>
                }
            </div>
            <div className={menu ? "chatBox" : "chatBox active"}>
                <div className="chatBoxWrapper">
                    {
                        currentChat ?
                            <>
                                <div className="chatUser">
                                    <HiArrowSmLeft
                                        onClick={() => setMenu(!menu)}
                                        className='left' />
                                    <div className="chatFlex">
                                        {
                                            imageGroup ? <img src={`/group/${imageGroup}`} alt="" /> : <img src={person} alt="" />
                                        }
                                        <p>{username}</p>
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
    );
};

export default Group;
