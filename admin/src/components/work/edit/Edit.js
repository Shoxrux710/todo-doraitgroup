import React, { useState, useEffect } from 'react'
import { taskShow, taskIdShow, taskCall } from '../../../redux/action/userAction'
import { AiOutlineMore } from 'react-icons/ai';
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import './edit.css'


const Edit = ({ items, getOne, edit }) => {

    const { token, task, role } = useSelector(state => state.userLogin)
    const [show, setShow] = useState(false)
    const [userAll, setUserAll] = useState([])
    const dispatch = useDispatch()

    let color = items.status === 'one' ? '#FA4D4D' : (items.status === 'two' ? '#FFA500' : '#019267')
    let button = items.status === 'one' ? 'Qabul qilish' : (items.status === 'two' ? 'Tugatildi' : 'Tasdiqlash')




    const onDelete = (id, group) => {
        axios.delete(`/api/task/delete/${id}`, {
            headers: {
                authorization: `Bearer ${token}`
            }
        }).then(response => {
            toast.success(response.data.successMessage)
            dispatch(taskCall())
            getOne(group)
        }).catch(err => {
            console.log(err)
        })

    }

    const onStatus = (status, id, group) => {
        axios.put(`/api/task/update`, { color: status, id }, {
            headers: {
                authorization: `Bearer ${token}`
            }
        }).then(response => {
            toast.success(response.data.successMessage)
            getOne(group)
        }).catch(err => {
            console.log(err)
        })
    }

    const onReject = (id, group) => {
        axios.put(`/api/task/reject`, { id }, {
            headers: {
                authorization: `Bearer ${token}`
            }
        }).then(response => {
            getOne(group)
            toast.success(response.data.successMessage)
        }).catch(err => {
            console.log(err)
        })
    }

    const getUser = () => {
        axios.get('/api/user/other', {
            headers: {
                authorization: `Bearer ${token}`
            }
        }).then(response => {
            setUserAll(response.data.user)
        }).catch(err => console.log(err))
            
    }

    const userId = (id) => {
        dispatch(taskShow(false))
        dispatch(taskIdShow(id))
    }

    useEffect(() => {
        getUser()
    }, [])


    let arr = []

    edit.forEach(e => {
        let avar = userAll.find(item => item._id === e)
        if (avar){
            arr.push(avar)
        }
    });

    
    console.log("user", arr)
    console.log("user", edit)
    return (
        <div
            className='item'
            style={{ backgroundColor: items.status === 'four' ? '#019267' : '#F9F9F9' }}
        >
            <h4 style={{ backgroundColor: items.status === 'four' ? `black` : `${color}` }}>{items.title}</h4>
            {
                role === 'user' ? '' : (
                    items.status !== 'four' ? <AiOutlineMore
                        className='fa'
                        onClick={() => setShow(!show)}
                    /> : ''
                )
            }
            <div
                className='border'
                onClick={() => userId(items._id)}
            ></div>
            <div
                className={show ? 'show' : 'show active'}
            >
                <p
                    onClick={() => onDelete(items._id, items.group)}
                >O'chirish</p>
                {
                    items.status === 'three'
                        ?
                        <p
                            onClick={() => onReject(items._id, items.group)}
                        >Rad etish</p>
                        : ''
                }
            </div>
            <div className='date'>
                <span className={items.status === 'four' ? 'active' : ''}>{items.date.substring(0, 10)}</span>
                <span className={items.status === 'four' ? 'active' : ''}>{items.didline.didlineDate.substring(0,10)}</span>
            </div>
            <p className={items.status === 'four' ? 'active' : ''}>{items.description}</p>
            <ul>
                {
                    items.taskArray.map((item, index) => {
                        return (
                            <li key={index + 1} className={items.status === 'four' ? 'active' : ''}><div className={item.isClick ? 'circle active' : 'circle'}></div>{item.text}</li>
                        )
                    })
                }
            </ul>
            <div className='button'>
                <div>
                {
                     arr.length ? arr.map((item, index) => {
                        return (
                            <p className={items.status === 'four' ? 'active' : ''} key={index}>{item ? item.name : ''}</p>
                        )
                    }) : ''
                }
                </div>
                {
                    items.status !== 'four' ? <button
                        style={{ backgroundColor: `${color}` }}
                        onClick={() => onStatus(items.status, items._id, items.group)}
                    >{button}</button> : ''
                }
            </div>
        </div>
    )
}

export default Edit