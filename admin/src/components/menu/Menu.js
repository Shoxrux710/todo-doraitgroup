import React from 'react'
import { NavLink } from 'react-router-dom'
import {useDispatch, useSelector} from 'react-redux'
import { FaUser } from 'react-icons/fa';
import { FaCalendarAlt } from 'react-icons/fa';
import { AiFillFolderOpen } from 'react-icons/ai';
import { RiGroupLine } from 'react-icons/ri';
import { BsFillChatLeftTextFill } from 'react-icons/bs';
import './menu.css'

const Menu = () => {

  
  return (
    <div className='menu'>
      <ul>
        <li>
        <NavLink className="items" to="/work"><FaUser className='fa'/>Our work</NavLink>
        </li>
        <li>
        <NavLink className="items" to="/admin/message"><FaUser className='fa'/>Admin</NavLink>
        </li>
        <li>
        <NavLink className="items" to="/group"><RiGroupLine className='fa'/>New group</NavLink>
        </li>
        <li>
        <NavLink className="items" to="/message"><BsFillChatLeftTextFill className='fa'/>New chat</NavLink>
        </li>     
      </ul>
    </div>
  )
}

export default Menu