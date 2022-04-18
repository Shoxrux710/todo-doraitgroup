import React from 'react'
import Menu from './components/menu/Menu'
import Header from './components/header/Header'
import Login from './components/login/Login'
import Register from './components/register/Register'
import { useSelector } from 'react-redux'
import { ToastContainer } from 'react-toastify'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import 'antd/dist/antd.css'
import 'react-toastify/dist/ReactToastify.css'
import './app.css'

const App = () => {

  const { auth } = useSelector(state => state.userLogin)

  const authRoutes = (
    <> <Menu />
      <Header /></>

  )

  const loginRoutes = (
    <Routes>
      <Route index path="/login" element={<Login />} />
      <Route index path="/register" element={<Register />} />
      <Route path="*" element={<Login />} />
    </Routes>
  )


  const routes = auth ? authRoutes : loginRoutes

  return (
    <div className='app'>
      <ToastContainer />
      <Router>
        {routes}
      </Router>
    </div>
  )
}

export default App