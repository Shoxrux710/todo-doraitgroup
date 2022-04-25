import React, { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { useSelector } from 'react-redux'
import axios from 'axios'
import UserId from './UserId';
import './user.css'

const User = () => {

    const { token } = useSelector(state => state.userLogin)
    const [users, setUsers] = useState([])

    const getAll = () => {
        axios.get('/api/user/other', {
            headers: {
                authorization: `Bearer ${token}`
            }
        }).then(response => {
            setUsers(response.data.user)
        }).catch(err => {
            toast.error(err.response.data.errorMessage)
        })
    }

    useEffect(() => {
        getAll()
    }, [])


    console.log("user", users)

    return (
        <div className='users'>
            <ul>
                <li>Ism Familiya</li>
                <li>Login</li>
                <li>Parol</li>
                <li>User/Admin</li>
                <li>Edit</li>
            </ul>
            {
                users.map(items => {
                    return (
                        <UserId
                        key={items._id}
                        items={items}
                        token={token}
                        getAll={getAll}
                        />
                    )
                })
            }
        </div>
    )
}

export default User