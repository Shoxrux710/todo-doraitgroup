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
    const [groups, setGroups] = useState([])
    const [loading, setLoading] = useState(true)

    const onGroup = (name) => {
        setShow(!show)
        setGroupName(name)

    }

    const getOne = (groupName) => {
        axios.get(`/api/task?groupName=${groupName}`, {
            headers: {
                authorization: `Bearer ${token}`
            }
        }).then(response => {
            seteWorkOne(response.data.taskOne)
            seteWorkTwo(response.data.taskTwo)
            seteWorkThree(response.data.taskThree)
            seteWorkGroup(response.data.taskGroup)
            let groupAll = []
            response.data.taskGroup.forEach(e => {
                groupAll.push(e.group)
            })
            let data = [...new Set(groupAll)]
            setGroups(data)
            setLoading(false)
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
                groups={groups}
                setShow={setShow}
                onGroup={onGroup}
                setGroupName={setGroupName}
                groupName={groupName}
                loading={loading}
            />
        </div>
    )
}

export default WorkAll