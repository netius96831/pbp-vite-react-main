import '../App.css'
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar';
import Login from '../components/Login';
import SaveRouteComponent from '../components/SaveRoute';
import { user } from '../utils/auth';
import { useEffect, useState } from 'react';
import { IdentityBar } from '../components/IdentityBar';

function App() {
  const [email, setEmail]  = useState('')
  const [name, setName]  = useState('')

  useEffect(() => {
    user.subscribe((user) => {
      setEmail(user?.email)
      setName(user?.name)
    })
  }, [])

  return (
    <div className="mx-auto w-[600px] p-2">
      {email ? (
        <>
          <IdentityBar name={name} />
          <Navbar />
          <SaveRouteComponent />
          <Outlet />
        </>
      ) : <Login />}
    </div>
  )
}

export default App
