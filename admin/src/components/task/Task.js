import React, { useState, useEffect } from 'react'
import { taskShow } from '../../redux/action/userAction'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'react-toastify'
import InputMask from 'react-input-mask';
import axios from 'axios'
import User from './taskId/User'
import ArrayTask from './taskId/ArrayTask'
import './task.css'

const Task = () => {


    const { token, id, taskId } = useSelector(state => state.userLogin)
    const [users, setUsers] = useState([])
    const [taskAdd, setTaskAdd] = useState("")
    const [taskArray, setTaskArray] = useState([])
    const [title, setTitle] = useState("")
    const [group, setGroup] = useState("")
    const [endDate, setEndDate] = useState("")
    const [description, setDescription] = useState("")
    const [array, setArray] = useState([])

    console.log("taskId", taskId)

    const dispatch = useDispatch()

    const getUser = (token) => {
        axios.get(`/api/user/other`, {
            headers: {
                authorization: `Bearer ${token}`
            }
        }).then(response => {
            setUsers(response.data.user)
        }).catch(err => console.log(err))
    }



    const onTask = () => {
        setTaskArray([...taskArray, {text: taskAdd}])
        setTaskAdd("")
    }

    


    const onSubmit = () => {
        const task = {
            title,
            description,
            group,
            endDate,
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
            toast.success(response.data.successMessage)
        }).catch(err => {
            toast.error(err.response.data.errorMessage)
        })
    }

    useEffect(() => {
        if(taskId){
            axios.get(`/api/task/userId/${taskId}`)
                  .then(response => {
                      const {title, description, endDate, array, group, taskArray } = response.data.userId
                      setTitle(title)
                      setGroup(group)
                      setArray(array)
                      setTaskArray(taskArray)
                      setDescription(description)
                      setEndDate(endDate)
                  })  
        }
    }, [taskId])


    const taskCircle = (id) => {

        for (let i = 0; i < taskArray.length; i++) {
            if (taskArray[i]._id === id){
                taskArray[i].isClick = !taskArray[i].isClick
                setTaskArray([...taskArray])
            }   
        }
    }

    useEffect(() => {
        getUser(token)
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
                    <div className="control">
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
                    <div className='add'>
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
                    {
                        taskArray.map((items, index) => {
                            return (
                                <ArrayTask
                                key={index + 1}
                                token={token}
                                taskId={taskId}
                                items={items}
                                taskCircle={taskCircle}
                                />
                            )
                        })
                    }
                    <div className='port_user'>
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
                    <div className="control">
                        <label>Group name</label>
                        <input
                            type="text"
                            placeholder='Group name'
                            value={group}
                            onChange={(e) => {
                                setGroup(e.target.value)
                            }}
                        />
                    </div>
                    <div className="control">
                        <label>Date/Time</label>
                        <InputMask
                            name="end"
                            mask="99.99.9999"
                            placeholder='date'
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
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