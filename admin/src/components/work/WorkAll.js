import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import {useSelector} from 'react-redux'
import axios from 'axios'
import Wark from './Work'

const WorkAll = () => {

    const { task } = useSelector(state => state.userLogin)
    const [workOne, seteWorkOne] = useState([])
    const [workTwo, seteWorkTwo] = useState([])
    const [workThree, seteWorkThree] = useState([])

    const getOne = () => {
        axios.get('/api/task')
              .then(response => {
                seteWorkOne(response.data.taskOne)
                seteWorkTwo(response.data.taskTwo)
                seteWorkThree(response.data.taskThree)
              }).catch(err => {
                  console.log(err.response.data.errorMessage)
              })
    }



    useEffect(() => {
        getOne()
    }, [task])


    return (
        <div>
            <Wark 
            workOne={workOne}
            workTwo={workTwo}
            workThree={workThree}
            getOne={getOne} />
        </div>
    )
}

export default WorkAll