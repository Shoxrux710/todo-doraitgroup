import React, { useState, useEffect } from 'react'
import { AiOutlineMore } from 'react-icons/ai';
import axios from 'axios'
import { toast } from 'react-toastify';

const UserId = ({ items, token, getAll }) => {

    const [show, setShow] = useState(false)

    const onModal = (id) => {
        axios.put(`/api/user/admin`, { id }, {
            headers: {
                authorization: `Bearer ${token}`
            }
        }).then(response => {
            setShow(!show)
            getAll()
            toast.success(response.data.successMessage)
        }).catch(err => {
            toast.error(err.response.data.errorMessage)
        })
    }

    return (
        <ul>
            <li>{items.name}</li>
            <li>{items.login}</li>
            <li>******</li>
            <li className={items.role === 'user' ? 'role' : 'role active'}>{items.role}</li>
            <li><AiOutlineMore
                className='edit'
                onClick={() => setShow(!show)}
            />
                <div className={show ? 'modal' : 'modal active'}>                  
                    <p
                    onClick={() => onModal(items._id)}
                    >{items.role === 'user' ? 'Admin berish' : `O'chirish`}</p>
                </div>
            </li>
        </ul>
    )
}

export default UserId