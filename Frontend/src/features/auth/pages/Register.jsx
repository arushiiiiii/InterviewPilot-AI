import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth';

const Register = () => {
    const navigate = useNavigate()
    const {loading, handleRegister} = useAuth()
    const [username, setUsername] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    
    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
          await handleRegister({username, email, password})
          navigate("/")
        } catch (err) {
          alert(error.response?.data?.message || "Resgitration failed")
        }
    }
  if (loading) {
    return (<main>Loading...</main>)
  }
  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Create Account</h1>
        <p className="auth-subtitle">
  Create an account to generate personalized interview plans
</p>

        <form onSubmit={handleSubmit} className='form-container'>
          <div className="input-group">
                <label htmlFor="username">Username</label>
                <input
                onChange={(e)=>{setUsername(e.target.value)}}
                type="text" id="username" name="username" placeholder="Enter your username" />
            </div>
            <div className="input-group">
                <label htmlFor="email">Email</label>
                <input
                onChange={(e)=>{setEmail(e.target.value)}}
                type="email" id="email" name="email" placeholder="Enter your email" />
            </div>
            <div className="input-group">
                <label htmlFor="password">Password</label>
                <input
                onChange={(e)=>{setPassword(e.target.value)}}
                type="password" id="password" name="password" placeholder="Enter your password" />
            </div>

            <button className='button primary-button'>Sign Up</button>
        </form>
        <p>Already have an account? <Link to="/login">Login here</Link></p>
      </div>
    </main>
  )
}

export default Register
