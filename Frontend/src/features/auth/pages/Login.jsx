import React from 'react'
import '../auth.form.scss'
import { useNavigate, Link } from 'react-router'
import { useAuth } from '../hooks/useAuth';
import { useState } from 'react';


const Login = () => {
  const {loading, handleLogin} = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
        await handleLogin({ email, password });
        navigate("/");
    } catch (error) {
        alert(
            error.response?.data?.message ||
            "Login failed"
        );
    }
  }
  if (loading) {
    return (<main>Loading...</main>)
  }


  return (
    <main className="auth-page">
      <div className="auth-card">
        <h1>Welcome Back</h1>
        <p className="auth-subtitle">
  Continue building your interview strategy
</p>

        <form onSubmit={handleSubmit} className='form-container'>
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

            <button className='button primary-button'>Sign In</button>
        </form>
        <p>Don't have an account? <Link to="/register">Register here</Link></p>
      </div>
    </main>
  )
}

export default Login
