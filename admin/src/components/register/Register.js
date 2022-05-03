import React, { useState } from 'react'
import axios from 'axios';
import { toast } from 'react-toastify'
import {Link} from 'react-router-dom'
import { userInform } from '../../redux/action/userAction'
import { useDispatch } from 'react-redux'
import './register.css'

const Register = () => {

    const [name, setName] = useState("")
    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")
    const dispatch = useDispatch()


    const onSubmit = (e) => {
        e.preventDefault()
      
        const user = {
            login,
            password,
            name
        }
        axios.post('/api/user/register', user)
            .then(response => {
                toast.success(response.data.successMessage)
                setName("")
                setLogin("")
                setPassword("")
                dispatch(userInform(response.data))
            }).catch(err => {
                toast.error(err.response.data.errorMessage)
            })

    }

    return (
        <div className="register">
            <h2>Register</h2>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>Ism Familiya</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Login</label>
                    <input
                        type="text"
                        className="form-control"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Parol</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                        }}
                    />
                </div>
                <div className="button">
                    <button type="submit">register</button>
                </div>
                <div className="res">
                <Link to="/login">login</Link>
                </div>
            </form>
        </div>
    )
}

export default Register
