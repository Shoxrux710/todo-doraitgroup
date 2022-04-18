import React, { useState, useEffect } from 'react'
import {taskShow, taskIdShow} from '../../../redux/action/userAction'
import { AiOutlineMore } from 'react-icons/ai';
import { toast } from 'react-toastify'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import './edit.css'


const Edit = ({ items, getOne }) => {

    const { token, task } = useSelector(state => state.userLogin)
    const [show, setShow] = useState(false)
    const [userAll, setUserAll] = useState([])
    const dispatch = useDispatch()

    let color = items.status === 'one' ? '#FA4D4D' : (items.status === 'two' ? '#FFA500' : '#019267')
    let button = items.status === 'one' ? 'Qabul qilish' : (items.status === 'two' ? 'Tugatildi' : 'Tasdiqlash')




    const onDelete = (id) => {
        axios.delete(`/api/task/delete/${id}`, {
            headers: {
                authorization: `Bearer ${token}`
            }
        }).then(response => {
            toast.success(response.data.successMessage)
            getOne()
        }).catch(err => {
            console.log(err)
        })

    }

    const onStatus = (status, id) => {
        axios.put(`/api/task/update`, { color: status, id }, {
            headers: {
                authorization: `Bearer ${token}`
            }
        }).then(response => {
            getOne()
            toast.success(response.data.successMessage)
        }).catch(err => {
            console.log(err)
        })
            
    }

    const onReject = (id) => {
        axios.put(`/api/task/reject`, {id}, {
            headers: {
                authorization: `Bearer ${token}`
            }
        }).then(response => {
            getOne()
            toast.success(response.data.successMessage)
        }).catch(err => {
            console.log(err)
        })
    }

    const getUser = () => {
        axios.get('/api/user/all')
              .then(response => {
                setUserAll(response.data.users)
              }).catch(err => console.log(err))  
    }

    const userId = (id) => {
        dispatch(taskShow(false))
        dispatch(taskIdShow(id))
    }

    useEffect(() => {
        getUser()
    }, [])

    for (let i = 0; i < items.array.length; i++) {

        let user = []
        let one = userAll.filter(item => item._id === items.array[i])

        console.log(user)
    }

    console.log("uses", userAll)
    console.log(items.array)

    

    return (
        <div 
        className='item' 
        style={{ backgroundColor: items.status === 'four' ? '#019267' : '#F9F9F9' }}
        >
            <h4 style={{ backgroundColor: items.status === 'four' ? `black` : `${color}` }}>{items.title}</h4>
            {
                items.status !== 'four' ? <AiOutlineMore
                    className='fa'
                    onClick={() => setShow(!show)}
                /> : ''
            }
            <div 
            className='border' 
            onClick={() => userId(items._id)}
            ></div>
            <div
                className={show ? 'show' : 'show active'}
            >
                <p
                    onClick={() => onDelete(items._id)}
                >O'chirish</p>
                {
                    items.status === 'three'
                        ?
                        <p
                            onClick={() => onReject(items._id)}
                        >Rad etish</p>
                        : ''
                }
            </div>
            <div className='date'>
                <span className={items.status === 'four' ? 'active' : ''}>{items.date.substring(0, 10)}</span>
                <span className={items.status === 'four' ? 'active' : ''}>{items.endDate}</span>
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
                <p className={items.status === 'four' ? 'active' : ''}>Temur Jo'rayev...</p>
                {
                    items.status !== 'four' ? <button
                        style={{ backgroundColor: `${color}` }}
                        onClick={() => onStatus(items.status, items._id)}
                    >{button}</button> : ''
                }
            </div>
        </div>
    )
}

export default Edit