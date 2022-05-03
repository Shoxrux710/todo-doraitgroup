import React, { useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { userInform } from '../../redux/action/userAction'
import { useDispatch } from 'react-redux'
import {Link} from 'react-router-dom'
import './login.css'

const Login = () => {

    const [login, setLogin] = useState("")
    const [password, setPassword] = useState("")

    const dispatch = useDispatch()

    const onSubmit = (e) => {
        e.preventDefault()
      
        const user = {
            login,
            password
        }
        axios.post('/api/user/login', user)
            .then(response => {
                toast.success(response.data.msg)
                dispatch(userInform(response.data))
            }).catch(err => {
                toast.error(err.response.data.errorMessage)
            })

    }

    return (
        <div className="login">
            <h2>Logo</h2>
            <form onSubmit={onSubmit}>
                <div className="form-group">
                    <label>login</label>
                    <input
                        type="text"
                        className="form-control"
                        value={login}
                        onChange={(e) => setLogin(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>parol</label>
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
                    <button type="submit">login</button>
                </div>
                <div className="res">
                <Link to="/register">register</Link>
                </div>
            </form>
        </div>
    )
}

export default Login
