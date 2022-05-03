import React from 'react'
import Navbar from '../navbar/Navbar'
import WorkAll from '../work/WorkAll'
import Message from '../message/Message'
import Group from '../group/Group'
import User from '../users/User'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './header.css'

import io from 'socket.io-client'

const domen = window.location.hostname === 'localhost' ? 'ws://localhost:4005' : `ws://${window.location.hostname}:4000/`

const socket = io(domen)

const Header = () => {


  return (
    <div className='header'>
      <Navbar />
      <div className='home'>
        <Routes>
          <Route index path="/work" element={<WorkAll />} />
          <Route index path="/users" element={<User/>} />
          <Route index path="/message" element={<Message socket={socket} />} />
          <Route index path="/group" element={<Group socket={socket} />} />
          <Route path="*" element={<WorkAll />} />
        </Routes>
      </div>
    </div>
  )
}

export default Header