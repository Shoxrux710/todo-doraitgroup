import React, { useState, useEffect } from 'react'
import Task from '../../components/task/Task'
import {logOut, taskShow, taskIdShow} from '../../redux/action/userAction'
import { BiBell } from 'react-icons/bi';
import { FaUser } from 'react-icons/fa';
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { Menu, Dropdown } from 'antd';
import './navbar.css'

const Navbar = () => {

  const [propsId, setPropsId] = useState({})

  const { token, task } = useSelector(state => state.userLogin)
  const dispatch = useDispatch()

  const login = propsId ? propsId.login : ''

  const getId = (token) => {
    axios.get('/api/user/date', {
      headers: {
        authorization: `Bearer ${token}`
      }
    }).then(response => {
      setPropsId(response.data.user)
    }).catch(err => console.log(err))
  }


  useEffect(() => {
    getId(token)
  }, [token])

  console.log("sdfsdf", propsId)

  const menu = (
    (
      <Menu>
        <Menu.Item key="1">
          <Link to="/admin/profile"
            className="menu_item"
          > profile</Link>
        </Menu.Item>
        <Menu.Item key="2">
          <div
            className="menu_item"
          onClick={() => {dispatch(logOut())}}
          > logout</div>
        </Menu.Item>
      </Menu>
    )
  );



  return (
    <div className='navbar'>
      <h3>Telegram</h3>
      <div className="form">
        <div 
        className='navbar_task'
        onClick={() => {
          dispatch(taskIdShow(null))
          dispatch(taskShow(false))
        }}
        >Add task</div>
        <div className="bell">
          <BiBell className="fa" /><span>{0}</span>
          <div className='bottom'>

          </div>
        </div>
        <Dropdown overlay={menu} trigger={['click']}>
          <Link to="#"
            className="ant-dropdown-link"
            onClick={e => e.preventDefault()}>
             <div className='name'>{login} <FaUser className="fa" /></div>
          </Link>
        </Dropdown>
        
      </div>
      {
        !task ? <Task/> : ''
      }
    </div>
  )
}

export default Navbar