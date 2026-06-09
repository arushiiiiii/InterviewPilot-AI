import React from 'react'
import { useAuth } from '../hooks/useAuth';
import { Navigate } from 'react-router';

const Protected = ({children}) => {
    const { user, loading } = useAuth()

    if (loading) {
        return (<main>Loading...</main>)
    } 
    if (!user) {
        return <Navigate to="/login" />  // useNavigate cannot be used here as this is not a component, it is a wrapper. Hence we use Navigate component to redirect to login page if user is not authenticated.
    }

  return children
}

export default Protected
