import React, { useState, useEffect } from 'react'
import Task from '../../components/task/Task'
import { logOut, taskShow, taskIdShow } from '../../redux/action/userAction'
import { BiBell } from 'react-icons/bi';
import { FaUser } from 'react-icons/fa';
import axios from 'axios'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import './navbar.css'


const Navbar = () => {

  const [propsId, setPropsId] = useState({})
  const [didlineAll, setDidlineAll] = useState([])
  const [show, setShow] = useState(false)
  const [userShow, setUserShow] = useState(false)

  const { token, task, role, id, call } = useSelector(state => state.userLogin)
  const dispatch = useDispatch()

  const login = propsId ? propsId.login : ''


  const getDidline = () => {
    axios.get(`/api/task/navbar?userId=${id}`, {
      headers: {
        authorization: `Bearer ${token}`
      }
    }).then(response => {
      setDidlineAll(response.data.didlineTask)
    }).catch(err => console.log(err))

  }

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
    getDidline()
  }, [token, call])



  return (
    <div className='navbar'>
      <h3>Logo</h3>
      <div className="form">
        {
          role === 'user' ? '' : <div
            className='navbar_task'
            onClick={() => {
              dispatch(taskIdShow(null))
              dispatch(taskShow(false))
            }}
          >Add task</div>
        }
        {
          didlineAll.length ? <div className="bell">
          <BiBell
            className="fa"
            onClick={() => setShow(!show)}
          /><span>{didlineAll.length}</span>
          <div className={show ? 'button' : 'button active'}>
            {
              didlineAll.map(items => {
                const todayDate = new Date();
                const didlineDate = new Date(items.didline.didlineDate);
                const utcYear = didlineDate.getUTCFullYear();
                const utcMonth = didlineDate.getUTCMonth();
                const utcDay = didlineDate.getUTCDate();
                const utcHours = didlineDate.getUTCHours();
                const utcMinutes = didlineDate.getUTCMinutes();

                const remainderDate = new Date(utcYear, utcMonth, utcDay, utcHours, utcMinutes) - todayDate;

                const day = Math.floor((remainderDate / 1000 / 60 / 60 / 24));
                const hour = Math.floor(((remainderDate / 1000 / 60 / 60) % 24));
                const minutes = Math.floor(((remainderDate / 1000 / 60) % 60));
                const seconds = Math.ceil((remainderDate / 1000) % 60);

                return (
                  <div
                    className="button-items"
                    key={items._id}
                  >
                    <h4>{items.title}</h4>
                    <p>{day} kun {hour}:{minutes}:{seconds} muddat qoldi</p>

                  </div>
                )
              })
            }
          </div>
          {show ? <div className='out-block' onClick={()=>setShow(false)} />: null}
          {userShow ? <div className='out-user' onClick={()=>setUserShow(false)} />: null}
        </div> : ''
        }
        <div 
         onClick={()=>setUserShow(!userShow)}
        className='name'>{login} <FaUser
         className="fa" 
         />
         <ul className={userShow ? '' : 'active'}>
           <li>profil</li>
           <li
            onClick={() => { dispatch(logOut()) }}
           >chiqish</li>
         </ul>
        </div>
      </div>
      {
        !task ? <Task /> : ''
      }
    </div>
  )
}

export default Navbar