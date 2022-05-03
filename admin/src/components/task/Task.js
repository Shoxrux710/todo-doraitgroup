import React, { useState, useEffect } from 'react'
import { taskShow, taskCall } from '../../redux/action/userAction'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import InputMask from 'react-input-mask';
import axios from 'axios'
import User from './taskId/User'
import ArrayTask from './taskId/ArrayTask'
import './task.css'

const Task = () => {


    const { token, id, taskId, role } = useSelector(state => state.userLogin)
    const [users, setUsers] = useState([])
    const [taskAdd, setTaskAdd] = useState("")
    const [taskArray, setTaskArray] = useState([])
    const [title, setTitle] = useState("")
    const [group, setGroup] = useState("")
    const [didlineDate, setDidlineDate] = useState("")
    const [time, setTime] = useState("")
    const [description, setDescription] = useState("")
    const [array, setArray] = useState([])
    const [userAll, setUserAll] = useState([])

    const dispatch = useDispatch()


    const dateNow = didlineDate.split('.')
    const timeNow = time.split(':')
    const endDates = new Date(Date.UTC(dateNow[2], dateNow[1] - 1, dateNow[0], timeNow[0], timeNow[1]))


    const getUser = (token) => {
        axios.get(`/api/user/other`, {
            headers: {
                authorization: `Bearer ${token}`
            }
        }).then(response => {
            setUsers(response.data.user)
        }).catch(err => console.log(err))
    }

    const getUserOther = (token) => {
        axios.get('/api/user/other', {
            headers: {
                authorization: `Bearer ${token}`
            }
        }).then(response => {
            setUserAll(response.data.user)
        }).catch(err => console.log(err))

    }


    const onTask = () => {
        setTaskArray([...taskArray, { text: taskAdd }])
        setTaskAdd("")
    }


    const onSubmit = () => {
        const task = {
            title,
            description,
            group,
            didlineDate: endDates,
            taskArray,
            array
        }

        const method = taskId ? "put" : "post"
        const urlApi = taskId ? `/api/task/all/${taskId}` : '/api/task'

        axios[method](urlApi, task, {
            headers: {
                authorization: `Bearer ${token}`
            }
        }).then(response => {
            dispatch(taskShow(true))
            dispatch(taskCall())
            toast.success(response.data.successMessage)
        }).catch(err => {
            toast.error(err.response.data.errorMessage)
        })
    }

    useEffect(() => {
        if (taskId) {
            axios.get(`/api/task/userId/${taskId}`)
                .then(response => {
                    const { title, description, didline, array, group, taskArray } = response.data.userId
                    setTitle(title)
                    setGroup(group)
                    setArray(array)
                    setTaskArray(taskArray)
                    setDescription(description)
                    const didlineDate = new Date(didline.didlineDate);
                    const year = didlineDate.getUTCFullYear()
                    const day = didlineDate.getUTCDate()
                    const month = didlineDate.getUTCMonth() + 1
                    const hours = didlineDate.getUTCHours()
                    const minutes = didlineDate.getUTCMinutes()
                    const moon = month.toString().length === 1 ? `0${month}` : month
                    const dayNow = day.toString().length === 1 ? `0${day}` : day
                    const hour = hours.toString().length === 1 ? `0${hours}` : hours
                    const minut = minutes.toString().length === 1 ? `0${minutes}` : minutes
            
                    setDidlineDate(`${dayNow}.${moon}.${year}`)
                    setTime(`${hour}:${minut}`)
                })
        }
    }, [taskId])


    const taskCircle = (id) => {

        for (let i = 0; i < taskArray.length; i++) {
            if (taskArray[i]._id === id) {
                taskArray[i].isClick = !taskArray[i].isClick
                setTaskArray([...taskArray])
            }
        }
    }


    let arr = []

    array.forEach(e => {
        let avar = userAll.find(item => item._id === e)
        if (avar) {
            arr.push(avar)
        }
    });

    useEffect(() => {
        getUser(token)
        getUserOther(token)
    }, [token])

    return (
        <div className='task'>
            <div className='add_task'>
                <p
                    className='delete'
                    onClick={() => dispatch(taskShow(true))}
                >x</p>
                <h3>Add Task</h3>
                <form>
                    {
                        role === 'user' ? <div className='user'><p>Project name:</p><span>{title}</span></div> :
                            <div className="control">
                                <label>Project name</label>
                                <input
                                    type="text"
                                    placeholder='Project name'
                                    value={title}
                                    onChange={(e) => {
                                        setTitle(e.target.value)
                                    }}
                                />
                            </div>
                    }
                    {
                        role === 'user' ? <div className='user'><p>Name the task:</p><span>{description}</span></div> : <div className="control">
                            <label>Name the task</label>
                            <textarea
                                type="text"
                                placeholder='Name the task'
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value)
                                }}
                            />
                        </div>
                    }
                    {
                        role === 'user' ? '' : <div className='add'>
                            <div className="add_item">
                                <label>Task</label>
                                <input
                                    type="text"
                                    placeholder='Add task'
                                    value={taskAdd}
                                    onChange={(e) => {
                                        setTaskAdd(e.target.value)
                                    }}
                                />
                            </div>
                            <div
                                className={taskAdd ? 'save' : 'save active'}
                                onClick={() => onTask()}
                            >Add task</div>
                        </div>
                    }
                    <div style={{ marginBottom: '15px', fontSize: '18px' }}>Task</div>
                    {
                        taskArray.map((items, index) => {
                            return (
                                <ArrayTask
                                    key={index + 1}
                                    role={role}
                                    token={token}
                                    taskId={taskId}
                                    items={items}
                                    taskCircle={taskCircle}
                                    taskArray={taskArray}
                                    setTaskArray={setTaskArray}
                                />
                            )
                        })
                    }
                    <div className='port'>
                        {
                            role === 'user' ? '' : <div className='port_user'>
                                {
                                    users.map(items => {
                                        return (
                                            <User
                                                key={items._id}
                                                items={items}
                                                array={array}
                                                setArray={setArray}
                                            />
                                        )
                                    })
                                }
                            </div>
                        }
                        <div className='port_active'>
                            <h5>Users</h5>
                            {
                                arr.map((items, index) => {
                                    return (
                                        <p key={index}>{items.name}</p>
                                    )
                                })
                            }
                        </div>
                    </div>
                    {
                        array.length >= 2 ?
                            (role === 'user' ? <div className='user'><p>Group name:</p><span>{group}</span></div> : <div className="control">
                                <label>Group name</label>
                                <input
                                    type="text"
                                    placeholder='Group name'
                                    value={group}
                                    onChange={(e) => {
                                        setGroup(e.target.value)
                                    }}
                                />
                            </div>) : ''
                    }
                    <div className='date'>
                        {
                            role === 'user' ? <div className='user'><p>Date:</p><span>{didlineDate.substring(0,10)}</span></div> : <div className="control">
                                <label>Date</label>
                                <InputMask
                                    name="end"
                                    mask="99.99.9999"
                                    placeholder='date'
                                    value={didlineDate}
                                    onChange={(e) => setDidlineDate(e.target.value)}
                                />
                            </div>
                        }
                        {
                            role === 'user' ? '' : <div className="control">
                                <label>Time</label>
                                <InputMask
                                    name="time"
                                    mask="99:99"
                                    placeholder='time'
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                />
                            </div>
                        }
                    </div>
                    <div
                        className='button'
                        onClick={() => onSubmit()}
                    >
                        save
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Task