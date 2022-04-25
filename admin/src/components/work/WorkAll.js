import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import axios from 'axios'
import Wark from './Work'

const WorkAll = () => {

    const { task, token, role } = useSelector(state => state.userLogin)
    const [show, setShow] = useState(false)
    const [workOne, seteWorkOne] = useState([])
    const [workTwo, seteWorkTwo] = useState([])
    const [workThree, seteWorkThree] = useState([])
    const [workGroup, seteWorkGroup] = useState([])
    const [groupName, setGroupName] = useState('')

    const onGroup = (name) => {
        setShow(!show)
        setGroupName(name)

    }

    const getOne = (groupName) => {
        role === 'super-admin' || role === 'admin' ?
            axios.get(`/api/task/admin?groupName=${groupName}`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            }).then(response => {
                seteWorkOne(response.data.taskOne)
                seteWorkTwo(response.data.taskTwo)
                seteWorkThree(response.data.taskThree)
                seteWorkGroup(response.data.taskGroup)
            }).catch(err => {
                toast.error(err.response.data.errorMessage)
            }) :
            axios.get(`/api/task?groupName=${groupName}`, {
                headers: {
                    authorization: `Bearer ${token}`
                }
            }).then(response => {
                seteWorkOne(response.data.taskOne)
                seteWorkTwo(response.data.taskTwo)
                seteWorkThree(response.data.taskThree)
                seteWorkGroup(response.data.taskGroup)
            }).catch(err => {
                toast.error(err.response.data.errorMessage)
            })

    }

    useEffect(() => {
        getOne(groupName)
    }, [task, groupName])


    return (
        <div>
            <Wark
                workOne={workOne}
                workTwo={workTwo}
                workThree={workThree}
                workGroup={workGroup}
                getOne={getOne}
                show={show}
                setShow={setShow}
                onGroup={onGroup}
                setGroupName={setGroupName}
                groupName={groupName}
            />
        </div>
    )
}

export default WorkAll