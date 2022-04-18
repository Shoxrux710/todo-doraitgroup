import React from 'react'
import Navbar from '../navbar/Navbar'
import WorkAll from '../work/WorkAll'
import Message from '../message/Message'
import Group from '../group/Group'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './header.css'

import io from 'socket.io-client'

const socket = io('ws://localhost:5000')

const Header = () => {
  return (
    <div className='header'>
      <Navbar />
      <div className='home'>
        <Routes>
          <Route index path="/work" element={<WorkAll />} />
          <Route index path="/message" element={<Message socket={socket} />} />
          <Route index path="/group" element={<Group socket={socket} />} />
        </Routes>
      </div>
    </div>
  )
}

export default Header